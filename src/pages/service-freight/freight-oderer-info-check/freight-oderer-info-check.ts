import { AngularFireDatabase } from 'angularfire2/database';
import { UploadimgProvider } from './../../../providers/uploadimg/uploadimg';
import { FireAuthProvider } from './../../../providers/fire-auth/fire-auth';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController, ViewController, Content, Navbar } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';
import {
  FREIGHT_ORDERS_PATH,
  FREIGHT_ORDERSTATUS_PATH,
  getPathUsersFreightOrders,
} from '../freight.config';
/**
 * Generated class for the FreightOdererInfoCheckPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-freight-oderer-info-check',
  templateUrl: 'freight-oderer-info-check.html',
})
export class FreightOdererInfoCheckPage {

  loadingClass: any;

  authInfo: {
    Name: any,
    Address_Cty: any,
    Address: any,
    Phone: any,
  };


  // input value
  twAddress: any = '';
  foreignAddress: any = '';
  foreignPhone: any = '';
  receivingTime: any;
  payMethod: any;

  isValid = {
    twAddr: false,
    foAddr: false,
    foPhone: false
  }

  boxTWarea: any;
  vendorKey: any;
  chooseArea: any;

  isCtrl = {
    loadingReady: false,
    isClickEditAddress: false,
    exText1: false,
    exText2: false,
    isAllDone: false,
    choosePhoto: false,
    newOrder: true,
  }

  choosePhotoUrl: any;

  constructor(
    public afData: AngularFireDatabase,
    public upload: UploadimgProvider,
    public viewCtrl: ViewController,
    public modal: ModalController,
    public loadingCtrl: LoadingController,
    public AUTH: FireAuthProvider,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    //this.loadingPage();

    console.log('i am in user info check page')
    console.log(this.navParams.data);
    this.boxTWarea = this.navParams.get('boxTWarea')
    this.vendorKey = this.navParams.get('vendorKey')

    this.chooseArea = this.boxTWarea[0];

    this.AUTH.getState().take(1).subscribe((auth:any) => {
      this.authInfo = auth.info;
      console.log(this.authInfo);

      this.twAddress = this.authInfo.Address;
      this.receivingTime = 'morning';

      //this.loadingClass.dismiss();
    })

  }

  @ViewChild(Navbar) navbar: Navbar;

  @ViewChild('addressArea') private el: ElementRef;
  @ViewChild('exText1') private ex1: ElementRef;
  @ViewChild('exText1Bottom') private ex1B: ElementRef;
  @ViewChild(Content) content: Content;

  ionViewDidLoad() {
    console.log('ionViewDidLoad FreightOdererInfoCheckPage');

  }
  ex1Top: any;
  ex1Bottom: any;
  yOffset: any;
  // contentTop: any;
  // contentHeightBefore: any;
  contentHeightAfter: any;

  ionViewDidEnter() {
    // this.contentHeightBefore = this.content.contentHeight;
    setTimeout(() => {
      this.el.nativeElement.focus();
      setTimeout(() => {
        this.el.nativeElement.focus();
      }, 100);
    }, 150);

    this.navbar.backButtonClick = () => {
      if(this.isCtrl.isClickEditAddress) {
        alert('請上傳門牌照片')
        return;
      }
      this.navCtrl.pop();
    }

    if(!this.isCtrl.newOrder) {
      this.removeTransmitOrder().subscribe();
    }

  }

  addinputFocus() {
    this.isCtrl.exText1 = true;

    setTimeout(() => {
      this.ex1Top = this.ex1.nativeElement.offsetTop;
      this.ex1Bottom = this.ex1B.nativeElement.offsetTop;
      this.contentHeightAfter = this.content.scrollHeight;
      console.log('ex1top:' + this.ex1Top)
      console.log('ex1Btoom:' + this.ex1Bottom)
      this.yOffset = (2 * this.ex1Bottom) - this.contentHeightAfter;
      this.content.scrollTo(0, this.yOffset)
    },150)
  }

  /*** btn click ***/

  editAddress() {
    this.isCtrl.isClickEditAddress = true;
  }

  ensureAddress() {
    this.isCtrl.isClickEditAddress = false;
  }

  exClick1() {
    if(this.isCtrl.exText1) {
      this.isCtrl.exText1 = false;
    } else {
      this.isCtrl.exText1 = true;
    }
  }

  exClick2() {
    if(this.isCtrl.exText2) {
      this.isCtrl.exText2 = false;
    } else {
      this.isCtrl.exText2 = true;
    }
  }

  _Pay_State: any;
  _Box_State: any;

  submit() {

    if(this.isCtrl.isClickEditAddress) {
      alert('請上傳門牌照片')
      return;
    }

    if( (!this.twAddress && !this.isCtrl.choosePhoto) || (!this.receivingTime) || (!this.payMethod) ) {
      this.notFinishedToast();
      return;
    }

    const orderData = {
      myBoxes: this.navParams.get('orderInfo'),
      bName: this.authInfo.Name,
      bAddrArea: this.authInfo.Address_Cty,
      bAddrLast: this.twAddress,
      bAddrPic: this.choosePhotoUrl || '',
      bPhone: this.authInfo.Phone,
      // fAddress: this.foreignAddress,
      // fPhone: this.foreignPhone,
      rTime: this.receivingTime,
      payMethod: this.payMethod,
    }

    if(this.payMethod == "cash_on_delivery") {
      this._Pay_State = '92'
      this._Box_State = '91'
    } else if(this.payMethod == "code_payment") {
      this._Pay_State = '86'
      this._Box_State = '50'
    }

    this.sendTransmitOrder(orderData).subscribe((data) => {
      this.isCtrl.newOrder = false;
      this.orderCompleted(data);
    })

    // if(this.isCtrl.newOrder) {
    //   this.sendTransmitOrder(orderData).subscribe((data) => {
    //     this.isCtrl.newOrder = false;
    //     this.orderCompleted(data);
    //   })
    // } else {
    //   this.reviseTransmitOrder(orderData).subscribe((data) => {
    //     this.orderCompleted(data);
    //   })
    // }

  }


  orderKey: any;
  orderFreightUrl: any;

  sendTransmitOrder(order) {
    return Observable.create( observer => {

        this.AUTH.getState().take(1).subscribe(authState => {
          let Opath = getPathUsersFreightOrders(authState.uid);
          let orderData = {
            ...order,
            OrderPath: Opath,
            _State_ID: 10,
            _Pay_State: this._Pay_State,
            _Box_State: this._Box_State,
            _Mail_State: '00',
            _Color: null,
            _UserKey: authState.uid,
            _VendorKey: this.vendorKey,
            _Date: firebase.database.ServerValue.TIMESTAMP,
            TID: gTID(authState.phone),
          //  LoanPlan: order.LoanProgram.LoanPlan,
          //  LoanRate: order.LoanProgram.LoanRate,
          //  LoanProgram: null,
          };
          this.afData
            .list(`${FREIGHT_ORDERS_PATH}${this.vendorKey}`)
            .push(orderData)
            .then( res => {
              console.log(res);
              console.log(`${FREIGHT_ORDERS_PATH}${this.vendorKey}/${res.key}`)
              console.log(Opath + res.key)
              this.orderKey = res.key;
              this.orderFreightUrl = res.path.toString();
              this.afData.object(`${FREIGHT_ORDERS_PATH}${this.vendorKey}/${res.key}`).update({OrderPath: Opath + res.key})
              this.afData.object(Opath + res.key).set(Object.assign(orderData,{ OrderPath: res.path.toString(), }));
              observer.next(res.path.toString());
            });
            /*
            if(!this.navParams.data.isReciverPatched) {
              this.afData
              .list(__PATH__USERSDATA_LOAN_BANKHISTORIES + authState.phone)
              .push({
                CUBank: order.CUBank,
                CUBankID: order.CUBankID,
                CUBankID_Br: order.CUBankID_Br,
                CUBankAc: order.CUBankAc,
                CUBankAc_N: order.CUBankAc_N,
              })
              .then(res => {});
            } */

        });


    });
  }


  reviseTransmitOrder(order) {
    return Observable.create( observer => {
      this.AUTH.getState().take(1).subscribe(authState => {
        let Opath = getPathUsersFreightOrders(authState.uid);
        let orderData = {
          ...order,
          //OrderPath: Opath,
          _State_ID: 10,
          _Pay_State: this._Pay_State,
          _Box_State: this._Box_State,
          _Color: null,
          _UserKey: authState.uid,
          _VendorKey: this.vendorKey,
          _Date: firebase.database.ServerValue.TIMESTAMP,
          TID: gTID(authState.phone),
        //  LoanPlan: order.LoanProgram.LoanPlan,
        //  LoanRate: order.LoanProgram.LoanRate,
        //  LoanProgram: null,
        };

        this.afData.object(`${FREIGHT_ORDERS_PATH}${this.vendorKey}/${this.orderKey}`).update(orderData)
        this.afData.object(Opath + this.orderKey).update(orderData);
        observer.next(this.orderFreightUrl);

      });
    });
  }

  removeTransmitOrder() {
    return Observable.create( observer => {
      this.AUTH.getState().take(1).subscribe(authState => {
        let Opath = getPathUsersFreightOrders(authState.uid);

        this.afData.object(`${FREIGHT_ORDERS_PATH}${this.vendorKey}/${this.orderKey}`).remove();
        this.afData.object(Opath + this.orderKey).remove();
        observer.next();
      });
    });
  }

  uploadNumPlate() {
    this.upload.chooseImage(this.authInfo.Phone).subscribe(url => {
      this.isCtrl.isClickEditAddress = false;
      this.isCtrl.choosePhoto = true;
      this.choosePhotoUrl = url;
    })
  }

  isRadioValueChange() {
    console.log('time')
    console.log(this.receivingTime)
    console.log('payment method')
    console.log(this.payMethod)
  }

  //***  Modal ***/

  orderCompleted(orderUrl) {
    // const modal = this.modal.create('FmodelCompleteOrderingPage', {
    //   payMethod: this.payMethod
    // }, {
    //   cssClass: 'my-popup',
    // })
    // let targetView;

    // // this.navCtrl.remove() --> when lazy loading, this way is not useful
    // // this.navCtrl.popTo() --> when lazy loading, this way is not useful

    // modal.present().then(() => {
    //   targetView = this.navCtrl.getViews().filter(view=> view.id == 'FreightVendorPage')
    // });

    // modal.onDidDismiss(() => {
    //   targetView.length ? this.navCtrl.popTo(targetView[0]) : this.navCtrl.pop()
    // })

    this.navCtrl.push('FreightOrderCompletePage', {
      payMethod: this.payMethod,
      freightOrderUrl: orderUrl,
      totalGiftPrice: this.navParams.get('totalGiftPrice'),
      totalBoxPrice: this.navParams.get('totalBoxPrice'),
      _Pay_State: this._Pay_State,
    })

  }


  // *** Toast *** //

  notFinishedToast() {
    this.isCtrl.isAllDone = true;
    setTimeout(() => {
      this.isCtrl.isAllDone = false;
    }, 2500)
  }

  /*** londing ***/

  loadingPage() {
    this.loadingClass = this.loadingCtrl.create();

    this.loadingClass.onDidDismiss(() => {
      this.isCtrl.loadingReady = true;
    })

    this.loadingClass.present();
  }

  areaText() {
    let areaName = '';
    let lastIndex = this.boxTWarea.length - 1;

    this.boxTWarea.forEach((c, index) => {

      if(index == 0) {
        areaName = c;
      } else {
        areaName += '、';
        areaName += c;
      }
    })
    return areaName;
  }

  /*** Cancel Order Procdure ***/
  cancelProcdure() {

    if(this.isCtrl.isClickEditAddress) {
      alert('請上傳門牌照片')
      return;
    }

    let targetView;
    targetView = this.navCtrl.getViews().filter(view=> view.id == 'FreightVendorPage')
    targetView.length ? this.navCtrl.popTo(targetView[0]) : this.navCtrl.pop()
  }

  /*** input validator ***/
  public i_num_valid(event: any, validNum: any) {

    console.log('ngModel value:' + this.foreignPhone);
    console.log('event value:' + event.target.value);

    //console.log(event.target.value);
    const pattern = /^[0-9]*$/;
    //let inputChar = String.fromCharCode(event.charCode)
    if (!pattern.test(event.target.value)) {
      event.target.value = event.target.value.replace(/[^0-9]/g, "");
      // invalid character, prevent input

      //show invalid message
      if(validNum == '1') {
        this.isValid.twAddr = true;
      } else if(validNum == '2') {
        this.isValid.foAddr = true;
      } else if(validNum == '3') {
        this.isValid.foPhone = true;
      }

    } else {
      if(validNum == '1') {
        this.isValid.twAddr = false;
      } else if(validNum == '2') {
        this.isValid.foAddr = false;
      } else if(validNum == '3') {
        this.isValid.foPhone = false;
      }
    }
  }

  public i_text_valid(event: any, validNum: any) {
    //console.log(event.target.value);
    const pattern = /^[a-zA-Z0-9\u4e00-\u9fa5]*$/;
    //let inputChar = String.fromCharCode(event.charCode)
    if (!pattern.test(event.target.value)) {
      event.target.value = event.target.value.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, "");
      // invalid character, prevent input

      //show invalid message
      if(validNum == '1') {
        this.isValid.twAddr = true;
      } else if(validNum == '2') {
        this.isValid.foAddr = true;
      } else if(validNum == '3') {
        this.isValid.foPhone = true;
      }

    } else {
      if(validNum == '1') {
        this.isValid.twAddr = false;
      } else if(validNum == '2') {
        this.isValid.foAddr = false;
      } else if(validNum == '3') {
        this.isValid.foPhone = false;
      }
    }
  }

  /***** Back Btn Action ******/
  backButtonAction() {
    if(this.isCtrl.isClickEditAddress) {
      alert('請上傳門牌照片')
      return;
    }
    this.navCtrl.pop();
  }
}


function gTID(phone: string) {
  let t = new Date();
  // let r = Math.floor(Math.random() * 100) + 1
  return `F${t.getFullYear()}${pad(t.getMonth()+1)}${pad(t.getDate())}${pad(t.getHours())}${pad(t.getMinutes())}${pad(t.getSeconds())}${phone}`;
  // let t = new Date().toLocaleString('zn-TW', {year:'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false}).replace(/[\/\s\:]/g, '') + phone;
  // return s;
}
function pad(num, size = 2) {
  var s = num+"";
  while (s.length < size) s = "0" + s;
  return s;
}
