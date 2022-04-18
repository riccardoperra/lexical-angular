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
// @ts-expect-error: Fix type - Lexical dragon is not esm
import {registerDragonSupport} from '@lexical/dragon';
import {Unsubscribable} from 'rxjs';
import {registerRichText} from '@lexical/rich-text';

export type LexicalRichTextInitialState =
  | null
  | string
  | EditorState
  | (() => void);

@Component({
  selector: '[lexicalRichText]',
  template: `
    <ng-content></ng-content>
    <ng-content select="[lexicalContentEditable]"></ng-content>
    <ng-content select="[lexicalPlaceholder]"></ng-content>
    <!-- TODO: add integration -->
    <!-- <ng-content select="[lexicalDecorators]"></ng-content>-->
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LexicalRichTextComponent implements OnInit, OnDestroy {
  @Input()
  initialEditorState?: LexicalRichTextInitialState;

  listener: Unsubscribable | null = null;

  constructor(private readonly controller: LexicalController) {}

  ngOnInit(): void {
    this.listener = {
      unsubscribe: this.registerRichText(),
    };
  }

  private registerRichText(): () => void {
    return mergeRegister(
      registerRichText(this.controller.editor, this.initialEditorState),
      registerDragonSupport(this.controller.editor)
    );
  }

  ngOnDestroy(): void {
    this.listener?.unsubscribe();
  }
}
