import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { ContactService } from './services/contact.service';
import { ValidateDirective } from './directives/validate.directive';

@NgModule({
  imports:      [ BrowserModule, FormsModule, HttpClientModule, ],
  declarations: [ AppComponent, ValidateDirective ],
  bootstrap:    [ AppComponent ],
  providers: [ContactService]
})
export class AppModule { }
