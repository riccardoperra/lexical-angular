import {Injectable, OnDestroy} from '@angular/core';
import {LexicalComposerDirective} from 'lexical-angular';
import {LexicalEditor, UpdateListener} from 'lexical';
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

  readonly onUpdate$ = new Observable<Parameters<UpdateListener>[0]>(observer =>
    this.editor.registerUpdateListener(listener => observer.next(listener))
  );

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
