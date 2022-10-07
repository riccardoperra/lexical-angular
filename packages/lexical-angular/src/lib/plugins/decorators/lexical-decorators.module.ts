import {NgModule} from '@angular/core';
import {LexicalDecoratorsDirective} from './lexical-decorators.directive';

@NgModule({
  exports: [LexicalDecoratorsDirective],
  declarations: [LexicalDecoratorsDirective],
})
export class LexicalDecoratorsPluginModule {}
