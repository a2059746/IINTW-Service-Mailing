import { Component, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ViewController } from 'ionic-angular';

/**
 * Generated class for the FmodalPurchaseDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-fmodal-purchase-detail',
  templateUrl: 'fmodal-purchase-detail.html',
})
export class FmodalPurchaseDetailPage {

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
  loadingClass: any;

  isCtrl = {
    loadingReady: false,
  }

  constructor(
    public viewCtrl: ViewController,
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
    console.log('user city')
    console.log(this.userCity)

  }

  @ViewChildren('boxes') boxesQueryList: QueryList<ElementRef>;
  @ViewChildren('boxBtn') boxBtnQuertList: QueryList<ElementRef>;
  boxElement: Array<ElementRef>;
  boxBtnElement: Array<ElementRef>;

  tempBoxElfIndex: any = 0;
  clickBox(i) {
    if(this.tempBoxElfIndex != i) {
      this.boxElement[this.tempBoxElfIndex].nativeElement.hidden = true;
      this.boxBtnElement[this.tempBoxElfIndex].nativeElement.classList.remove('btn-primary')
      this.boxBtnElement[this.tempBoxElfIndex].nativeElement.classList.add('btn-light')
    }
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


  /*** londing ***/

  loadingPage() {
    this.loadingClass = this.loadingCtrl.create();

    this.loadingClass.onDidDismiss(() => {
      this.isCtrl.loadingReady = true;
    })

    this.loadingClass.present();
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

  /***** BackBtnAction *****/
  backButtonAction() {
    this.closeModal();
  }

}
