import { __PATH__USERSDATA_MESSAGES, __PATH__USERSDATA_MESSAGES_SELF } from './../fire';
import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ISubscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/fromPromise';


import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';


import { HttpClient, HttpParams } from '@angular/common/http';
import { __PATH__USERSDATA_INFOS } from '../../providers/fire';
import { TranslateService } from '@ngx-translate/core';
import * as firebase from 'firebase';
const _ROLE_MEMBER = 'member';
const _STORAGE_BADGE_COUNT = 'BADGE_COUNT';
export interface UserInfoType {
  Phone?: string;
  Password?: string;
  Name?: string;
  Sex?: string;
  Birthday?: string;
  Country?: string;
  Adress?: string;
  ARC_No?: string;
  ARC_Date?: string;
  Belong?: string;
  ARC_Img?: string;
  ARC_Img_B?: string;
  Date?: number;
  _Wallets?: number;
  _DeviceID: string;
  _isQuick?: boolean;
  _LoginTimes: number;
  IsStaff: boolean;
  _i18n: string;
}
export interface AuthStateType {
  isAuth?: boolean;
  role?: string;
  uid?: string;
  phone?: string;
  info?: UserInfoType,
  _DeviceID?: string,

  _promo_tid?:string,
  _promo_uid?:string,
  _fromSupplier?:string,
}
@Injectable()
export class FireAuthProvider {
  state: Observable<AuthStateType>;
  private _state: BehaviorSubject<AuthStateType>;
  dataStore: {
      'state': AuthStateType,
  };
  _staus: {
    subscription: ISubscription;
  } = {
    subscription: {
      unsubscribe: () => {},
      closed: false,
    },
  }

  loginState: {
    subs: ISubscription,
  } = {
    subs: null,
  }

  constructor(
    private http: HttpClient,
    public alertCtrl: AlertController,
    public afData: AngularFireDatabase,
    public afAuth: AngularFireAuth,
  ) {
    console.log('Hello FireAuthProvider Provider');
    this._state = <BehaviorSubject<AuthStateType>>new BehaviorSubject({});
    this.state = this._state.asObservable();
    this.dataStore = {
        'state': {
            isAuth: false,
            role: null,
            uid: null,
            phone: null,
            info: null,
            _DeviceID: null,
            _promo_tid: null,
        }
    };
    this.state.subscribe(state => {
      console.log('>>> AUTH CHANGE: ');
      console.log(JSON.stringify(state));
    });

    // this._staus.subscription = this.loadAll();
    // return Observable.fromPromise(  );
  }
  _OneSignalObj: any = null;
  setOneSignalObj(obj) {
    this._OneSignalObj = obj;
  }
  onAuthChangeObservable() {
    return Observable.create( observer => {
        this.afAuth.auth.onAuthStateChanged(user => {
            observer.next(user);
        });
    });
  }
  fireUpdateInfo(info): Observable<boolean> {
    return Observable.create(observer => {
      this.getState().take(1).subscribe(state => {
        if(state.isAuth) {

          this.afData
          .object(__PATH__USERSDATA_INFOS + state.uid)
          .update(info)
          .then( snap => {
            observer.next(true);
            observer.complete();
          }, err => {
            observer.error(false);
            observer.complete();
          });
        }
      });
    });

  }
  fireSyncMember(key: string) {
    this.afData
    .object(__PATH__USERSDATA_INFOS + key)
    .valueChanges()
    .take(1)
    .subscribe(obj => {
      this.goMember(obj, key);
    });
  }
  fireGetMemberInfo(uid) {
    return Observable.create(observer => {


        this.afData
        .object(__PATH__USERSDATA_INFOS + uid)
        .valueChanges()
        .take(1)
        .subscribe((obj:any) => {
          if(obj){

            this.goMember(obj, uid).then(info => {
              observer.next(obj);
              observer.complete();
            });
          }else{
            this.logoutMember();
            observer.next(false);
            observer.complete();
          }
        }, fireERR => {
          this.logoutMember();
          observer.next(false);
          observer.complete();
        });


    });
  }
  logoutMember() {
    if(this.loginState.subs) {
      this.loginState.subs.unsubscribe();
    }
    this.nextPart({
      phone: null,
      uid: null,
      role: null,
      isAuth: false,
      info: null,
    });
    this.saveLocal();
    if(this.msgSubs) {
      this.msgSubs.unsubscribe();
      this.msgSubs = null;
    }
  }
  updateMemberInfo(info) {
    console.log('>>> updateMemberInfo: ');
    this.nextPart({
      info: info,
    });
    this.saveLocal();
  }
  goMember(info, uid ) {
    console.log('>>> GOMEMBER');
    return new Promise( (rlv, rej) => {
      this.nextPart({
        phone: info.Phone,
        uid: uid,
        role: _ROLE_MEMBER,
        isAuth: true,
        info: info,

      });
      rlv(info);
      this.fireUpdateInfo({
        _LoginTimes : ((info._LoginTimes ||0)+1),
        _LoginLast : new Date().getTime(),
        _Signal: this._OneSignalObj,
        _i18n: 'zh-cmn-Hant',
        ...this.clearGoMemberPendings(),
      }).subscribe(()=>{
        if(this.loginState.subs) {this.loginState.subs.unsubscribe(); this.loginState.subs = null;}
        this.loginState.subs = this.afData
        .object(__PATH__USERSDATA_INFOS+uid)
        .valueChanges()
        .subscribe(info => {

          this.updateMemberInfo(info);  // 實時同步更新
        });

      },err => {
        rej(err);
      });

    });



  }

