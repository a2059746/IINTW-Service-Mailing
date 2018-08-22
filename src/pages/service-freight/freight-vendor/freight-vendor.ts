import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';

/**
 * Generated class for the FreightVendorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-freight-vendor',
  templateUrl: 'freight-vendor.html',
})
export class FreightVendorPage {
  vendor: {
    Name: string,
    key: string,
    SERVICE_AREA: Array<any>,
  }
  constructor(
    private statusBar: StatusBar,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController
  ) {
    this.vendor = this.navParams.get('vendor')
    if(!this.vendor) {
      let alert = this.alertCtrl.create({
        title: '錯誤',
        subTitle: '此廠商不存在',
        buttons: [{
          text: '返回',
          handler: () => {
            this.navCtrl.pop();
          }
        }]
      });
      alert.present()
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FreightVendorPage');
  }

  ionViewDidEnter() {
    this.statusBarStyle();
  }

  ionViewDidLeave() {
    this.statusBarDefault();
  }

  goSelectAreaPage() {
    const data = {
      key: this.vendor.key,
      service_area: this.vendor.SERVICE_AREA
    }
    this.navCtrl.push('FreightSelectAreaPage', data)
  }

  backBtn() {
    this.navCtrl.pop();
  }

  statusBarStyle() {
    this.statusBar.overlaysWebView(true);
    // background color transparent
    this.statusBar.backgroundColorByHexString('#33000000');
  }

  statusBarDefault() {
    this.statusBar.overlaysWebView(false);
    this.statusBar.styleLightContent()
    this.statusBar.backgroundColorByHexString('#0158b5');
  }

}
