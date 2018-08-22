import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import { FormsModule } from '@angular/forms';
// import {Directive} from 'ionic2-input-mask'
//import { TextMaskModule } from 'angular2-text-mask';
// import {Ionic2MaskDirective} from "ionic2-mask-directive";
// import {Directive} from 'inoic3-text-mask'
// import { InputMaskModule } from 'ionic-input-mask';

// import { TextMaskModule } from 'angular2-text-mask';
// import { Directive } from 'ionic2-input-mask';
import { LoginPage } from './login';
@NgModule({
  declarations: [
    LoginPage,
    //Directive,
    // Ionic2MaskDirective,
  ],
  imports: [
    FormsModule,
    // InputMaskModule,
    // TextMaskModule,
    IonicPageModule.forChild(LoginPage),
    TranslateModule.forChild()
  ],
  exports: [
    LoginPage
  ],
})
export class LoginPageModule { }
