import {Injectable, OnDestroy} from '@angular/core';
import {LexicalComposerDirective} from 'lexical-angular';
import {LexicalEditor} from 'lexical';
import {Observable, ReplaySubject} from 'rxjs';

@Injectable()
export class LexicalController implements OnDestroy {
  readonly destroy$ = new ReplaySubject<void>(1);

  get editor(): LexicalEditor {
    const {editor} = this.lexical;
    // prettier-ignore
    if (!editor) throw new Error('Cannot access Lexical instance before initialization');
    return editor;
  }

  constructor(private readonly lexical: LexicalComposerDirective) {}

  readonly readOnly$ = new Observable<boolean>(observer =>
    this.editor.registerReadOnlyListener(readOnly => observer.next(readOnly))
  );

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
