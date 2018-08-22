import { SendBoxFilterComponent } from './send-box-filter/send-box-filter';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FreightSendboxPage } from './freight-sendbox';

@NgModule({
  declarations: [
    FreightSendboxPage,
    SendBoxFilterComponent,
  ],
  imports: [
    IonicPageModule.forChild(FreightSendboxPage),
  ],
})
export class FreightSendboxPageModule {}
