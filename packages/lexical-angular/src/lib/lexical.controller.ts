import {Injectable, OnDestroy} from '@angular/core';
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  CLICK_COMMAND,
  CommandListenerPriority,
  COMMAND_PRIORITY_LOW,
  LexicalCommand,
  LexicalEditor,
  NodeKey,
} from 'lexical';
import {CommandListener, UpdateListener} from 'lexical/LexicalEditor';
import {Observable, ReplaySubject} from 'rxjs';
import {LexicalComposerDirective} from './lexical-composer.directive';

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
    this.editor.registerEditableListener(editable => observer.next(!editable))
  );

  readonly onUpdate$ = new Observable<Parameters<UpdateListener>[0]>(observer =>
    this.editor.registerUpdateListener(listener => observer.next(listener))
  );

  isSelected(nodeKey: NodeKey): Observable<boolean> {
    return new Observable<boolean>(observer =>
      this.editor.registerCommand<MouseEvent>(
        CLICK_COMMAND,
        (payload: MouseEvent) => {
          this.editor.update(() => {
            const node = $getNodeByKey(nodeKey);

            observer.next(!!node && node.isSelected());
          });

          return false;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }

  registerCommand<P>(
    command: LexicalCommand<P>,
    listener: CommandListener<P>,
    priority: CommandListenerPriority
  ): Observable<Parameters<CommandListener<P>>> {
    return new Observable<Parameters<CommandListener<P>>>(observer => {
      return this.editor.registerCommand<P>(
        command,
        (...args) => {
          observer.next(args);
          return listener(...args);
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
