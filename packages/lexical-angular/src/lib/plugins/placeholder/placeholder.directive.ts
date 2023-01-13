import {
  Directive,
  Inject,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import {LexicalController} from '../../lexical.controller';
import {
  distinctUntilChanged,
  map,
  startWith,
  Subject,
  takeUntil,
} from 'rxjs';
import {$canShowPlaceholderCurry} from '@lexical/text';
import {EditorState, LexicalEditor} from 'lexical';

@Directive({selector: '[lexicalPlaceholder]'})
export class LexicalPlaceholderDirective implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly controller: LexicalController,
    @Inject(TemplateRef)
    private readonly templateRef: TemplateRef<unknown>,
    @Inject(ViewContainerRef)
    private readonly viewContainerRef: ViewContainerRef
  ) {}

  ngOnInit(): void {
    const {editor, onUpdate$} = this.controller;

    onUpdate$
      .pipe(
        map(({editorState}) => this.canShowPlaceholder(editor, editorState)),
        startWith(this.canShowPlaceholder(editor)),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(show => {
        if (!show) {
          this.viewContainerRef.clear();
        } else {
          this.viewContainerRef.createEmbeddedView(this.templateRef);
        }
      });
  }

  private canShowPlaceholder(
    editor: LexicalEditor,
    editorState?: EditorState
  ): boolean {
    const computedEditorState = editorState ?? editor.getEditorState();
    return computedEditorState.read(
      $canShowPlaceholderCurry(editor.isComposing())
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
