import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LexicalComposerDirective} from './lexical-composer.directive';
import {LexicalAutofocusPluginModule} from './plugins/autofocus';
import {LexicalContentEditablePluginModule} from './plugins/content-editable';
import {LexicalOnChangePluginModule} from './plugins/on-change';
import {LexicalPlaceholderPluginModule} from './plugins/placeholder';
import {LexicalPlainTextPluginModule} from './plugins/plain-text';
import {LexicalRichTextPluginModule} from './plugins/rich-text';
import {LexicalLinkPluginModule} from './plugins/link';
import {LexicalClearEditorPluginModule} from './plugins/clear';
import {LexicalHistoryPluginModule} from './plugins/history';
import {LexicalControlValueAccessorPluginModule} from './plugins/control-value-accessor';
import {LexicalHorizontalRulePluginModule} from './plugins/horizontal-rule-plugin';
import {LexicalDecoratorsPluginModule} from './plugins/decorators/lexical-decorators.module';

const PLUGINS = [
  LexicalAutofocusPluginModule,
  LexicalClearEditorPluginModule,
  LexicalContentEditablePluginModule,
  LexicalControlValueAccessorPluginModule,
  LexicalHistoryPluginModule,
  LexicalLinkPluginModule,
  LexicalOnChangePluginModule,
  LexicalPlaceholderPluginModule,
  LexicalPlainTextPluginModule,
  LexicalRichTextPluginModule,
  LexicalDecoratorsPluginModule,
  LexicalHorizontalRulePluginModule,
];

@NgModule({
  imports: [CommonModule, PLUGINS],
  declarations: [LexicalComposerDirective],
  exports: [LexicalComposerDirective, PLUGINS],
})
export class LexicalModule {}
