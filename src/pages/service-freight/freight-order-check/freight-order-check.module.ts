import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FreightOrderCheckPage } from './freight-order-check';

@NgModule({
  declarations: [
    FreightOrderCheckPage,
  ],
  imports: [
    IonicPageModule.forChild(FreightOrderCheckPage),
  ],
})
export class FreightOrderCheckPageModule {}
