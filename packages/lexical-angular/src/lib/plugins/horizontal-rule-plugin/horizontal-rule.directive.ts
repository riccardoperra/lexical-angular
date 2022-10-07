import {Directive, OnDestroy, OnInit} from '@angular/core';
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  LexicalCommand,
} from 'lexical';
import {Unsubscribable} from 'rxjs';
import {LexicalController} from '../../lexical.controller';
import {
  $createHorizontalRuleNode,
  HorizontalRuleNode,
} from './horizontal-rule-node';

export const INSERT_HORIZONTAL_RULE_COMMAND: LexicalCommand<void> =
  createCommand();

@Directive({
  selector: '[lexicalComposer][lexicalHorizontalRule]',
})
export class HorizontalRuleDirective implements OnInit, OnDestroy {
  listener: Unsubscribable | null = null;

  constructor(private readonly controller: LexicalController) {}

  ngOnInit(): void {
    const {editor} = this.controller;

    if (!editor.hasNodes([HorizontalRuleNode])) {
      throw new Error(
        'HorizontalRulePlugin: HorizontalRuleNode not registered on editor'
      );
    }

    this.listener = {
      unsubscribe: editor.registerCommand(
        INSERT_HORIZONTAL_RULE_COMMAND,
        () => {
          editor.update(() => {
            const selection = $getSelection();

            if (!$isRangeSelection(selection)) {
              return;
            }

            const focusNode = selection.focus.getNode();

            if (focusNode !== null) {
              const horizontalRuleNode = $createHorizontalRuleNode();
              selection.insertParagraph();
              selection.focus
                .getNode()
                .getTopLevelElementOrThrow()
                .insertBefore(horizontalRuleNode);
            }
          });

          return true;
        },
        COMMAND_PRIORITY_EDITOR
      ),
    };
  }

  ngOnDestroy(): void {
    this.listener?.unsubscribe();
  }
}
