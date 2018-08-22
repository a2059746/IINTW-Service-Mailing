// import { FreightRecordsPage } from './../freight-records/freight-records';
// import { FreightVendorlistPage } from './../freight-vendorlist/freight-vendorlist';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-freight-tabs',
  templateUrl: 'freight-tabs.html',
})
export class FreightTabsPage {

  freightVendorlistPage = 'FreightVendorlistPage';
  freightRecordsPage = 'FreightRecordsPage';
  FreightSendboxPage = 'FreightSendboxPage';

}
