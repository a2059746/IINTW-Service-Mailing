import { FireAuthProvider } from './../../../providers/fire-auth/fire-auth';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';


import {AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import { ISubscription } from 'rxjs/Subscription';
import {
  FREIGHT_ORDERS_PATH,
  FREIGHT_ORDERSTATUS_PATH,
  FREIGHT_MAILSTATUS_PATH,
  getPathUsersFreightOrders,
} from '../freight.config';
/**
 * Generated class for the FreightRecordsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-freight-records',
  templateUrl: 'freight-records.html',
})
export class FreightRecordsPage {

  orderStatus: Array<any> = [];

  loadingClass: any;

  ordersList: Array<any> = [];
  ordersRef: AngularFireList<Array<any>>;
  ordersSubs: ISubscription;


  isCtrl = {
    loadingReady: false,
    hasOrder: false
  }

  constructor(
    public db: AngularFireDatabase,
    public loadingCtrl: LoadingController,
    public afData: AngularFireDatabase,
    private AUTH: FireAuthProvider,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FreightRecordsPage');
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
          .subscribe( (list) => {

            console.log('my history')
            console.log(list)

            if(list.length >= 1) {

              this.db.list(FREIGHT_ORDERSTATUS_PATH).valueChanges().take(1).subscribe(status => {

                this.orderStatus  = status;
                console.log(this.orderStatus)

                console.log(list)
                this.ordersList = list.reverse();
                this.isCtrl.hasOrder = true;
                this.loadingClass.dismiss();
              })
            } else {
              this.loadingClass.dismiss();
            }

          });
      }

    });
  }

  ionViewDidLeave() {
    this.isCtrl.loadingReady = false;
    if(this.ordersSubs) { this.ordersSubs.unsubscribe(); }
  }

  goDetail(path: string, goPaid: boolean = false) {
    this.navCtrl.push('FreightRecordDetailPage',{path: path, goPaid: goPaid, stateList: this.orderStatus});
  }

  /*** londing ***/

  loadingPage() {
    this.loadingClass = this.loadingCtrl.create();

    this.loadingClass.onDidDismiss(() => {
      this.isCtrl.loadingReady = true;
    })

    this.loadingClass.present();
  }



  payMethod(i) {
    if(i == 'code_payment') {
      return '超商繳費'
    } else if (i == 'cash_on_delivery') {
      return '貨到付款'
    }
  }

  estDate(t) {
    let time = new Date(t);
    return time.toLocaleString()
  }

  statePay(i):{} {
    const statusInfo = this.orderStatus.find(a => a._State_ID == i._Pay_State)

    const data = {
      color: statusInfo._Color || '',
      message: statusInfo._StateN || ''
    }
    return data;
  }

  stateFreight(i):{} {
    const statusInfo = this.orderStatus.find(a => a._State_ID == i._Box_State)
    const data = {
      color: statusInfo._Color || '',
      message: statusInfo._StateN || ''
    }
    return data;
  }

}
