import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Injector,
} from '@angular/core';
import {COMMAND_PRIORITY_CRITICAL, LexicalController} from 'lexical-angular';
import {EditorBlockTypes, supportedBlockTypes} from './blocks';
import {
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  ElementFormatType,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  INDENT_CONTENT_COMMAND,
  OUTDENT_CONTENT_COMMAND,
  RangeSelection,
  REDO_COMMAND,
  UNDO_COMMAND,
} from 'lexical';
import {
  $getSelectionStyleValueForProperty,
  $isParentElementRTL,
  $patchStyleText,
} from '@lexical/selection';
import {getSelectedNode} from './helpers';
import {$isLinkNode, TOGGLE_LINK_COMMAND} from '@lexical/link';
import {$isListNode, ListNode} from '@lexical/list';
import {$getNearestNodeOfType} from '@lexical/utils';
import {$isHeadingNode, HeadingNode} from '@lexical/rich-text';
import {defer, map, startWith} from 'rxjs';
import {TUI_BUTTON_OPTIONS, TuiButtonOptions} from '@taiga-ui/core';
import {LexicalFloatingLinkEditorComponent} from './floating-link-editor/floating-link-editor.component';

@Component({
  selector: 'lxc-toolbar',
  templateUrl: './toolbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: TUI_BUTTON_OPTIONS,
      useValue: {
        size: 's',
        appearance: 'flat',
      } as TuiButtonOptions,
    },
  ],
})
export class LexicalToolbarComponent implements AfterViewInit {
  readonly fontSizeItems: string[] = [
    '10px',
    '11px',
    '12px',
    '13px',
    '14px',
    '15px',
    '16px',
    '17px',
    '18px',
    '19px',
    '20px',
  ];

  readonly fontFamilyItems: string[] = [
    'Arial',
    'Courier New',
    'Georgia',
    'Times New Roman',
    'Trebuchet MS',
    'Verdana',
  ];

  blockType: EditorBlockTypes = 'paragraph';
  selectedElementKey: string | null = null;
  fontSize = '15px';
  fontFamily = 'Arial';
  isLink = false;
  isBold = false;
  isItalic = false;
  isUnderline = false;
  isStrikethrough = false;
  isCode = false;
  isRTL = false;

  readonly floatingLinkEditor = LexicalFloatingLinkEditorComponent;

  readonly canUndo$ = defer(() =>
    this.controller
      .registerCommand(
        CAN_UNDO_COMMAND,
        (payload: boolean) => false,
        COMMAND_PRIORITY_CRITICAL
      )
      .pipe(
        map(([canUndo]) => canUndo),
        startWith(false)
      )
  );

  readonly canRedo$ = defer(() =>
    this.controller
      .registerCommand(
        CAN_REDO_COMMAND,
        (payload: boolean) => false,
        COMMAND_PRIORITY_CRITICAL
      )
      .pipe(
        map(([canRedo]) => canRedo),
        startWith(false)
      )
  );

  constructor(
    private readonly controller: LexicalController,
    private readonly injector: Injector
  ) {}

  get showBlockTypeFormat(): boolean {
    return supportedBlockTypes.has(this.blockType);
  }

  ngAfterViewInit() {
    this.controller.editor.registerUpdateListener(({editorState}) => {
      editorState.read(() => this.updateToolbar());
    });
  }

  onUndo(): void {
    this.controller.editor.dispatchCommand(UNDO_COMMAND, null);
  }

  onRedo(): void {
    this.controller.editor.dispatchCommand(REDO_COMMAND, null);
  }

  onSetBold(): void {
    this.controller.editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
  }

  onSetItalic(): void {
    this.controller.editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
  }

  onSetUnderline(): void {
    this.controller.editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
  }

  onSetStrikethrough(): void {
    this.controller.editor.dispatchCommand(
      FORMAT_TEXT_COMMAND,
      'strikethrough'
    );
  }

  onAlign(formatType: ElementFormatType): void {
    this.controller.editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, formatType);
  }

  onOutdent(): void {
    this.controller.editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, null);
  }

  onIndent(): void {
    this.controller.editor.dispatchCommand(INDENT_CONTENT_COMMAND, null);
  }

  onInsertLink(): void {
    if (!this.isLink) {
      this.controller.editor.dispatchCommand(TOGGLE_LINK_COMMAND, 'https://');
    } else {
      this.controller.editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }

  onFontFamilySelect(fontFamily: string): void {
    this.applyStyleText({
      'font-family': fontFamily,
    });
  }

  onFontSizeSelect(fontFamily: string): void {
    this.applyStyleText({
      'font-size': fontFamily,
    });
  }

  private applyStyleText(styles: Record<string, string>): void {
    this.controller.editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection as RangeSelection, styles);
      }
    });
  }

  private updateToolbar(): void {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const rangeSelection = selection as RangeSelection;
      const anchorNode = rangeSelection.anchor.getNode();
      const element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = this.controller.editor.getElementByKey(elementKey);

      this.isBold = rangeSelection.hasFormat('bold');
      this.isItalic = rangeSelection.hasFormat('italic');
      this.isUnderline = rangeSelection.hasFormat('underline');
      this.isStrikethrough = rangeSelection.hasFormat('strikethrough');
      this.isRTL = $isParentElementRTL(rangeSelection);

      const node = getSelectedNode(rangeSelection);
      const parent = node.getParent();
      this.isLink = $isLinkNode(parent) || $isLinkNode(node);

      if (!!elementDOM) {
        this.selectedElementKey = elementKey;
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType(
            anchorNode,
            ListNode
          ) as ListNode | null;
          this.blockType = parentList
            ? parentList.getTag()
            : (element as ListNode).getTag();
        } else {
          this.blockType = $isHeadingNode(element)
            ? (element as unknown as HeadingNode).getTag()
            : element.getType();
        }
      }

      this.fontSize = $getSelectionStyleValueForProperty(
        rangeSelection,
        'font-size',
        '15px'
      );
      this.fontFamily = $getSelectionStyleValueForProperty(
        rangeSelection,
        'font-family',
        'Arial'
      );
    }
  }
}
