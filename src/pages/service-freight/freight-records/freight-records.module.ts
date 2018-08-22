import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FreightRecordsPage } from './freight-records';

@NgModule({
  declarations: [
    FreightRecordsPage,
  ],
  imports: [
    IonicPageModule.forChild(FreightRecordsPage),
  ],
})
export class FreightRecordsPageModule {}
