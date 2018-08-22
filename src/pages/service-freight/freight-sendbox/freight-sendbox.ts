import { ISubscription } from 'rxjs/Subscription';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
import { FireAuthProvider } from './../../../providers/fire-auth/fire-auth';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';

import {
  FREIGHT_MAILSTATUS_PATH,
  getPathUsersFreightOrders,
} from '../freight.config';

/**
 * Generated class for the FreightSendboxPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-freight-sendbox',
  templateUrl: 'freight-sendbox.html',
})
export class FreightSendboxPage {

  ordersRef: AngularFireList<Array<any>>;
  ordersSubs: ISubscription;
  ordersList: Array<any> = [];

  mailStatus: Array<any> = [];

  isCtrl = {
    loadingReady: false,
  }

  hasCtrl = {
    mailList: false,
  }

  constructor(
    public afData: AngularFireDatabase,
    private AUTH: FireAuthProvider,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FreightSendboxPage');
  }

  ionViewDidEnter() {
    this.loadingPage();

    console.log('isloadingReady:' + this.isCtrl.loadingReady)
    console.log('ionViewDidLoad TransmitHistoryPage');
    this.AUTH.getState().take(1).subscribe(authState => {
      if(authState.info) {
        this.ordersRef = this.afData.list(getPathUsersFreightOrders(authState.uid));
        this.ordersSubs = this.ordersRef
          .valueChanges()
          .subscribe( (list:any) => {

            console.log('my history')
            console.log(list)

            if(list.length >= 1) {

              this.afData.list(FREIGHT_MAILSTATUS_PATH).valueChanges().take(1).subscribe(status => {

                this.mailStatus  = status;
                console.log(this.mailStatus)

                this.ordersList = list.filter(b => b._Mail_State != '00');
                if(this.ordersList.length >= 1) {
                  this.ordersList.reverse();
                  console.log(this.ordersList)
                  this.hasCtrl.mailList = true;
                }
              })
            }
          });
      }
      this.loadingClass.dismiss();
    });
  }

  alert_isSendBox(e, orderPath) {
    let alert = this.alertCtrl.create({
      title: '確定要寄送箱子嗎？',
      buttons: [
        {
          text: '我還沒準備好',
          handler: () => {
            console.log('Cancel clicked');
          },
          cssClass: 'alert-button-danger',
        },
        {
          text: '確定寄送箱子',
          handler: () => {
            this.alert_hasSendBox();
            this.afData.object(orderPath).update({_Mail_State: '02'})
            this.afData.object(orderPath).valueChanges().take(1).subscribe((data:any) => {
              console.log(data)
              this.afData.object(data.OrderPath).update({_Mail_State: '02'})
            })
          }
        }
      ],
      cssClass: 'alert-style',
    });
    alert.present();
  }

  alert_hasSendBox() {
    let alert = this.alertCtrl.create({
      title: '已送出寄箱申請',
      message: '我們將會有專員與您聯絡!',
      buttons: [
        {
          text: '確定',
        }
      ],
      cssClass: 'alert-style',
    });
    alert.present();
  }

  stateMail(stateID):{} {
    let state = this.mailStatus.find(s => s._State_ID == stateID)
    return {
      message: state._StateN,
      color: state._Color,
    }
  }

  /*** londing ***/
  loadingClass: any;
  loadingPage() {
    this.loadingClass = this.loadingCtrl.create();

    this.loadingClass.onDidDismiss(() => {
      this.isCtrl.loadingReady = true;
    })

    this.loadingClass.present();
  }

}
