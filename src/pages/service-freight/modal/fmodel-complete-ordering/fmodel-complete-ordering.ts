import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the FmodelCompleteOrderingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-fmodel-complete-ordering',
  templateUrl: 'fmodel-complete-ordering.html',
})
export class FmodelCompleteOrderingPage {

  data: any;
  payMethodId: any; // 1 for cash_on_delivery ; 2 for code_payment .
  payMethodTest: string;

  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.data = this.navParams.get('payMethod');
    console.log(this.data)
    if(this.data == 'cash_on_delivery') {
      this.payMethodId = 1;
      this.payMethodTest = '貨到付款';
    } else if(this.data == 'code_payment') {
      this.payMethodId = 2;
      this.payMethodTest = '超商付款';
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FmodelCompleteOrderingPage');
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

}
