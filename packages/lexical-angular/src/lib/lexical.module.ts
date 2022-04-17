import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LexicalComposerDirective} from "./lexical-composer.directive";

@NgModule({
  imports: [CommonModule],
  declarations: [LexicalComposerDirective],
  exports: [LexicalComposerDirective]
})
export class LexicalModule {
}
