import {NgModule} from '@angular/core';
import {LexicalModule} from 'lexical-angular';
import {PlaygroundEditorComponent} from './editor.component';
import {CommonModule} from '@angular/common';
import {LexicalToolbarComponent} from './toolbar/toolbar.component';
import {LexicalToolbarBlockDropdownComponent} from './toolbar/block-dropdown/block-dropdown.component';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiDropdownModule,
  TuiHintModule,
  TuiHostedDropdownModule,
  TuiLinkModule,
  TuiSvgModule,
  TuiTextfieldControllerModule,
  TuiWrapperModule,
} from '@taiga-ui/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {
  TuiDataListWrapperModule,
  TuiInputModule,
  TuiSelectModule,
} from '@taiga-ui/kit';
import {LexicalListPluginModule} from '../../../../lexical-angular/src/lib/plugins/list';
import {LexicalFloatingLinkEditorComponent} from './toolbar/floating-link-editor/floating-link-editor.component';
import {TuiAutoFocusModule} from '@taiga-ui/cdk';

@NgModule({
  imports: [
    CommonModule,
    LexicalModule,
    TuiDropdownModule,
    TuiButtonModule,
    TuiHostedDropdownModule,
    TuiDataListModule,
    FormsModule,
    TuiSelectModule,
    TuiDataListWrapperModule,
    TuiTextfieldControllerModule,
    LexicalListPluginModule,
    ReactiveFormsModule,
    TuiHintModule,
    TuiInputModule,
    TuiAutoFocusModule,
    TuiWrapperModule,
    TuiLinkModule,
    TuiSvgModule
  ],
  exports: [PlaygroundEditorComponent],
  declarations: [
    PlaygroundEditorComponent,
    LexicalToolbarComponent,
    LexicalToolbarBlockDropdownComponent,
    LexicalFloatingLinkEditorComponent,
  ],
  providers: [],
})
export class PlaygroundEditorModule {}
