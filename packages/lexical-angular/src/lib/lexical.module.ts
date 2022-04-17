import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LexicalComposerDirective} from './lexical-composer.directive';
import {LexicalAutofocusPluginModule} from './plugins/autofocus';
import {LexicalContentEditablePluginModule} from './plugins/content-editable';
import {LexicalOnChangePluginModule} from './plugins/on-change';

const PLUGINS = [
  LexicalAutofocusPluginModule,
  LexicalOnChangePluginModule,
  LexicalContentEditablePluginModule,
];

@NgModule({
  imports: [CommonModule, PLUGINS],
  declarations: [LexicalComposerDirective],
  exports: [LexicalComposerDirective, PLUGINS],
})
export class LexicalModule {}
