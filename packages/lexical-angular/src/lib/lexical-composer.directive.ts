import {Directive, Input, OnInit} from '@angular/core';
import {createEditor, LexicalEditor} from 'lexical';
import {LexicalController} from './lexical.controller';

export type LexicalComposerConfig = Parameters<typeof createEditor>[0];

@Directive({
  selector: '[lexicalComposer]',
  providers: [LexicalController],
})
export class LexicalComposerDirective implements OnInit {
  @Input()
  lexicalInitialConfig?: LexicalComposerConfig;

  editor: LexicalEditor | null = null;

  ngOnInit(): void {
    this.initEditor();
  }

  private initEditor(): void {
    this.editor = createEditor(this.lexicalInitialConfig);
    const isEditable = this.lexicalInitialConfig?.editable ?? true;
    this.editor.setEditable(isEditable);
  }
}
