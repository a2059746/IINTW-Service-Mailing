import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VendorTestPage } from './vendor-test';

@NgModule({
  declarations: [
    VendorTestPage,
  ],
  imports: [
    IonicPageModule.forChild(VendorTestPage),
  ],
})
export class VendorTestPageModule {}
