import { FreightTabsPage } from './../pages/service-freight/freight-tabs/freight-tabs';
import { LoginPage } from './../pages/login/login';
import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, Nav, App, ToastController } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

//pages
// import { FreightVendorlistPage } from '../pages/service-freight/freight-vendorlist/freight-vendorlist';
//import { FreightOrderingBuyerInfoPage } from '../pages/service-freight/freight-ordering-buyer-info/freight-ordering-buyer-info';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  rootPage = LoginPage;
  pages: Array<{title: string, component: any}>;

  constructor(
    private toastCtrl: ToastController,
    public app: App,
    public platform: Platform,
    public menu: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen
  ) {
    this.initializeApp()

    // set our app's pages
    this.pages = [
      { title: 'Freight Vendor List', component: 'FreightVendorlistPage'}
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // this.statusBar.styleDefault();
      this.statusBar.styleLightContent()
      this.statusBar.backgroundColorByHexString('#0158b5');
      this.splashScreen.hide();
      this.registerBackButtonAction();
    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }

  registerBackButtonAction() {
    this.platform.registerBackButtonAction(() => {

      // if (this.keyboard.isOpen()) {
      //   this.keyboard.close();
      //   return;
      // }

      const overlay = this.app._appRoot._overlayPortal.getActive();
      if(overlay && overlay.dismiss) {
        overlay.dismiss();
        return;
      }


      const nav = this.app.getActiveNav();
      const activeView = nav.getActive();
      if(activeView.instance.backButtonAction) {
        activeView.instance.backButtonAction();
        return;
      }


      if(nav.canGoBack()){
        nav.pop();
      } else {
        //this.platform.exitApp();
        this.showExit();
      }


    });
  }

  //双击退出提示框
  backButtonPressed: boolean = false;
  showExit() {
    if (this.backButtonPressed) { //当触发标志为true时，即2秒内双击返回按键则退出APP
      this.platform.exitApp();
    } else {
      //this.showToast('再按一次退出应用');
      this.presentToast();
      this.backButtonPressed = true;
      setTimeout(() => { //2秒内没有再次点击返回则将触发标志标记为false
        this.backButtonPressed = false;
      }, 2000)
    }
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: '再按一次退出',
      duration: 2000,
      position: 'bottom',
      cssClass: 'toast-text'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

}
