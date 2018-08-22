import { FireAuthProvider } from './../../../providers/fire-auth/fire-auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

import { FREIGHT_BOXS_PATH } from '../freight.config';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/Observable/combineLatest';
import 'rxjs/add/operator/take';

import 'rxjs/add/Observable/combineLatest';
import 'rxjs/add/operator/take';
/**
 * Generated class for the FreightVendorboxsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-freight-vendorboxs',
  templateUrl: 'freight-vendorboxs.html',
})
export class FreightVendorboxsPage {

  loadingClass: any;

  vendor: {
    key: any,
    selectArea: {
      country: string,
      area: string,
    }
  };

  user_address_city: any;
  area_value: any = '';

  vendorBox: Array<{
    ServiceCountry: string,
    ServiceArea: string,
  }>

  boxList: Array<{
    FBKey: string,
    FBSize: string,
    FBPics: string,
    TWAreaAllow: Array<any>,
    BindCountry: Array<any>,
    FBDeposit: number,
    FBBlance: number,
    OrderLimit: number,
    FBGifts: Array<any>,
    boxChoosenAmount: number
  }> | any = [];

  area_filter: Array<any> = [];

  isCtrl = {
    loadingReady: false
  }

  constructor(
    public AUTH: FireAuthProvider,
    public loadingCtrl: LoadingController,
    public db: AngularFireDatabase,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.loadingPage();

    this.vendor = this.navParams.data;
    if(!this.vendor) {
      alert('錯誤!此廠商不存在')
      this.navCtrl.setRoot('FreightVendorlistPage')
    }
    console.log('vendor:')
    console.log(this.vendor)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FreightVendorboxsPage');
  }

  ionViewDidEnter() {

    Observable.combineLatest(
      this.AUTH.getState(),
      this.db.list(FREIGHT_BOXS_PATH + this.vendor.key).valueChanges()
    ).take(1).subscribe((list:any )=> {

      if(!this.isCtrl.loadingReady) {

        this.user_address_city = list[0].info.Address_Cty || 'none';
        console.log('user city')
        console.log(this.user_address_city)

        this.vendorBox = list[1];
        console.log('get vebder\'s boxes data')
        console.log(this.vendorBox)


        // filter out Boxes which meet the country and area that the user has selected.
        this.boxList = this.vendorBox.filter(a =>
           (a.ServiceCountry == this.vendor.selectArea.country && a.ServiceArea == this.vendor.selectArea.area)
        )
        console.log('filter out the boxes of specific country the user selected')
        console.log(this.boxList)

        //
        this.boxList.map(i => i.boxChoosenAmount = 0);

        // filter bar value
        this.boxList.forEach(a => {
          a.TWAreaAllow.forEach(b => {
            if(!this.area_filter.find(c => c==b)) {
              this.area_filter.push(b);
            }
          })
        })
        console.log('area filter:')
        console.log(this.area_filter)
        console.log(this.area_value)

        if(this.area_filter.find(a => a == this.user_address_city)) {
          this.area_value = this.user_address_city;
        }

      }
      console.log('check point')
      console.log(this.boxList)

      this.loadingClass.dismiss();

      if(!this.area_value) {
        alert('此廠商未提供' + this.user_address_city + '的箱子運送服務')
        this.navCtrl.setRoot('FreightVendorlistPage')
      }

    })



    // this.db.list(FREIGHT_BOXS_PATH + this.vendor.key).valueChanges().subscribe((list:any) => {

    //   if(!this.isCtrl.loadingReady) {
    //     this.boxList = list;
    //     console.log('get vebder\'s boxes data')
    //     console.log(this.boxList)
    //     this.boxList.map(i => i.boxChoosenAmount = 0);
    //   }
    //   console.log('check point')
    //   console.log(this.boxList)
    //   this.loadingClass.dismiss();
    // })
  }

  twAreaAllow(i) {
    let areaName = '';
    let lastIndex = this.boxList[i].TWAreaAllow.length - 1;
    // console.log('lastIndex:' + lastIndex)
    this.boxList[i].TWAreaAllow.forEach((c, index) => {
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
    let lastIndex = this.boxList[i].BindCountry.length - 1;
    // console.log('lastIndex:' + lastIndex)
    this.boxList[i].BindCountry.forEach((c, index) => {
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

  optionNum(i) {
    let num = this.boxList[i].OrderLimit;
    return Array(num).fill(0).map((x, i) => i+1);
  }

  /*** btn click ***/

  incBox(i) {
    if(this.boxList[i].boxChoosenAmount < this.boxList[i].OrderLimit) {
      this.boxList[i].boxChoosenAmount ++;
    }
  }

  decBox(i) {
    if(this.boxList[i].boxChoosenAmount > 0) {
      this.boxList[i].boxChoosenAmount --;
    }
  }

  restAmount() {
    console.log('rest!')
    this.boxList.map(i => i.boxChoosenAmount = 0);
  }

  nextPage() {

    if(!this.boxList.find(a => a.boxChoosenAmount != 0)) {
      this.notFinishedToast();
      return;
    }

    const choosenBox = this.boxList.filter(i => i.boxChoosenAmount > 0 )

    let boxTWarea = [];
    choosenBox.forEach(a => {
      if(boxTWarea.length < 1) {
        boxTWarea = Object.assign([],a.TWAreaAllow);
      } else {
        boxTWarea.forEach((b, bi) => {
          if(!a.TWAreaAllow.find(c => c == b)) {
            boxTWarea.splice(bi, 1);
          }
        })
      }
    })

    let totalBoxPrice = 0;
    choosenBox.forEach(b => {
      totalBoxPrice += ((b.FBDeposit + b.FBBlance) * b.boxChoosenAmount);
    });
    console.log('totalBoxPrice : ' + totalBoxPrice);

    this.navCtrl.push('FreightVendorgiftsPage', {
      vid: this.vendor.key,
      choosenBox: choosenBox,
      totalBoxPrice: totalBoxPrice,
      boxTWarea: boxTWarea,
      userCity: this.user_address_city,
    });
  }

  // *** Toast *** //
  isEnsureChoosenBox = false;
  notFinishedToast() {
    this.isEnsureChoosenBox = true;
    setTimeout(() => {
      this.isEnsureChoosenBox = false;
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


  isHide(i) {
    // console.log('did i in?')
    let temp = this.boxList[i].TWAreaAllow.find(a => a == this.area_value);
    // console.log('area:' + this.area_value)
    // console.log('temp' + temp)
    if(!temp) {
      // console.log('hide')
      return true;
    } else {
      // console.log('show')
      return false;
    }
  }

  /*** Cancel Order Procdure ***/
  cancelProcdure() {
    let targetView;
    targetView = this.navCtrl.getViews().filter(view=> view.id == 'FreightVendorPage')
    targetView.length ? this.navCtrl.popTo(targetView[0]) : this.navCtrl.pop()
  }

}
