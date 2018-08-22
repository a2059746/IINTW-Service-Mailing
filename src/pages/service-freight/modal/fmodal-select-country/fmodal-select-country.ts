import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the FmodalSelectCountryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-fmodal-select-country',
  templateUrl: 'fmodal-select-country.html',
})
export class FmodalSelectCountryPage {

  countryList: Array<any>;

  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.countryList = this.navParams.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FmodalSelectCountryPage');
  }

  chooseCountry(country) {
    this.closeModal(country);
  }

  closeModal(data :any = undefined) {
    this.viewCtrl.dismiss(data)
  }

  /***** BackBtnAction *****/
  backButtonAction() {
    this.closeModal();
  }

}
