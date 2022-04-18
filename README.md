<h1 align="center">
  <a href="https://lexical-angular.vercel.app">lexical-angular</a>
</h1>

**⚠️ Lexical is currently in early development and APIs and packages are likely to change quite often.**

For documentation and more information about Lexical, be sure to visit the Lexical website.

[Angular playground](https://lexical-angular.vercel.app)

### Getting started with Angular

> Requires Angular 13.0.0 or higher.

Install `lexical` and `lexical-angular`

```bash
pnpm i lexical lexical-angular # pnpm
yarn add lexical lexical-angular #yarn
npm i lexical lexical-angular #npm
```

Below is an example of a basic plain text editor using lexical and lexical-angular.

```typescript
import { LexicalComposerConfig } from 'lexical-angular';
import { FormControl } from '@angular/forms';
import { EditorState } from 'lexical';

@Component({
  selector: 'lxc-text-editor',
  template: `
    <div
      lexicalComposer
      [lexicalInitialConfig]="editorConfig"
      [lexicalAutofocus]="true"
      (lexicalChangeEvent)="log($event)"
    >
      <div class="editor-container" lexicalPlainText>
        <div lexicalContentEditable class="editor-input"></div>
          <div *lexicalPlaceholder class="editor-placeholder">
            Enter some plain text...
          </div>
        </div>
    </div>
  `,
})
export class PlainTextEditorComponent {
  readonly editorConfig: LexicalComposerConfig = {
    onError: e => throw e,
    theme: {
      ltr: 'ltr',
      rtl: 'rtl',
      placeholder: 'editor-placeholder',
      paragraph: 'editor-paragraph',
    },
    readOnly: false,
    nodes: [],
  };

  log(event: EditorState): void {
    console.log(event);
  }
}
```
