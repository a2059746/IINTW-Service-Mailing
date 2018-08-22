import { UploadimgProvider } from './../../../providers/uploadimg/uploadimg';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FreightOdererInfoCheckPage } from './freight-oderer-info-check';

@NgModule({
  declarations: [
    FreightOdererInfoCheckPage,
  ],
  imports: [
    IonicPageModule.forChild(FreightOdererInfoCheckPage),
  ],
  providers: [
    UploadimgProvider
  ]
})
export class FreightOdererInfoCheckPageModule {}
