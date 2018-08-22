import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the FmodalBarcodeTutorialPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-fmodal-barcode-tutorial',
  templateUrl: 'fmodal-barcode-tutorial.html',
})
export class FmodalBarcodeTutorialPage {

  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FmodalBarcodeTutorialPage');
  }

  closeModal(data: any = 0) {
    this.viewCtrl.dismiss(data)
  }

  /***** BackBtnAction *****/
  backButtonAction() {
    this.closeModal();
  }

}
