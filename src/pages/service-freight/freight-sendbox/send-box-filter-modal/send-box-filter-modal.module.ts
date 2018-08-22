import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendBoxFilterModalPage } from './send-box-filter-modal';

@NgModule({
  declarations: [
    SendBoxFilterModalPage,
  ],
  imports: [
    IonicPageModule.forChild(SendBoxFilterModalPage),
  ],
})
export class SendBoxFilterModalPageModule {}
