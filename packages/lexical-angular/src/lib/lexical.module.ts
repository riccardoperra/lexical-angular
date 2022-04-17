import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LexicalComposerDirective} from './lexical-composer.directive';
import {LexicalAutofocusPluginModule} from './plugins/autofocus';

const PLUGINS = [LexicalAutofocusPluginModule];

@NgModule({
  imports: [CommonModule, PLUGINS],
  declarations: [LexicalComposerDirective],
  exports: [LexicalComposerDirective, PLUGINS],
})
export class LexicalModule {}
