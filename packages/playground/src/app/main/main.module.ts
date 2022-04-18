import {NgModule} from '@angular/core';
import {PlaygroundEditorModule} from '../editor/editor.module';
import {MainComponent} from './main.component';

@NgModule({
  imports: [PlaygroundEditorModule],
  exports: [MainComponent],
  declarations: [MainComponent],
  providers: [],
})
export class MainModule {}
