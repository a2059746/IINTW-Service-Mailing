import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StatusBar } from '../../../node_modules/@ionic-native/status-bar';

/**
 * Generated class for the VendorTestPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-vendor-test',
  templateUrl: 'vendor-test.html',
})
export class VendorTestPage {

  constructor(
    private statusBar: StatusBar,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VendorTestPage');
  }

  ionViewDidEnter() {
    this.statusBarStyle();
  }

  ionViewDidLeave() {
    this.statusBarDefault();
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
