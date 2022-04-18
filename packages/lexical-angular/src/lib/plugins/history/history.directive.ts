import {
  Directive,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {LexicalController} from '../../lexical.controller';
import {
  createEmptyHistoryState,
  HistoryState,
  registerHistory,
} from '@lexical/history';

@Directive({selector: '[lexicalHistory]'})
export class LexicalHistoryDirective implements OnInit, OnChanges {
  @Input()
  lexicalHistoryState?: HistoryState | null = null;

  @Input('lexicalHistoryDelay')
  delay: number = 1000;

  constructor(private readonly controller: LexicalController) {}

  ngOnChanges(changes: SimpleChanges) {
    try {
      this.registerHistory();
    } catch {}
  }

  ngOnInit(): void {
    const historyState: HistoryState =
      this.lexicalHistoryState || createEmptyHistoryState();

    registerHistory(this.controller.editor, historyState, this.delay);
  }

  registerHistory(): void {
    const historyState: HistoryState =
      this.lexicalHistoryState || createEmptyHistoryState();

    registerHistory(this.controller.editor, historyState, this.delay);
  }
}
