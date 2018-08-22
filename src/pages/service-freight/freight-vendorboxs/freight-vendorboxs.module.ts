import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FreightVendorboxsPage } from './freight-vendorboxs';
import { DynamicComponent } from './dynamicComponent.directive';

@NgModule({
  declarations: [
    FreightVendorboxsPage,
  ],
  imports: [
    IonicPageModule.forChild(FreightVendorboxsPage),
  ],
})
export class FreightVendorboxsPageModule {}
