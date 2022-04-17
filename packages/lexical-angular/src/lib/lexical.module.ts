import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LexicalComposerDirective} from './lexical-composer.directive';
import {LexicalAutofocusPluginModule} from './plugins/autofocus';
import {LexicalContentEditablePluginModule} from './plugins/content-editable';
import {LexicalOnChangePluginModule} from './plugins/on-change';
import {LexicalPlaceholderPluginModule} from './plugins/placeholder';
import {LexicalPlainTextPluginModule} from './plugins/plain-text';
import {LexicalRichTextPluginModule} from './plugins/rich-text';
import {LexicalLinkPluginDirective} from './plugins/link';

const PLUGINS = [
  LexicalAutofocusPluginModule,
  LexicalOnChangePluginModule,
  LexicalContentEditablePluginModule,
  LexicalPlaceholderPluginModule,
  LexicalPlainTextPluginModule,
  LexicalRichTextPluginModule,
  LexicalLinkPluginDirective,
];

@NgModule({
  imports: [CommonModule, PLUGINS],
  declarations: [LexicalComposerDirective],
  exports: [LexicalComposerDirective, PLUGINS],
})
export class LexicalModule {}
