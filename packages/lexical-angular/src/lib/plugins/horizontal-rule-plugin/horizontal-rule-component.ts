import {
  Component,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {mergeRegister} from '@lexical/utils';
import {
  $createNodeSelection,
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  $setSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  NodeKey,
} from 'lexical';
import {BehaviorSubject, map, merge, Observable, Unsubscribable} from 'rxjs';
import {LexicalController} from '../../lexical.controller';
import {AngularNode} from '../common/angular-node';
import {$isHorizontalRuleNode} from './horizontal-rule-node';

@Component({
  selector: 'horizontal-rule-node',
  template: '<hr [className]="isSelected$ | async " />',
  styles: [
    `
      hr {
        padding: 2px;
        border: none;
        margin: 1em 0;
        cursor: pointer;
      }
      hr:after {
        content: '';
        display: block;
        height: 2px;
        background-color: #ccc;
        line-height: 2px;
      }
      hr.selected {
        outline: 2px solid rgb(60, 132, 244);
        user-select: none;
      }
    `,
  ],
})
export class HorizontalRuleComponent implements AngularNode, OnInit, OnDestroy {
  @Input()
  nodeKey!: NodeKey;
  isSelected$$$ = new BehaviorSubject<boolean>(false);
  isSelected$?: Observable<string>;

  listener: Unsubscribable | null = null;

  constructor(
    readonly controller: LexicalController,
    @Inject(ElementRef)
    private readonly elementRef: ElementRef<HTMLElement>
  ) {}

  ngOnInit(): void {
    this.isSelected$ = merge(
      this.isSelected$$$,
      this.controller.isSelected(this.nodeKey)
    ).pipe(map(it => (it ? 'selected' : '')));

    const {editor} = this.controller;

    this.listener = {
      unsubscribe: mergeRegister(
        editor.registerCommand(
          CLICK_COMMAND,
          (event: MouseEvent) => {
            editor.update(() => {
              const hrElem = this.elementRef.nativeElement;
              this.isSelected$$$.next(false);

              if (event.target === hrElem.firstChild) {
                let selection = $getSelection();

                if (!event.shiftKey) {
                  if ($isNodeSelection(selection)) {
                    selection.clear();
                  }
                }

                if (!$isNodeSelection(selection)) {
                  selection = $createNodeSelection();
                  $setSelection(selection);
                }

                selection.add(this.nodeKey);
                this.isSelected$$$.next(true);
              }
            });

            return false;
          },
          COMMAND_PRIORITY_LOW
        ),
        editor.registerCommand(
          KEY_DELETE_COMMAND,
          this.onDelete.bind(this),
          COMMAND_PRIORITY_LOW
        ),
        editor.registerCommand(
          KEY_BACKSPACE_COMMAND,
          this.onDelete.bind(this),
          COMMAND_PRIORITY_LOW
        )
      ),
    };
  }

  onDelete(payload: KeyboardEvent) {
    if (this.isSelected$$$.value && $isNodeSelection($getSelection())) {
      const event: KeyboardEvent = payload;
      event.preventDefault();
      const node = $getNodeByKey(this.nodeKey);
      if (!!node && $isHorizontalRuleNode(node)) {
        node.remove();
      }
      this.isSelected$$$.next(false);
    }
    return false;
  }

  ngOnDestroy(): void {
    console.info(`${this.constructor.name} [#${this.nodeKey}] was destroyed`);

    this.isSelected$$$.complete();
    this.listener?.unsubscribe();
  }
}
