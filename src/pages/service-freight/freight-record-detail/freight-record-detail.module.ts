import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FreightRecordDetailPage } from './freight-record-detail';

@NgModule({
  declarations: [
    FreightRecordDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(FreightRecordDetailPage),
  ],
})
export class FreightRecordDetailPageModule {}
