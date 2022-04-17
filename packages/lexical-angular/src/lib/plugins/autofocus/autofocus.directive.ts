import {Directive, Input, OnInit} from '@angular/core';
import {LexicalController} from '../../lexical.controller';

@Directive({selector: '[lexicalAutofocus]'})
export class LexicalAutofocusDirective implements OnInit {
  @Input('lexicalAutofocus')
  autofocus: boolean = true;

  constructor(private readonly controller: LexicalController) {}

  ngOnInit(): void {
    if (this.autofocus) {
      this.controller.editor.focus();
    }
  }
}
