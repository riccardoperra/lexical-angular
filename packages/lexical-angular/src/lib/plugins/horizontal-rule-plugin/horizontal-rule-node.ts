import { Type } from '@angular/core';
import {
  DecoratorNode,
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalEditor,
  LexicalNode,
  SerializedLexicalNode,
} from 'lexical';
import { HorizontalRuleComponent } from './horizontal-rule-component';

export type SerializedHorizontalRuleNode = SerializedLexicalNode & {
  type: 'horizontalRule';
  version: 1;
};

export class HorizontalRuleNode extends DecoratorNode<Type<HorizontalRuleComponent>> {
  static override getType(): string {
    return 'horizontalRule';
  }

  static override clone(node: HorizontalRuleNode): HorizontalRuleNode {
    return new HorizontalRuleNode(node.__key);
  }

  static override importJSON(
    serializedNode: SerializedHorizontalRuleNode
  ): HorizontalRuleNode {
    return $createHorizontalRuleNode();
  }

  static importDOM(): DOMConversionMap | null {
    return {
      hr: () => ({
        conversion: convertHorizontalRuleElement,
        priority: 0,
      }),
    };
  }

  override exportJSON(): SerializedLexicalNode {
    return {
      type: 'horizontalRule',
      version: 1,
    };
  }

  override exportDOM(): DOMExportOutput {
    return {element: document.createElement('hr')};
  }

  override createDOM(): HTMLElement {
    const div = document.createElement('div');
    div.style.display = 'contents';
    return div;
  }

  override getTextContent(): '\n' {
    return '\n';
  }

  override isInline(): false {
    return false;
  }

  override updateDOM(): false {
    return false;
  }

  override decorate(editor: LexicalEditor, config: EditorConfig): Type<HorizontalRuleComponent> {
    return HorizontalRuleComponent;
  }
}

function convertHorizontalRuleElement(): DOMConversionOutput {
  return {node: $createHorizontalRuleNode()};
}

export function $createHorizontalRuleNode(): HorizontalRuleNode {
  return new HorizontalRuleNode();
}

export function $isHorizontalRuleNode(node?: LexicalNode): boolean {
  return node instanceof HorizontalRuleNode;
}
