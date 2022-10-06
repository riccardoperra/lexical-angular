import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {LexicalController} from '../../lexical.controller';
import {EditorState} from 'lexical';
import {mergeRegister} from '@lexical/utils';
import {registerPlainText} from '@lexical/plain-text';
import {registerDragonSupport} from '@lexical/dragon';
import {Unsubscribable} from 'rxjs';

export type LexicalPlainTextInitialState =
  | null
  | string
  | EditorState
  | (() => void);

@Component({
  selector: '[lexicalPlainText]',
  template: `
    <ng-content select="[lexicalContentEditable]"></ng-content>
    <ng-content select="[lexicalPlaceholder]"></ng-content>
    <!-- TODO: add integration -->
    <!-- <ng-content select="[lexicalDecorators]"></ng-content>-->
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LexicalPlainTextComponent implements OnInit, OnDestroy {
  @Input()
  initialEditorState?: LexicalPlainTextInitialState;

  listener: Unsubscribable | null = null;

  constructor(private readonly controller: LexicalController) {}

  ngOnInit(): void {
    this.listener = {
      unsubscribe: this.registerPlainText(),
    };
  }

  private registerPlainText(): () => void {
    return mergeRegister(
      registerPlainText(this.controller.editor),
      registerDragonSupport(this.controller.editor)
    );
  }

  ngOnDestroy(): void {
    this.listener?.unsubscribe();
  }
}