  nextPart(part: AuthStateType) {
    Object.assign(this.dataStore.state, part);
    let next = Object.assign(
      {},
      this.dataStore
    );
    this._state.next(next.state);
    console.log(next.state);
  }
  saveLocal() {
    let tmp = Object.assign({},this.dataStore.state);
    // delete tmp.info.Password;
  }

  getState() {
      this.check2reFire().subscribe(()=>{});
      return this.state;
  }
  checkIsMember(): Observable<boolean> {
    return Observable.create(observer => {
      this._state.take(1).subscribe(authState => {
        if (authState.isAuth) {
          console.log('checkIsMember isAuth');
          observer.next(authState.info);
          observer.complete();
        } else {

            console.log('_ROLE_MEMBER');
            observer.next(false);
            observer.complete();
        }
      });

    });
  }
  check2reFire() {
    return Observable.create(observer => {
      if(!this.afAuth.auth.currentUser) {
        this.signInAnonymously().take(1).subscribe( res => {
          observer.next(this.afAuth.auth.currentUser.uid);
          observer.complete();
        });
      }else {
        observer.next(this.afAuth.auth.currentUser.uid);
        observer.complete();
      }
    });

  }
  loginAnonymously() {
    console.log('>>>fire-auth: loginAnonymously() START');
    this.signInAnonymously().subscribe((user: any) => {
      if(user) {
        console.log('>>>fire-auth: loginAnonymously() SUCCESS');
        console.log(user);
        this.checkIsMember().take(1).subscribe(member => {
          if(member) {

          }else {
            this.nextPart({ uid: user.uid, role: 'isAnonymous' });
          }
        });

        // user.isAnonymous  true
      }else {
        // alert('網路錯誤！');
      }
    }, err => {
      alert('NETWORK ERROR！！');
      console.log('匿名登入錯誤！');
      console.log(err);
    });
  }
  signInAnonymously() {
    return Observable.fromPromise(this.afAuth.auth.signInAnonymously());
  }
  loginUser(newEmail: string, newPassword: string): Observable<any> {
    return Observable.fromPromise(
      this.afAuth.auth.signInWithEmailAndPassword(newEmail, newPassword)
    );
  }

  resetPassword(email: string): Promise<any> {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }

  /*logoutUser(): Promise<any> {
    return this.afAuth.auth.signOut();
  }*/

