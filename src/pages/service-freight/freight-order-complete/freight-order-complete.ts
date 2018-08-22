import { AngularFireObject, AngularFireDatabase } from 'angularfire2/database';
import { ISubscription } from 'rxjs/Subscription';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';

/**
 * Generated class for the FreightOrderCompletePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-freight-order-complete',
  templateUrl: 'freight-order-complete.html',
})
export class FreightOrderCompletePage {

  data: any;
  payMethodId: any; // 1 for cash_on_delivery ; 2 for code_payment .
  payMethodTest: string;

  _state: {
    orderSubs: ISubscription,
    orderRef: AngularFireObject<any>,
    orderPath: string,
    orderDetail: any, // TODO
  } = {
    orderSubs: null,
    orderRef: null,
    orderPath: '',
    orderDetail: null,
  };


  invoicePic: string = '';

  constructor(
    public alertCtrl: AlertController,
    public modal: ModalController,
    public afData: AngularFireDatabase,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.data = this.navParams.data;
    console.log(this.data)
    if(this.data.payMethod == 'cash_on_delivery') {
      this.payMethodId = 1;
      this.payMethodTest = '貨到付款';
    } else if(this.data.payMethod == 'code_payment') {
      this.payMethodId = 2;
      this.payMethodTest = '超商付款';
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FmodelCompleteOrderingPage');
  }

  ionViewDidEnter() {
    if(this.data.freightOrderUrl) {
      this._state.orderPath = this.data.freightOrderUrl;
      this._state.orderRef = this.afData.object(this._state.orderPath);
      this._state.orderSubs
       = this._state.orderRef
        .valueChanges()
        .subscribe(detail => {
          this._state.orderDetail = detail;
        })
    }
  }

  goOrderDetail() {
    let targetView = this.navCtrl.getViews().filter(view=> view.id == 'FreightVendorPage');
    targetView.length ? this.navCtrl.popTo(targetView[0]) : this.navCtrl.pop();
  }

  goBarcode() {

    const data = {
      price: (this.data.totalBoxPrice + this.data.totalGiftPrice),
      Tag_ID: this.data._Pay_State,
      SupplierKey: this._state.orderDetail._VendorKey,
      orderInfo: this._state.orderDetail
    }

    console.log(data);

    let payModal = this.modal.create('BarcodeModalPage', data);

    payModal.onDidDismiss(data => {
      console.log(data)

      if (data['onUpload']) {
        this.invoicePic = data.invoiceUrl;

        this.afData.object(this._state.orderPath).update({
          _Pay_State: '88',
          invoicePic: this.invoicePic,
        });

        this.afData.object(this._state.orderDetail.OrderPath).update({
          _Pay_State: '88',
          invoicePic: this.invoicePic,
        })

        setTimeout(()=> {
          this.presentConfirm();
        }, 2000)

      } else {
      // this.askUploadImage();
      }
    });

    payModal.present().then(() => {

      if(this._state.orderDetail._Pay_State == '86') {

        this.afData.object(this._state.orderPath).update({
          _Pay_State: '87',
        });

        this.afData.object(this._state.orderDetail.OrderPath).update({
          _Pay_State: '87',
        })
      }

    });

  }

  goTutorial() {
    let tutorial = this.modal.create('FmodalBarcodeTutorialPage');
    tutorial.present();
    tutorial.onDidDismiss(data => {
      if(data == 1) {
        this.goVendorList();
      }
    });
  }

  goVendorList() {
    let targetView = this.navCtrl.getViews().filter(view=> view.id == 'FreightVendorlistPage');
    targetView.length ? this.navCtrl.popTo(targetView[0]) : this.navCtrl.pop();
  }

  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: '繳費收據上傳成功',
      message: '我們將會有專人與您聯繫約定送箱子及收取尾款事宜',
      buttons: [
        {
          text: '確定',
          handler: () => {
            this.goVendorList();
          }
        }
      ]
    });
    alert.present();
  }

}
