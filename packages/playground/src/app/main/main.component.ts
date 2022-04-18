import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';

@Component({
  selector: 'lxc-playground-main',
  template: `
    <div class="h-full w-full">
      <div class="editor-shell">
        <lxc-playground-editor></lxc-playground-editor>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
