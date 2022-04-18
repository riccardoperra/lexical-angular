import {Directive, OnDestroy, OnInit} from '@angular/core';
import {LexicalController} from '../../lexical.controller';
import {LinkNode, TOGGLE_LINK_COMMAND} from '@lexical/link';
import {merge, Subject, takeUntil} from 'rxjs';
import {toggleLink} from './toggle-link';

export type LexicalCharset = 'UTF-8' | 'UTF-16';

// TODO: Not available in lexical 0.2.1
// https://github.com/facebook/lexical/blob/main/packages/lexical/src/LexicalEditor.js
export const COMMAND_PRIORITY_EDITOR = 0;

@Directive({selector: '[lexicalComposer][lexicalLink]'})
export class LexicalLinkDirective implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  constructor(private readonly controller: LexicalController) {}

  ngOnInit(): void {
    const {editor, destroy$} = this.controller;
    if (!editor.hasNodes([LinkNode])) {
      throw new Error('LinkPlugin: LinkNode not registered on editor');
    }

    this.controller
      .registerCommand<string | null>(
        TOGGLE_LINK_COMMAND,
        () => true,
        COMMAND_PRIORITY_EDITOR
      )
      .pipe(takeUntil(merge(this.destroy$, destroy$)))
      .subscribe(([payload]) => {
        const url: string | null = payload;
        toggleLink(url);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
