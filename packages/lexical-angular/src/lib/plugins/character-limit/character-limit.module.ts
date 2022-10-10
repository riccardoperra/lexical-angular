import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {CharacterLimitComponent} from './character-limit.component';

@NgModule({
  declarations: [CharacterLimitComponent],
  exports: [CharacterLimitComponent],
  imports: [CommonModule],
})
export class LexicalCharacterLimitPluginModule {}
