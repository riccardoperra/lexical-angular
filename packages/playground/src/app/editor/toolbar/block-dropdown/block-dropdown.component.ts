import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
} from '@angular/core';
import {LexicalController} from 'lexical-angular';
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  ElementNode,
  RangeSelection,
} from 'lexical';
import { $wrapNodes } from '@lexical/selection';
import {
  $createHeadingNode,
  $createQuoteNode,
  HeadingTagType,
} from '@lexical/rich-text';
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from '@lexical/list';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {IDENTITY} from '@taiga-ui/kit';

@Component({
  selector: 'lxc-toolbar-block-dropdown',
  template: `
    <tui-hosted-dropdown
      tuiDropdownAlign="left"
      [(open)]="open"
      [content]="dropdownContent"
    >
      <button type="button" class="toolbar-item block-controls">
        <span class="icon block-type" [ngClass]="blockType"></span>
        {{ blockTypeName }}
      </button>
    </tui-hosted-dropdown>
    <ng-template #dropdownContent>
      <tui-data-list class="dropdown">
        <button tuiOption (click)="onFormatParagraph()" class="item">
          <span class="icon paragraph"></span>
          <span class="text">Normal</span>
          <span class="active" *ngIf="blockType === 'paragraph'"></span>
        </button>
        <button tuiOption (click)="onFormatHeading('h1')" class="item">
          <span class="icon h1"></span>
          <span class="text">Heading 1</span>
          <span class="active" *ngIf="blockType === 'h1'"></span>
        </button>
        <button tuiOption (click)="onFormatHeading('h2')" class="item">
          <span class="icon h2"></span>
          <span class="text">Heading 2</span>
          <span class="active" *ngIf="blockType === 'h2'"></span>
        </button>
        <button tuiOption (click)="onFormatHeading('h3')" class="item">
          <span class="icon h3"></span>
          <span class="text">Heading 3</span>
          <span class="active" *ngIf="blockType === 'h3'"></span>
        </button>
        <button tuiOption (click)="onFormatBulletList()" class="item">
          <span class="icon bullet-list"></span>
          <span class="text">Bullet list</span>
          <span class="active" *ngIf="blockType === 'ul'"></span>
        </button>
        <button tuiOption (click)="onFormatNumberedList()" class="item">
          <span class="icon numbered-list"></span>
          <span class="text">Numbered list</span>
          <span class="active" *ngIf="blockType === 'ol'"></span>
        </button>
        <button tuiOption (click)="onFormatQuote()" class="item">
          <span class="icon numbered-list"></span>
          <span class="text">Quote</span>
          <span class="active" *ngIf="blockType === 'quote'"></span>
        </button>
      </tui-data-list>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LexicalToolbarBlockDropdownComponent),
      multi: true,
    },
  ],
})
export class LexicalToolbarBlockDropdownComponent
  implements  ControlValueAccessor
{
  blockTypeToBlockName: Record<string, string> = {
    code: 'Code Block',
    h1: 'Heading 1',
    h2: 'Heading 2',
    h3: 'Heading 3',
    h4: 'Heading 4',
    h5: 'Heading 5',
    ol: 'Numbered List',
    paragraph: 'Normal',
    quote: 'Quote',
    ul: 'Bulleted List',
  };
  blockType = '';
  open = false;
  onChange: (value: string) => void = IDENTITY;
  onTouched: () => void = () => void 0;

  get blockTypeName(): string {
    return this.blockTypeToBlockName[this.blockType] as string;
  }

  constructor(private readonly controller: LexicalController) {}

  writeValue(obj: string): void {
    this.blockType = obj;
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onFormatParagraph(): void {
    this.open = false;

    if (this.blockType !== 'paragraph') {
      this.controller.editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $wrapNodes(selection as RangeSelection, () =>
            $createParagraphNode()
          );
        }
      });
    }
  }

  onFormatHeading(headingSize: HeadingTagType) {
    this.open = false;

    if (this.blockType !== headingSize) {
      this.controller.editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(
            selection as RangeSelection,
            // TODO: fix type
            () => $createHeadingNode(headingSize) as unknown as ElementNode
          );
        }
      });
    }
  }

  onFormatBulletList() {
    this.open = false;

    if (this.blockType !== 'ul') {
      this.controller.editor.dispatchCommand(
        INSERT_UNORDERED_LIST_COMMAND,
        undefined
      );
    } else {
      this.controller.editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  }

  onFormatNumberedList() {
    this.open = false;

    if (this.blockType !== 'ol') {
      this.controller.editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      this.controller.editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  }

  onFormatQuote() {
    this.open = false;

    if (this.blockType !== 'quote') {
      this.controller.editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection as RangeSelection, () =>
            $createQuoteNode()
          );
        }
      });
    }
  }
  
}