  signupUser(newEmail: string, newPassword: string): Promise<any> {
    return this.afAuth.auth.createUserWithEmailAndPassword(newEmail, newPassword);
  }
  aAskMemberRegister(navCtrl, cancelFn=()=>{}) {
    if(this.dataStore.state.role != _ROLE_MEMBER) {  // 快速登入詢問

        let alert = this.alertCtrl.create({
          title: 'i18n.NOT_MEMBER',
          message: 'i18n.NOT_MEMBER_ASKS',
          buttons: [ {
              text: 'i18n.CANCEL',
              role: 'cancel',
              handler: () => {
                cancelFn();
              }
            }, {
              text: 'i18n.SIGNUP',
              handler: () => {
                navCtrl.setRoot('LoginPage', {phone: this.dataStore.state.phone, quick: false});
              }
            }]
        });
        alert.present();

    }
  }
  goMemberPendings:any = {};
  addGoMemberPendings(t) {
    Object.assign(this.goMemberPendings, t);
  }
  clearGoMemberPendings() {
    let v = Object.assign({}, this.goMemberPendings);
    Object.keys(this.goMemberPendings).map(k => {
      delete this.goMemberPendings[k];
    });
    return v;
  }
  QR_AddEmployee(sid, role = 'NULL') {
      let alert = this.alertCtrl.create({
        title: 'i18n.ASK_ADD_EMPLOYEE',
        // message: ,
        buttons: [ {
            text: 'i18n.CANCEL',
            role: 'cancel',
            handler: () => {
            }
          }, {
            text: 'i18n.OK_BUTTON',
            handler: () => {
              let time = new Date();
              let info = {
                IsEmplyer: true,
                IsStaff: true,
                HasAudit: true,
                _Boss: sid,
                // Belong: sid,
                _BossR: role,
                EMP_Posision: 'QRcode',
                EMP_StartDate: time.getFullYear() + '-' + (time.getMonth()+1) + '-' + time.getDate(),
              };
              this.checkIsMember().subscribe(user => {
                if(user) {
                  console.log('update')
                  this.fireUpdateInfo(info).subscribe(ok => {
                    this.alertCtrl.create({
                      title: 'i18n.SUCCESSED',
                      buttons: [ {
                        text: 'i18n.OK_BUTTON',
                        role: 'cancel',
                        handler: () => {
                        }
                      }]
                    }).present();
                  })
                } else {
                  console.log('addGoMemberPendings')
                  this.addGoMemberPendings(info);
                }
              });
            }
          }]
      });
      alert.present();

  }
  PROMO_saveBelongSupplier(tid) {
    this.nextPart({_promo_tid: tid});
    this.saveLocal();
  }
  PROMO_saveUserInviteFrom(uid) {
    this.nextPart({_promo_uid: uid});
    this.saveLocal();
  }
  PROMO_getBelongSupplier() {
    return Observable.create()
  }
  PROMO_addSupplier(tid = null) {
    try {
      let promo = this.dataStore.state._promo_tid;
      if(promo || tid) {
        let vendors = (this.dataStore.state.info.Belong||'')
                        + ((promo)? ',' + promo : '') + ((tid)? ',' + tid : '');
        // vendors.replace('null,','').replace(',null','');
        if(vendors) {
          this
          .fireUpdateInfo({Belong: vendors })
          .subscribe(() => {
            this.nextPart({_promo_tid:null});
            this.saveLocal();
            console.log('>>> 增加匯款商！');
          });
        }
      }
    } catch (error) {
      console.log(error);
    }


  }
  fromSupplier() {
    return {
      set: (key:string) => {
        this.nextPart({_fromSupplier:key});
      },
      get: () => {
        return this.dataStore.state._fromSupplier;
      },
      rm: () => {
        this.dataStore.state._fromSupplier = null;
      }
    }
  }
  getPReferASYNC(): Observable<Array<any>> {
    return this.afData
    .list(__PATH__USERSDATA_INFOS, ref => ref.orderByChild('_pRefer').equalTo(this.dataStore.state.uid) )
    .snapshotChanges()
    .take(1)
    .map(snap => snap.map(user => ({
      ...user.payload.val(),
      key: user.payload.key,
    })));
  }
  msgSubs: ISubscription = null;

  getNotiBadge(): Observable<any> {
    return this.afData.object(__PATH__USERSDATA_MESSAGES_SELF + this.dataStore.state.uid).valueChanges();
    /*return Observable.create(observer => {
      this.afData.object(__PATH__USERSDATA_MESSAGES_SELF).valueChanges()

      if(this.loginState.pushobj) {
        this.loginState.pushobj.getApplicationIconBadgeNumber().then(c => {
          observer.next(c);
          observer.complete();
        }, err => {
          observer.next(0);
          observer.complete();
        });
      } else {
        this.Storage.getItem(_STORAGE_BADGE_COUNT).then(c => {
          observer.next(c);
          observer.complete();
        }, err => {
          observer.next(0);
          observer.complete();
        });
      }
    });*/
  }
  addMessage(TITLE: string, DESC: string, EVENT = 'CUSTOM_1', toadmin = true) { /*
    if(typeof this.dataStore.state['_MESSAGES'] != 'number') {
      this.dataStore.state['_MESSAGES'] = 0;
    }
    let c = this.dataStore.state['_MESSAGES']+1;
    this.fireUpdateInfo({
      _MESSAGES: c
    }).subscribe(() => {}); */
    let info = this.dataStore.state['info'];
    let belong = '';
    if(info['Belong']) {
      belong = info['Belong'] || '';
    }
    if(EVENT === 'MESSAGE_ADD') {
      this.afData.list(__PATH__USERSDATA_MESSAGES + this.dataStore.state['uid']).push(
        firebase.database.ServerValue.TIMESTAMP
      );
    }

    let opt = {
      TITLE: TITLE,
      DESC: DESC,
      UID: belong.split(','),
      EVENT: EVENT,
      ADMIN: toadmin,
    }
    this.http.post('https://iintw.com/onesignal', opt).subscribe(res => {
      console.log(JSON.stringify(opt));

    });
  }
}
