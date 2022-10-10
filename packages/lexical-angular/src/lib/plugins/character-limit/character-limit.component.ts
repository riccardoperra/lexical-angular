import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';

import {map, Subject, Unsubscribable} from 'rxjs';
import {LexicalController} from '../../lexical.controller';
import {OverflowNode} from '../overflow';
import {useCharacterLimit} from './character-limit';

const CHARACTER_LIMIT = 5;
let textEncoderInstance: null | TextEncoder = null;

function textEncoder(): null | TextEncoder {
  if (window.TextEncoder === undefined) {
    return null;
  }

  if (textEncoderInstance === null) {
    textEncoderInstance = new window.TextEncoder();
  }

  return textEncoderInstance;
}

function utf8Length(text: string) {
  const currentTextEncoder = textEncoder();

  if (currentTextEncoder === null) {
    // http://stackoverflow.com/a/5515960/210370
    const m = encodeURIComponent(text).match(/%[89ABab]/g);
    return text.length + (m ? m.length : 0);
  }

  return currentTextEncoder.encode(text).length;
}

@Component({
  selector: 'lexical-character-limit',
  template: `
    <span class="characters-limit" [ngClass]="className$ | async">
      {{ remainingCharacters$ | async }}
    </span>
  `,
  styles: [
    `
      .characters-limit {
        color: #888;
        font-size: 12px;
        text-align: right;
        display: block;
        position: absolute;
        left: 12px;
        bottom: 5px;
      }

      .characters-limit.characters-limit-exceeded {
        color: red;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterLimitComponent implements OnInit, OnDestroy {
  @Input()
  charset = 'UTF-16';
  @Input()
  set characterLimit(characterLimit: number) {
    this.listener?.unsubscribe();
    this.setup(characterLimit);
  }

  listener: Unsubscribable | null = null;
  remainingCharacters$ = new Subject<number>();
  className$ = this.remainingCharacters$.pipe(
    map(remainingCharacters =>
      remainingCharacters < 0 ? 'characters-limit-exceeded' : ''
    )
  );

  constructor(
    private readonly controller: LexicalController,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const {editor} = this.controller;

    if (!editor.hasNodes([OverflowNode])) {
      throw new Error(
        'useCharacterLimit: OverflowNode not registered on editor'
      );
    }
  }

  private setup(characterLimit: number = CHARACTER_LIMIT) {
    const {editor} = this.controller;

    const characterLimitProps = {
      remainingCharacters: (limit: number) => {
        this.remainingCharacters$.next(limit);
        this.cdr.detectChanges();
      },
      strlen: (text: string) => {
        if (this.charset === 'UTF-8') {
          return utf8Length(text);
        } else if (this.charset === 'UTF-16') {
          return text.length;
        } else {
          throw new Error('Unrecognized charset');
        }
      },
    };

    this.listener = {
      unsubscribe: useCharacterLimit(
        editor,
        characterLimit,
        characterLimitProps
      ),
    };
  }

  ngOnDestroy(): void {
    this.listener?.unsubscribe();
  }
}
