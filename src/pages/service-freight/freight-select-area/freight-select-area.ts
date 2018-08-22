import { FireAuthProvider } from './../../../providers/fire-auth/fire-auth';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

/**
 * Generated class for the FreightSelectAreaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-freight-select-area',
  templateUrl: 'freight-select-area.html',
})
export class FreightSelectAreaPage {

  loadingClass: any;

  data: {
    key: any,
    service_area: Array<{
      c_name: string,
      c_area: Array<{
        chinese_name: string,
        foreign_name: string,
        img: string
      }>
    }>
  }

  country_value: string = 'Choose...';
  area_value: string = '';

  areaList: Array<any>;

  isCtrl = {
    loadingReady: false,
    showToast: false,
    selectCountry: false,
  }


  constructor(
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public AUTH: FireAuthProvider,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.loadingPage();
    this.data = this.navParams.data;
    if(!this.data) {
      alert('錯誤!')
      this.navCtrl.setRoot('FreightVendorlistPage')
    }
    console.log('this is select area page')
    console.log(this.data);

    this.AUTH.getState().take(1).subscribe(userData => {

      if(this.data.service_area.find(a => a.c_name == userData.info.Country)) {
        this.country_value = userData.info.Country;
      }

      console.log('my filter country default')
      console.log(this.country_value)

      this.loadingClass.dismiss();
    })

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FreightSelectAreaPage');
  }

  ionViewDidEnter() {

  }

  /***** Btn Click ******/

  cancelProcdure() {
    this.navCtrl.pop();
  }

  getArea(ci, ai, area_name) {
    this.area_value = area_name;
    let n_ci = ci.toString();
    let n_ai = ai.toString();
    if(this.temp_i && ((n_ci+n_ai) != this.temp_i)) {
      this.remClickStyle();
    }
    this.addClickStyle(n_ci + n_ai);
  }

  temp_i = '';
  addClickStyle(i) {
    this.temp_i = i;
    let element = document.querySelector('#btn' + i);
    element.classList.add('focus');
  }

  remClickStyle() {
    let element = document.querySelector('#btn' + this.temp_i);
    element.classList.remove('focus');
  }

  toNextPage() {
    if(this.country_value && this.area_value) {
      this.navCtrl.push('FreightVendorboxsPage', {
        key: this.data.key,
        selectArea: {
          country: this.country_value,
          area: this.area_value,
        }
      })
    } else {
      this.showToast();
    }
  }


  /***** Filter Ctrl *****/
  resetarea() {
    this.area_value = '';
    if(this.country_value != 'Choose...') {
      if(this.temp_i) {
        this.remClickStyle();
      }
      this.temp_i = '';
    }
  }


  /***** Modal *****/
  selectCountry() {
    let countryModal = this.modalCtrl.create('FmodalSelectCountryPage', this.data.service_area, {
      cssClass: 'popup'
    });

    this.isCtrl.selectCountry = true;

    countryModal.present();

    countryModal.onDidDismiss(data => {
      console.log(data)
      this.country_value = data || this.country_value;

      if(data) {
        this.resetarea();
      }

      this.isCtrl.selectCountry = false;
    })
  }


  /***** Toast ******/
  showToast() {
    this.isCtrl.showToast = true;
    setTimeout(() => {
      this.isCtrl.showToast = false;
    }, 2500)
  }


  /*** Loading ***/
  loadingPage() {
    this.loadingClass = this.loadingCtrl.create();

    this.loadingClass.onDidDismiss(() => {
      this.isCtrl.loadingReady = true;
    })

    this.loadingClass.present();
  }

}
