import {Directive, OnDestroy, OnInit} from '@angular/core';
import {LexicalController} from '../../lexical.controller';
import {Unsubscribable} from 'rxjs';
import {mergeRegister} from '@lexical/utils';
import {
  INDENT_CONTENT_COMMAND,
  INSERT_PARAGRAPH_COMMAND,
  OUTDENT_CONTENT_COMMAND,
  COMMAND_PRIORITY_LOW,
} from 'lexical';
import {
  $handleListInsertParagraph,
  indentList,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  insertList,
  outdentList,
  REMOVE_LIST_COMMAND,
  removeList,
} from '@lexical/list';

@Directive({selector: '[lexicalComposer][lexicalList]'})
export class LexicalListDirective implements OnInit, OnDestroy {
  listener: Unsubscribable | null = null;

  constructor(private readonly controller: LexicalController) {}

  ngOnInit(): void {
    const {editor} = this.controller;
    this.listener = {
      unsubscribe: mergeRegister(
        editor.registerCommand(
          INDENT_CONTENT_COMMAND,
          () => indentList(),
          COMMAND_PRIORITY_LOW
        ),
        editor.registerCommand(
          OUTDENT_CONTENT_COMMAND,
          () => outdentList(),
          COMMAND_PRIORITY_LOW
        ),
        editor.registerCommand(
          INSERT_ORDERED_LIST_COMMAND,
          () => {
            insertList(editor, 'ol');
            return true;
          },
          COMMAND_PRIORITY_LOW
        ),
        editor.registerCommand(
          INSERT_UNORDERED_LIST_COMMAND,
          () => {
            insertList(editor, 'ul');
            return true;
          },
          COMMAND_PRIORITY_LOW
        ),
        editor.registerCommand(
          REMOVE_LIST_COMMAND,
          () => {
            removeList(editor);
            return true;
          },
          COMMAND_PRIORITY_LOW
        ),
        editor.registerCommand(
          INSERT_PARAGRAPH_COMMAND,
          () => $handleListInsertParagraph(),
          COMMAND_PRIORITY_LOW
        )
      ),
    };
  }

  ngOnDestroy(): void {
    this.listener?.unsubscribe();
  }
}
