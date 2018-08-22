import { AngularFireAuth } from 'angularfire2/auth';
// import { LoginPage } from './../pages/login/login';
import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, Nav } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';

//pages
// import { FreightVendorlistPage } from '../pages/service-freight/freight-vendorlist/freight-vendorlist';
//import { FreightOrderingBuyerInfoPage } from '../pages/service-freight/freight-ordering-buyer-info/freight-ordering-buyer-info';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  rootPage = HomePage;
  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform,
    public menu: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public fireAuth: AngularFireAuth,
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
      this.statusBar.styleDefault();

      this.fireAuth.auth.signInAnonymously().then(res => {
        this.splashScreen.hide();
      });
    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }
}
