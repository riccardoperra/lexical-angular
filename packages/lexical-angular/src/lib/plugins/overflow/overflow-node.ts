import type {
  EditorConfig,
  LexicalNode,
  NodeKey,
  RangeSelection,
  SerializedElementNode,
  Spread,
} from 'lexical';

import {ElementNode} from 'lexical';

export type SerializedOverflowNode = Spread<
  {
    type: 'overflow';
    version: 1;
  },
  SerializedElementNode
>;

export class OverflowNode extends ElementNode {
  static override getType(): string {
    return 'overflow';
  }

  static override clone(node: OverflowNode): OverflowNode {
    return new OverflowNode(node.__key);
  }

  static override importJSON(
    serializedNode: SerializedOverflowNode
  ): OverflowNode {
    return $createOverflowNode();
  }

  static importDOM(): null {
    return null;
  }

  constructor(key?: NodeKey) {
    super(key);
    this.__type = 'overflow';
  }

  override exportJSON(): SerializedElementNode {
    return {
      ...super.exportJSON(),
      type: 'overflow',
    };
  }

  override createDOM(config: EditorConfig): HTMLElement {
    const div = document.createElement('span');
    const className = config.theme.characterLimit;
    if (typeof className === 'string') {
      div.className = className;
    }
    return div;
  }

  override updateDOM(prevNode: OverflowNode, dom: HTMLElement): boolean {
    return false;
  }

  override insertNewAfter(selection: RangeSelection): null | LexicalNode {
    const parent = this.getParentOrThrow();
    return parent.insertNewAfter(selection);
  }

  override excludeFromCopy(): boolean {
    return true;
  }
}

export function $createOverflowNode(): OverflowNode {
  return new OverflowNode();
}

export function $isOverflowNode(
  node: LexicalNode | null | undefined
): node is OverflowNode {
  return node instanceof OverflowNode;
}
