import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FreightVendorlistPage } from './freight-vendorlist';

@NgModule({
  declarations: [
    FreightVendorlistPage,
  ],
  imports: [
    IonicPageModule.forChild(FreightVendorlistPage),
  ],
})
export class FreightVendorlistPageModule {}
