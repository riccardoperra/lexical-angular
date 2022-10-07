import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import { HorizontalRuleComponent } from './horizontal-rule-component';
import {HorizontalRuleDirective} from './horizontal-rule.directive';

@NgModule({
  exports: [HorizontalRuleDirective],
  imports: [CommonModule],
  declarations: [HorizontalRuleDirective, HorizontalRuleComponent],
})
export class LexicalHorizontalRulePluginModule {}
