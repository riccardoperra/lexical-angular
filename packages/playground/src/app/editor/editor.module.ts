import {NgModule} from '@angular/core';
import {LexicalModule} from 'lexical-angular';
import {PlaygroundEditorComponent} from './editor.component';
import {CommonModule} from '@angular/common';
import {LexicalToolbarComponent} from './toolbar/toolbar.component';
import {LexicalToolbarBlockDropdownComponent} from './toolbar/block-dropdown/block-dropdown.component';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiDropdownControllerModule,
  TuiDropdownModule,
  TuiHintModule,
  TuiHostedDropdownModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TuiDataListWrapperModule, TuiSelectModule} from '@taiga-ui/kit';
import {LexicalListPluginModule} from '../../../../lexical-angular/src/lib/plugins/list';

@NgModule({
  imports: [
    CommonModule,
    LexicalModule,
    TuiDropdownModule,
    TuiButtonModule,
    TuiHostedDropdownModule,
    TuiDropdownControllerModule,
    TuiDataListModule,
    FormsModule,
    TuiSelectModule,
    TuiDataListWrapperModule,
    TuiTextfieldControllerModule,
    LexicalListPluginModule,
    ReactiveFormsModule,
    TuiHintModule,
  ],
  exports: [PlaygroundEditorComponent],
  declarations: [
    PlaygroundEditorComponent,
    LexicalToolbarComponent,
    LexicalToolbarBlockDropdownComponent,
  ],
  providers: [],
})
export class PlaygroundEditorModule {}
