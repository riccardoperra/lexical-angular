import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  NodeSelection,
  RangeSelection,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import {LexicalController} from 'lexical-angular';
import {Subject, takeUntil} from 'rxjs';
import {getSelectedNode, positionEditorElement} from '../helpers';
import {$isLinkNode, LinkNode, TOGGLE_LINK_COMMAND} from '@lexical/link';

@Component({
  selector: 'lxc-floating-link-editor',
  template: `
    <div #editorRef class="link-editor">
      <ng-container *ngIf="editMode; else content">
        <tui-input
          tuiTextfieldSize="m"
          [formControl]="linkUrl"
          [tuiTextfieldLabelOutside]="true"
        >
          <input
            #inputRef
            tuiTextfield
            tuiAutoFocus
            (keydown.escape)="onEscape($event)"
            (keydown.enter)="onEnter($event)"
          />
        </tui-input>
      </ng-container>
      <ng-template #content>
        <div class="p-3" tuiWrapper appearance="textfield">
          <a
            tuiLink
            [href]="linkUrl.value"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ linkUrl.value }}
          </a>
          <div
            class="link-edit"
            role="button"
            tabIndex="0"
            (click)="editMode = true"
            (mousedown)="$event.preventDefault()"
          ></div>
        </div>
      </ng-template>
    </div>
  `,
})
export class LexicalFloatingLinkEditorComponent
  implements AfterViewInit, OnDestroy
{
  destroy$ = new Subject<void>();
  editMode = false;
  linkUrl = this.fb.control('');
  lastSelection: NodeSelection | null = null;
  mouseDownRef = false;

  @ViewChild('editorRef')
  private readonly editorRef?: ElementRef<HTMLDivElement>;

  constructor(
    private readonly fb: FormBuilder,
    private readonly changeDetectorRef: ChangeDetectorRef,
    @Inject(LexicalController) private readonly controller: LexicalController,
    private readonly viewContainerRef: ViewContainerRef
  ) {}

  ngAfterViewInit() {
    // Current component must be moved outside scope
    const element = this.viewContainerRef.element.nativeElement;
    document.body.appendChild(element);

    this.controller.editor.getEditorState().read(() => this.updateLinkEditor());

    this.controller.onUpdate$
      .pipe(takeUntil(this.destroy$))
      .subscribe(({editorState}) => {
        editorState.read(() => this.updateLinkEditor());
      });

    this.controller
      .registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => true,
        COMMAND_PRIORITY_LOW
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.updateLinkEditor());
  }

  onEnter(event: Event): void {
    event.preventDefault();
    if (this.lastSelection) {
      if (this.linkUrl.value !== '') {
        this.controller.editor.dispatchCommand(
          TOGGLE_LINK_COMMAND,
          this.linkUrl.value
        );
      }
      this.editMode = false;
    }
  }

  onEscape(event: Event): void {
    event.preventDefault();
    this.editMode = false;
  }

  private updateLinkEditor(): void {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection as RangeSelection);
      const parent = node.getParent();
      if ($isLinkNode(parent)) {
        this.linkUrl.setValue((parent as unknown as LinkNode).getURL());
      } else if ($isLinkNode(node)) {
        this.linkUrl.setValue((node as unknown as LinkNode).getURL());
      } else {
        this.linkUrl.setValue('');
      }
    }

    const editorElem = this.editorRef?.nativeElement;
    const nativeSelection = window.getSelection();
    const activeElement = document.activeElement;

    if (!editorElem) return;
    const rootElement = this.controller.editor.getRootElement();
    if (
      selection !== null &&
      nativeSelection &&
      !nativeSelection.isCollapsed &&
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode)
    ) {
      const domRange = nativeSelection.getRangeAt(0);
      let rect;
      if (nativeSelection.anchorNode === rootElement) {
        let inner = rootElement;
        while (inner.firstElementChild != null) {
          inner = inner.firstElementChild as HTMLElement;
        }
        rect = inner.getBoundingClientRect();
      } else {
        rect = domRange.getBoundingClientRect();
      }

      if (!this.mouseDownRef) {
        positionEditorElement(editorElem, rect);
      }
      this.lastSelection = selection as NodeSelection | null;
    } else if (!activeElement || activeElement.className !== 'link-input') {
      positionEditorElement(editorElem, null);
      this.lastSelection = null;
      this.editMode = false;
      this.linkUrl.setValue('');
    }
    this.changeDetectorRef.markForCheck();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
