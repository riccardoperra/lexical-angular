import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {NxWelcomeComponent} from './nx-welcome.component';
import {RouterModule} from '@angular/router';
import {
  TUI_BUTTON_OPTIONS,
  TuiAlertModule,
  TuiButtonOptions,
  TuiDialogModule,
  TuiRootModule,
} from '@taiga-ui/core';
import {MainModule} from './main/main.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [AppComponent, NxWelcomeComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([], {initialNavigation: 'enabledBlocking'}),
    TuiRootModule,
    TuiDialogModule,
    TuiAlertModule,
    MainModule,
  ],
  providers: [
    {
      provide: TUI_BUTTON_OPTIONS,
      useValue: {
        size: 'm',
        shape: 'square',
        appearance: 'primary',
      } as TuiButtonOptions,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
