import {LexicalRichTextComponent} from './rich-text.component';
import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  exports: [LexicalRichTextComponent],
  declarations: [LexicalRichTextComponent],
  imports: [CommonModule],
})
export class LexicalRichTextPluginModule {}
