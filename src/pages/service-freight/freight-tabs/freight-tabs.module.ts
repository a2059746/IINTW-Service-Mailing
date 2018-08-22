import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FreightTabsPage } from './freight-tabs';

@NgModule({
  declarations: [
    FreightTabsPage,
  ],
  imports: [
    IonicPageModule.forChild(FreightTabsPage),
  ],
})
export class FreightTabsPageModule {}
