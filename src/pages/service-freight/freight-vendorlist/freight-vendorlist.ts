import { FireAuthProvider } from '../../../providers/fire-auth/fire-auth';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { FREIGHT_VENDOR_PATH } from '../freight.config';

/**
 * Generated class for the FreightVendorlistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-freight-vendorlist',
  templateUrl: 'freight-vendorlist.html',
})
export class FreightVendorlistPage {

  vendors: object[] = [];

  constructor(
    public AUTH: FireAuthProvider,
    public db: AngularFireDatabase,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.db.list(FREIGHT_VENDOR_PATH).snapshotChanges().map(snaps => snaps.map(snap => ({
     ...snap.payload.val(),
     key: snap.payload.key
    }))).subscribe(list => {
      this.vendors = list;
      console.log(list)
    });

    this.AUTH.getState().take(1).subscribe(auth => {
      console.log(auth);
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FreightVendorlistPage');
  }

  goVendorInfoPage(vendor) {
    this.navCtrl.push('FreightVendorPage', {vendor: vendor})
  }
}
