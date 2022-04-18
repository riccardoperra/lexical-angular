const blockTypes = [
  'paragraph',
  'quote',
  'code',
  'h1',
  'h2',
  'h3',
  'ul',
  'ol',
] as const;

export const supportedBlockTypes = new Set<string>(blockTypes);

export type EditorBlockTypes = typeof blockTypes[number] | string;

export const blockTypeToBlockName = {
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
