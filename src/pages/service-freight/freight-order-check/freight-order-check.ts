import { Component, ViewChild, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

/**
 * Generated class for the FreightOrderCheckPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-freight-order-check',
  templateUrl: 'freight-order-check.html',
})
export class FreightOrderCheckPage {

  data: any;

  orderInfo: Array<{
    FBKey: string,
    FBPics: string,
    FBSize: string,
    TWAreaAllow: Array<any>,
    BindCountry: Array<any>,
    FBDeposit: number,
    FBBlance: number,
    boxChoosenAmount: number,
    giftsInfo: Array<{
      giftAmount: number,
      giftKey: string
    }>
  }>;

  userCity: any;

  giftsInfo: any;
  totalGiftsPrice = 0;
  loadingClass: any;

  isCtrl = {
    loadingReady: false,
  }

  constructor(
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    //this.loadingPage()

    this.data = this.navParams.data
    if( !this.data ) {
      alert('錯誤!')
      this.navCtrl.setRoot('FreightVendorlistPage')
    }
    console.log(this.data)
    this.orderInfo = this.data.orderInfo;
    this.giftsInfo = this.data.giftsInfo;
    this.userCity = this.data.userCity;

    console.log('order Info')
    console.log(this.orderInfo)
    console.log('gifts Info')
    console.log(this.giftsInfo)

    this.orderInfo.forEach(a => {
      if(a.giftsInfo.length > 0){
        a.giftsInfo.forEach(b => {
          if(b.giftAmount > 0) {
            this.totalGiftsPrice += (b.giftAmount * this.giftsInfo.find(c => c.key == b.giftKey).FGPrice)
          }
        })
      }
    })


  }

  @ViewChildren('boxes') boxesQueryList: QueryList<ElementRef>;
  @ViewChildren('boxBtn') boxBtnQuertList: QueryList<ElementRef>;
  boxElement: Array<ElementRef>;
  boxBtnElement: Array<ElementRef>;

  tempBoxElfIndex: any = 0;
  clickBox(i) {
    console.log('i:' + i);
    if(this.tempBoxElfIndex != i) {
      console.log('1')
      this.boxElement[this.tempBoxElfIndex].nativeElement.hidden = true;
      this.boxBtnElement[this.tempBoxElfIndex].nativeElement.classList.remove('btn-primary')
      this.boxBtnElement[this.tempBoxElfIndex].nativeElement.classList.add('btn-light')
    }
    console.log('2')
    this.boxElement[i].nativeElement.hidden = false;
    this.boxBtnElement[i].nativeElement.classList.remove('btn-light')
    this.boxBtnElement[i].nativeElement.classList.add('btn-primary')
    this.tempBoxElfIndex = i;
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad FreightOrderCheckPage');
  }

  ionViewDidEnter() {
    this.boxElement = this.boxesQueryList.map(x => x);
    this.boxBtnElement = this.boxBtnQuertList.map(x => x);
    console.log(this.boxElement)
  }

  /*** render function ***/

  twAreaAllow(i) {
    let areaName = '';
    let lastIndex = this.orderInfo[i].TWAreaAllow.length - 1;
    // console.log('lastIndex:' + lastIndex)
    this.orderInfo[i].TWAreaAllow.forEach((c, index) => {
      // console.log('bcName:'+bcName)
      // console.log('country:'+c)
      if(index == 0) {
        areaName = c;
      } else {
        areaName += '、';
        areaName += c;
      }
    })
    return areaName;
  }

  bindCountry(i) {
    let bcName = '';
    let lastIndex = this.orderInfo[i].BindCountry.length - 1;
    // console.log('lastIndex:' + lastIndex)
    this.orderInfo[i].BindCountry.forEach((c, index) => {
      // console.log('bcName:'+bcName)
      // console.log('country:'+c)
      if(index == 0) {
        bcName = c;
      } else {
        bcName += '、';
        bcName += c;
      }
    })
    return bcName;
  }



  gifts(i): Array<{}> {
    let temp = [];
    this.orderInfo[i].giftsInfo.forEach(a => {
      if(a.giftAmount > 0) {
        temp.push({
          info: this.giftsInfo.find(b => b.key == a.giftKey),
          amount: a.giftAmount
        })
      }
    })
    return temp;
  }

  /*** btn click ***/

  reviseOrder() {
    this.navCtrl.pop();
  }

  submit() {

    const data = {
      orderInfo: this.orderInfo,
      totalGiftPrice: this.data.totalGiftPrice,
      totalBoxPrice: this.data.totalBoxPrice,
      boxTWarea: this.data.boxTWarea,
      vendorKey: this.data.vendorKey,
      totalGiftsPrice: this.totalGiftsPrice,
    };

    this.navCtrl.push('FreightOdererInfoCheckPage', data);
  }

  /*** londing ***/

  loadingPage() {
    this.loadingClass = this.loadingCtrl.create();

    this.loadingClass.onDidDismiss(() => {
      this.isCtrl.loadingReady = true;
    })

    this.loadingClass.present();
  }


  /*** Cancel Order Procdure ***/
  cancelProcdure() {
    let targetView;
    targetView = this.navCtrl.getViews().filter(view=> view.id == 'FreightVendorPage')
    targetView.length ? this.navCtrl.popTo(targetView[0]) : this.navCtrl.pop()
  }

}
