import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FmodalSelectCountryPage } from './fmodal-select-country';

@NgModule({
  declarations: [
    FmodalSelectCountryPage,
  ],
  imports: [
    IonicPageModule.forChild(FmodalSelectCountryPage),
  ],
})
export class FmodalSelectCountryPageModule {}
