import { FREIGHT_ORDERS_PATH } from './../freight.config';
import { UploadimgProvider } from './../../../providers/uploadimg/uploadimg';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ModalController } from 'ionic-angular';

import {AngularFireDatabase, AngularFireObject} from 'angularfire2/database';
import * as firebase from 'firebase';

import { ISubscription } from 'rxjs/Subscription';

import { FREIGHT_GIFTS_PATH, getPathUsersFreightOrders } from '../freight.config';
import { ModuleLoader } from '../../../../node_modules/ionic-angular/umd/util/module-loader';

/**
 * Generated class for the FreightRecordDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-freight-record-detail',
  templateUrl: 'freight-record-detail.html',
})
export class FreightRecordDetailPage {

  loadingClass: any;

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

  isCtrl = {
    loadingReady: false,
  }

  vendorGifts: Array<{
    key: any
    FGKey: any,
    FGName: any,
    FGPics: any,
    FGPrice: any,
  }> = []

  isCodePayment = false;

  stateList: any;

  statePay: any;

  stateFreight: any;

  total = {
    deposit: 0,
    balance: 0,
    giftsPrice: 0,
    payAmount: 0,
  }

  constructor(
    public upload: UploadimgProvider,
    public modal: ModalController,
    public db: AngularFireDatabase,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public afData: AngularFireDatabase,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FreightRecordDetailPage');
  }

  ionViewDidEnter() {
    this.loadingPage();

    if(this.navParams.get('path')) {
      this._state.orderPath = this.navParams.get('path');
      console.log(this._state.orderPath);
      this._state.orderRef = this.afData.object(this._state.orderPath);
      this._state.orderSubs
       = this._state.orderRef
        .valueChanges()
        .subscribe(detail => {


          this.db.list(FREIGHT_GIFTS_PATH + detail._VendorKey ).snapshotChanges()
          .map(snaps => snaps.map(snap => ({
            ...snap.payload.val(),
            key: snap.payload.key
          }))).take(1).subscribe(data => {

            console.log('valueChanges():');
            this._state.orderDetail = detail;

            console.log(this._state.orderDetail);

            console.log('address picture')
            console.log(this._state.orderDetail.bAddrPic);

            this.vendorGifts = data;
            console.log(this.vendorGifts)


            if(this._state.orderDetail.payMethod == 'code_payment') {
              this.isCodePayment = true;
            }

            this._state.orderDetail.myBoxes.forEach(e => {
              this.total.deposit += (e.FBDeposit * e.boxChoosenAmount)
            });

            this._state.orderDetail.myBoxes.forEach(e => {
              this.total.balance += (e.FBBlance * e.boxChoosenAmount)
            });

            this._state.orderDetail.myBoxes.forEach(a => {
              a.giftsInfo.forEach(b => {
                this.total.giftsPrice += b.giftAmount * this.vendorGifts.find(c => c.key == b.giftKey).FGPrice ;
              });
            });

            this.total.payAmount = this.total.deposit + this.total.balance + this.total.giftsPrice;


            this.stateList = this.navParams.get('stateList');

            this.statePay = this.stateList.find(a => a._State_ID == this._state.orderDetail._Pay_State)

            this.stateFreight = this.stateList.find(a => a._State_ID == this._state.orderDetail._Box_State)

            this.loadingClass.dismiss();

          })

        });
    }else {
      let alert = this.alertCtrl.create({
        title: 'ERROR',
        message: 'ERROR',
        buttons: ['OK']
      });
      alert.present();
    }
  }
  ionViewWillLeave() {
    if(this._state.orderSubs) { this._state.orderSubs.unsubscribe(); }
  }



    /*** londing ***/

    loadingPage() {
      this.loadingClass = this.loadingCtrl.create();

      this.loadingClass.onDidDismiss(() => {
        this.isCtrl.loadingReady = true;
      })

      this.loadingClass.present();
    }




  //***  Modal ***/

  purchaseDetail() {
    const modal = this.modal.create('FmodalPurchaseDetailPage', {
      orderInfo: this._state.orderDetail.myBoxes,
      giftsInfo: this.vendorGifts,
      userCity: this._state.orderDetail.bAddrArea
    })

    // this.navCtrl.remove() --> when lazy loading, this way is not useful
    // this.navCtrl.popTo() --> when lazy loading, this way is not useful

    modal.present();
  }




  payMethod(i) {
    if(i == 'code_payment') {
      return '超商繳費'
    } else if (i == 'cash_on_delivery') {
      return '貨到付款'
    }
  }

  estDate(t) {
    let time = new Date(t);
    return time.toLocaleString()
  }


  goBarcode(fTag_ID) {

    const data = {
      price: this.total.payAmount,
      Tag_ID: fTag_ID,
      SupplierKey: this._state.orderDetail._VendorKey,
      orderInfo: this._state.orderDetail
    }

    console.log(data);

    let payModal = this.modal.create('BarcodeModalPage', data);

    payModal.onDidDismiss(data => {
      console.log(data)

      if (data['onUpload']) {
        this.afData.object(this._state.orderPath).update({
          _Pay_State: '88',
          invoicePic: data.invoiceUrl,
        });

        this.afData.object(this._state.orderDetail.OrderPath).update({
          _Pay_State: '88',
          invoicePic: data.invoiceUrl,
        })

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

  rPhoto: any;
  uploadR() {
    this.upload.chooseImage(this._state.orderDetail.bPhone).subscribe(url => {
      this.afData.object(this._state.orderPath).update({
        invoicePic: url,
      });

      this.afData.object(this._state.orderDetail.OrderPath).update({
        invoicePic: url,
      })
    })
  }


}
