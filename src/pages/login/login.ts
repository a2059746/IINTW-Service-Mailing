import { FireAuthProvider } from './../../providers/fire-auth/fire-auth';
import { Component } from '@angular/core';
// import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController, AlertController, LoadingController  } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// FreightVendorlistPage

import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';
import { __PATH__USERSDATA_INFOS } from '../../providers/fire';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  // public mask = ['+', '8', '8', '6', '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];// '/[1-9]/'
  public mask = ['0', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/];

  member = {
    uid: null,
    info: null,
  }
  isMember = false;

  account: { password: string, invalid: boolean } = {
    // phone: '',
    password: '',
    invalid: false,
  };

  // form: FormGroup;
  // Our translated text strings
  private loginErrorString: string;
  private loginSccString: string;
  credentialsForm: FormGroup;
  canAuth:boolean =  false;
  constructor(
    public formBuilder: FormBuilder,
    private alertCtrl: AlertController,
    public AUTH: FireAuthProvider,
    private AfData: AngularFireDatabase,
    private loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    // public translateService: TranslateService
  ) {

    this.credentialsForm = this.formBuilder.group({
      phone: ['', Validators.compose([Validators.maxLength(10), Validators.pattern('[0-9]{10}'), Validators.required])],

    });
    this.credentialsForm.valueChanges.subscribe((v) => {
      this.canAuth = this.credentialsForm.valid;
    });

    this.loginErrorString = 'LOGIN_ERROR';
    this.loginSccString = 'LOGIN_SUCCESS';
  }
  tips: string = '';
  ionViewDidEnter(){
    if ('zh-cmn-Hant') {
      this.AfData.object('/__APP_SETTINGS__/loginTipObj/' + 'zh-cmn-Hant')
      .valueChanges()
      .take(1)
      .subscribe((t: any) => {
        if(t) {
          this.tips = t;
        } else {}
      });
    }

  }
  memberCancel() {
    this.isMember = false;
    this.account.invalid = false;
  }
  memberLogin() {
    if(this.account.password === this.member.info.Password ) {
      this.account.invalid = false;
      // console.log(this.member.info);
      this.sccLogin(this.member.info, this.member.uid);
    }else {
      this.account.invalid = true;

        let alert = this.alertCtrl.create({
          title: 'i18n.PASSWORD_WRONG',
          message: 'i18n.PLS_CORRECT_PASSWORD',
          buttons: [
            {
              text: 'i18n.REENTER',
              role: 'cancel',
              handler: () => {

              }
            }
          ]
        });
        alert.present();


    }
  }
  login() {
    let loader = this.loadingCtrl.create();
    let loginPhone = this.credentialsForm.controls.phone.value;
    console.log(loginPhone);
    loader.present();
    this.AfData
      .list(
        __PATH__USERSDATA_INFOS,
        ref => ref.orderByChild('Phone').equalTo(loginPhone)
      )
      .snapshotChanges()
      .take(1)
      .subscribe(res => {
        this.AUTH.nextPart({phone: loginPhone});

        if(res.length) {  // 會員

          let val: any = res[0].payload.val();
          this.isMember = true;
          this.member.info = val;
          this.member.uid = res[0].payload.key;

          if(!val.Password) {
            this.sccLogin(this.member.info, this.member.uid);  //TODO 未設定密碼就直接登入
          }
          loader.dismiss();
          //console.log(this.member);
        }else {  // 非會員
          alert('非會員')
          loader.dismiss();


        }
      }, fireERR => {

      });

  }

  askRegister(): Observable<string> {
    return Observable.create( observer => {

        let alert = this.alertCtrl.create({
          title: 'i18n.SIGNUP',
          message: 'i18n.SIGNUP_ASKS',
          buttons: [
            {
              text: 'i18n.DONT_SIGNUP',
              handler: () => {
                observer.next('z');
                observer.complete();
              }
            },
            {
              text: 'i18n.SIGNUP_NO_INFO',
              handler: () => {
                observer.next('b');
                observer.complete();
              }
            },
            {
              text: 'i18n.SIGNUP',
              handler: () => {
                observer.next('a');
                observer.complete();
              }
            }
          ],
          enableBackdropDismiss: false
        });
        alert.present();
      });


  }
  annoymousLogin() {
    /* let toast = this.toastCtrl.create({
      message: this.loginSccString,
      duration: 3000,
      position: 'bottom',
      showCloseButton: true,
    });
    toast.present(); */
    this.navCtrl.setRoot('FreightTabsPage');
  }
  sccLogin(info, uid) {
    this.AUTH.goMember(info, uid);
    setTimeout(()=>{this.AUTH.PROMO_addSupplier()},1000)

    /*
    let toast = this.toastCtrl.create({
      message: this.loginSccString,
      duration: 3000,
      position: 'bottom',
      showCloseButton: true,
    });
    toast.present(); */
    this.navCtrl.setRoot('FreightTabsPage');
  }
}
