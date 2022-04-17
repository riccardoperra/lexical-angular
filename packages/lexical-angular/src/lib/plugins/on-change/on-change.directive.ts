import {
  Directive,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {LexicalController} from '../../lexical.controller';
import {EditorState} from 'lexical';
import {Unsubscribable} from 'rxjs';

@Directive({selector: '[lexicalComposer]'})
export class LexicalOnChangeDirective implements OnInit, OnDestroy {
  @Input()
  ignoreInitialChange: boolean = true;

  @Input()
  ignoreSelectionChange: boolean = false;

  @Output()
  lexicalChangeEvent = new EventEmitter<EditorState>();

  listener: Unsubscribable | null = null;

  constructor(private readonly controller: LexicalController) {}

  ngOnInit(): void {
    this.listener = {
      unsubscribe: this.controller.editor.registerUpdateListener(
        ({editorState, dirtyElements, dirtyLeaves, prevEditorState}) => {
          if (
            this.ignoreSelectionChange &&
            dirtyElements.size === 0 &&
            dirtyLeaves.size === 0
          ) {
            return;
          }

          if (this.ignoreInitialChange && prevEditorState.isEmpty()) {
            return;
          }

          this.lexicalChangeEvent.emit(editorState);
        }
      ),
    };
  }

  ngOnDestroy() {
    this.listener?.unsubscribe();
  }
}
