import {Injectable, OnDestroy} from '@angular/core';
import {
  CommandListener,
  CommandListenerPriority,
  LexicalCommand,
  LexicalEditor,
  UpdateListener,
} from 'lexical';
import {Observable, ReplaySubject} from 'rxjs';
import { LexicalComposerDirective } from './lexical-composer.directive';

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

  registerCommand<P>(
    command: LexicalCommand<P>,
    priority: CommandListenerPriority
  ): Observable<Parameters<CommandListener<P>>> {
    return new Observable<Parameters<CommandListener<P>>>(observer => {
      return this.editor.registerCommand<P>(
        command,
        (...args) => {
          observer.next(args);
          return true;
        },
        priority
      );
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
