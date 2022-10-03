import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
  selector: 'lxc-playground-main',
  template: `
    <div class="h-full w-full">
      <div class="m-auto text-center">
        <h1>Lexical Angular Playground</h1>
        <p>Note: this is an experimental build of Lexical</p>
      </div>
      <div class="editor-shell">
        <lxc-playground-editor></lxc-playground-editor>
      </div>
      <div class="m-auto text-center">
        <h2>View source</h2>
        <ul>
          <li>
            <a
              href="https://github.com/riccardoperra/lexical-angular"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </li>
        </ul>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent {
  constructor() {}
}
