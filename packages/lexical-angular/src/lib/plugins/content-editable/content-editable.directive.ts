import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  HostBinding,
  Inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {LexicalController} from '../../lexical.controller';
import {Subject, takeUntil} from 'rxjs';

@Directive({selector: 'div[lexicalContentEditable]'})
export class LexicalContentEditableDirective implements OnInit, OnDestroy {
  @Input()
  ariaActiveDescendantId?: string;

  @Input()
  ariaAutoComplete?: boolean;

  @Input()
  ariaControls?: string | null;

  @HostBinding('attr.aria-describedBy')
  @Input()
  ariaDescribedBy?: string | null;

  @Input()
  ariaExpanded?: boolean;

  @HostBinding('attr.aria-label')
  @Input()
  ariaLabel?: string | null = null;

  @HostBinding('attr.aria-labelledBy')
  @Input()
  ariaLabelledBy?: string;

  @HostBinding('attr.aria-multiline')
  @Input()
  ariaMultiline?: boolean;

  @Input()
  ariaOwneeID?: string | null = null;

  @HostBinding('attr.aria-required')
  @Input()
  ariaRequired?: string | null = null;

  @HostBinding('attr.autocapitalize')
  @Input()
  autoCapitalize?: boolean = false;

  @HostBinding('attr.autocomplete')
  @Input()
  autoComplete?: boolean = false;

  @HostBinding('attr.autocorrect')
  @Input()
  autoCorrect?: boolean = false;

  @HostBinding('attr.id')
  @Input()
  id?: string | null = null;

  @Input()
  readOnly?: boolean = false;

  @Input()
  role?: string = 'textbox';

  @HostBinding('attr.spellcheck')
  @Input()
  spellCheck?: boolean = true;

  @HostBinding('attr.tabindex')
  @Input()
  tabIndex?: number;

  @HostBinding('attr.data-testid')
  @Input()
  testId?: string;

  @HostBinding('attr.aria-activedescendant')
  get computedActiveDescendant() {
    return this.computedReadOnly ? null : this.ariaActiveDescendantId;
  }

  @HostBinding('attr.aria-autocomplete')
  get computedAriaAutoComplete() {
    return this.computedReadOnly ? null : this.ariaAutoComplete;
  }

  @HostBinding('attr.aria-controls')
  get computedAriaControls() {
    return this.computedReadOnly ? null : this.ariaControls;
  }

  @HostBinding('attr.aria-expanded')
  get computedAriaExpanded() {
    if (this.computedReadOnly) return null;
    if (this.role === 'combobox') return this.ariaExpanded;
    return null;
  }

  @HostBinding('attr.aria-owns')
  get computedAriaOwns() {
    if (this.computedReadOnly) return null;
    return this.ariaOwneeID;
  }

  @HostBinding('attr.role')
  get computedAriaRole() {
    if (this.computedReadOnly) return null;
    return this.role;
  }

  @HostBinding('attr.contentEditable')
  get computedContentEditable() {
    return !this.computedReadOnly;
  }

  private readonly destroy$ = new Subject<void>();

  computedReadOnly: boolean = true;

  constructor(
    private readonly controller: LexicalController,
    @Inject(ElementRef)
    private readonly elementRef: ElementRef<HTMLDivElement>,
    @Inject(ChangeDetectorRef)
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.controller.editor.setRootElement(this.elementRef.nativeElement);

    this.controller.readOnly$
      .pipe(takeUntil(this.destroy$))
      .subscribe(readOnly => {
        this.computedReadOnly = readOnly;
        this.changeDetectorRef.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
