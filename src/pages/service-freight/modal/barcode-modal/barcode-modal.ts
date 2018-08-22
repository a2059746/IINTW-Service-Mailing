import { UploadimgProvider } from './../../../../providers/uploadimg/uploadimg';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,
  ViewController, LoadingController, AlertController,
  Platform,
} from 'ionic-angular';

import {AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { FREIGHT_VENDOR_PATH } from '../../freight.config';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
const _CODE_CHECK_RATE = 11;
// const _CODE1 = '501231649';
const _CODE1_TIME = '501231';
// const _CODE2 = '8108200018001020'; //虛擬帳號
const _CODE2_END = '00018001020'; //虛擬帳號
const _CODE3_PRICE_LENGTH = 9;
const _CODE3_ID= '1231';
@IonicPage()
@Component({
  selector: 'page-barcode-modal',
  templateUrl: 'barcode-modal.html',
})
export class BarcodeModalPage {
  error = false;
  needToPay: boolean = false;
  cannotScanTip: boolean = false;
  CODE: Array<string> = [
    '501231649',
    '8108200018001020',
    ''
  ];
  constructor(
    public upload: UploadimgProvider,
    private screenOrientation: ScreenOrientation,
    private platform: Platform,
    public alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    public afData: AngularFireDatabase,
    public viewCtrl: ViewController,
    public navCtrl: NavController, public navParams: NavParams) {

  }
  isValidDayOut: boolean = false;
  sp_phone: string = '';
  noAudited: boolean = false;
  init() {


    this.error = false;
    this.isValidDayOut = false;
    this.noAudited = false;
    this.validdate = null;
    if(this.platform.is('cordova')) {
      this.screenOrientation.unlock();
    }
  }

  orderInfo: any = {};
  validdate: Date = null;
  ionViewDidLeave() {
    if(this.platform.is('cordova')) {
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    }
  }

  state: any;

  ionViewDidEnter() {
    this.init();
    let loader = this.loadingCtrl.create();
    loader.present();

    let PAYMENT_ID_3CODE ='';
    let PAYMENT_BANK_5CODE ='';

    this.state = this.navParams.get('Tag_ID');

    if(this.navParams.get('Tag_ID') && this.navParams.get('orderInfo') && this.navParams.get('price') && this.navParams.get('SupplierKey')) {
      this.orderInfo = this.navParams.get('orderInfo');
      let id = this.navParams.get('Tag_ID');

      let validDate = new Date(this.orderInfo._Date);
      validDate.setDate(validDate.getDate() + 7);
      this.isValidDayOut = new Date().getTime() > new Date(validDate).getTime();

      if(!this.isValidDayOut) {

        // this.needToPay = (id>9 && id<100);
        this.needToPay = ((id) && (id<100)) && !this.isValidDayOut;
        this.noAudited = ((id) && (id<100));

        if(this.needToPay) {
          this.afData
          .object(FREIGHT_VENDOR_PATH + this.navParams.get('SupplierKey'))
          .valueChanges()
          .take(1)
          .subscribe((supplier:any) => {
            if('PAYMENT_ID_3CODE' in supplier && 'PAYMENT_BANK_5CODE' in supplier) {
              PAYMENT_ID_3CODE = supplier.PAYMENT_ID_3CODE;
              PAYMENT_BANK_5CODE = supplier.PAYMENT_BANK_5CODE;
              this.validdate = new Date(validDate);
              let yy = (this.validdate.getFullYear() -  1911 + '').slice(1,3);
              let mmdd = this.validdate.toISOString().slice(5,10).replace('-', '');
              let code3_price = this.priceToCode(this.navParams.get('price').toString());
              let final = this.checkcode(
                yy + mmdd + PAYMENT_ID_3CODE + '0' +  // 補0 偶數
                PAYMENT_BANK_5CODE + _CODE2_END +
                _CODE3_ID +
                code3_price
              );
              this.CODE[0] = yy + mmdd + PAYMENT_ID_3CODE;
              this.CODE[1] = PAYMENT_BANK_5CODE + _CODE2_END;
              this.CODE[2] = _CODE3_ID + final.odd + final.even + code3_price;
              console.log(this.CODE);

            }else {
              this.needToPay = false;
              this.error = true;
              this.CODE[0] ='';
              this.CODE[1] ='';
              this.CODE[2] ='';
              // alert('NO VENDOR PAYMENT CODE, Please contact ');
              // this.navCtrl.pop();
            }
            loader.dismiss();
          }, err => {
            loader.dismiss();
            alert('NETWORK ERROR!');
            this.navCtrl.pop();
          });
        } else {
          loader.dismiss();
        }

      } else {
        this.isValidDayOut = true;
        loader.dismiss();
      }
    }else {
      loader.dismiss();
      let alert = this.alertCtrl.create({
        title: 'ERROR',
        message: 'ERROR',
        buttons: ['OK']
      });
      alert.present();
      this.navCtrl.pop();
    }
  }
  ionViewDidLoad() {
    if(this.navParams.get('SupplierKey')) {
      this.afData
      .object(FREIGHT_VENDOR_PATH+ this.navParams.get('SupplierKey'))
      .valueChanges()
      .take(1)
      .subscribe((supplier:any) => {
        console.log('get supplier phone')
        console.log(supplier)
        this.sp_phone = supplier['Tel'] || '';
      }, err => {
        alert('NETWORK ERROR!');
        this.navCtrl.pop();
      });
    }
    console.log('ionViewDidLoad BarcodeModalPage');

  }
  toggleTip() {
    this.cannotScanTip = !this.cannotScanTip;
  }
  priceToCode(price:string) {
    let temp_price_code = '';
    for( let i=_CODE3_PRICE_LENGTH - price.length; i>0; i-- ) {
      temp_price_code = temp_price_code.concat('0');
    }
    return temp_price_code.concat(price);
  }
  checkcode(str:string) {
    console.log('checkcode : ' + str);
    let sum_odd = 0, sum_even = 0;
    str.split('').map((v,idx) => {
      let tmpcode = v.charCodeAt(0) - 48;
      if( (idx+1)%2 === 1) {  //odd
        sum_odd += EngToCode(v);
      }else {
        sum_even += EngToCode(v);
      }
    });
    let rate_odd = sum_odd % _CODE_CHECK_RATE;
    let final_odd =
      (rate_odd ===0)?'A':
        ((rate_odd ===10)?'B':rate_odd);
    let rate_even = sum_even % _CODE_CHECK_RATE;
    let final_even =
      (rate_even ===0)?'X':
        ((rate_even ===10)?'Y':rate_even);
    return {
      odd: final_odd,
      even: final_even,
    }
  }
  evenSum() {

  }

  dismiss() {
    this.viewCtrl.dismiss({onUpload: false});
  }
  uploadReceipt() {
    this.viewCtrl.dismiss({onUpload: true});
  }

  //rPhoto: any;
  uploadR() {
    this.upload.chooseImage(this.orderInfo.bPhone).subscribe(url => {
      //this.rPhoto = url;
      this.viewCtrl.dismiss({
        onUpload: true,
        invoiceUrl: url,
      });
    })
  }

  backButtonAction() {
    this.dismiss();
  }

}
function EngToCode(str: string) {
  let r = 0;
  if(str.charCodeAt(0) >= 48 && str.charCodeAt(0) <= 57) {
    r = str.charCodeAt(0) - 48;
  } else {
    let ss = str.toUpperCase().charCodeAt(0) - 64;
    if(ss >= 19) { ss += 1; }
    r = (Math.floor(ss/10) + ss % 10)%10;
  }
  return r;
}

