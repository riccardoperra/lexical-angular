import {
  Directive,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {LexicalController} from '../../lexical.controller';
import {Unsubscribable} from 'rxjs';
import {
  $createParagraphNode,
  $getRoot,
  $getSelection,
  CLEAR_EDITOR_COMMAND,
  COMMAND_PRIORITY_EDITOR,
} from 'lexical';

@Directive({selector: '[lexicalClearEditor]'})
export class LexicalClearEditorDirective implements OnInit, OnDestroy {
  @Input('lexicalClearEditor')
  clearFn?: (() => void) | null = null;

  @Output()
  clearEvent = new EventEmitter<void>();

  listener: Unsubscribable | null = null;

  constructor(private readonly controller: LexicalController) {}

  ngOnInit(): void {
    const {editor} = this.controller;

    this.listener = {
      unsubscribe: editor.registerCommand(
        CLEAR_EDITOR_COMMAND,
        () => {
          editor.update(() => {
            if (!this.clearFn) {
              const root = $getRoot();
              const selection = $getSelection();
              const paragraph = $createParagraphNode();
              root.clear();
              root.append(paragraph);
              if (selection) paragraph.select();
              this.clearEvent.emit();
            } else {
              this.clearFn();
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
