import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BarcodeModalPage } from './barcode-modal';
import { NgxBarcodeModule } from 'ngx-barcode';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [
    BarcodeModalPage,
  ],
  entryComponents: [
    BarcodeModalPage,
  ],
  imports: [
    TranslateModule.forChild(),
    NgxBarcodeModule,
    IonicPageModule.forChild(BarcodeModalPage),
  ],
})
export class BarcodeModalPageModule {}
