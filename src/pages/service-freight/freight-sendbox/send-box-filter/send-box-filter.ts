import { ModalController } from 'ionic-angular';
import { Component } from '@angular/core';

/**
 * Generated class for the SendBoxFilterComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'send-box-filter',
  templateUrl: 'send-box-filter.html'
})
export class SendBoxFilterComponent {

  text: string;

  constructor(
    public modalCtrl: ModalController,
  ) {
    console.log('Hello SendBoxFilterComponent Component');
    this.text = 'Hello World';
  }

  selectMailStatus() {
    let mailStatusModal = this.modalCtrl.create('SendBoxFilterModalPage', null, {
      cssClass: 'filter-popup'
    });

    mailStatusModal.present();

    mailStatusModal.onDidDismiss(value => {

    });
  }

}
