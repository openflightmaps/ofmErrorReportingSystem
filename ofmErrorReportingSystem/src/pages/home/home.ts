import { Component, ViewChild } from '@angular/core';
import { MenuController, Nav, Platform, NavController, Loading } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from '../../pages/login/login';

import { AuthService } from '../../services/auth.service';
import { AlertController } from 'ionic-angular';

import { ConnectorProvider } from '../../providers/connector/connector';
import { LoadingController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  textAr;

  private items: Array<any>;
  private showTextMenu: boolean = false;
  private countryName: string = '';
  private currentRegion: string = '';
  private jwt = {};
  constructor(
    private auth: AuthService,
    public navCtrl: NavController,
    private alertCtrl: AlertController,
    private connector: ConnectorProvider,
    private loadCtrl: LoadingController
  ) {
    this.items = [];
    this.currentRegion = '';
    this.jwt = {};
  }


  ionViewDidEnter() {
    console.log('home Page');
    let load = this.loadCtrl.create({
      content: 'Receiving Regions'
    });
    load.present();
    this.auth.getJwt()
      .then(jwt => {
        this.jwt = jwt;
        this.connector.getRegions(this.jwt)
          //DEV
          .then(() => {
           this.items = [11111111, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
            load.dismiss();
            
          })
          //ORIGINAL VERSION
          //.then((data) => {
   
          //  this.items = data;
          //  load.dismiss();
          //})
          .catch(e => console.log(e));
      })
      .catch(e => console.log(e));
  }

  login() {
    this.auth.signOut();
    this.navCtrl.setRoot(LoginPage);
  }

  logout() {
    this.auth.signOut();
    this.navCtrl.setRoot(LoginPage);
  }

  itemClicked(e, item) {
    this.currentRegion = item.toString();
    this.countryName = item.toString();
    this.showTextMenu = true;
  }

  cancel() {
    console.log(typeof this.jwt);
    console.log(this.jwt);
    this.showTextMenu = false;
  }

  sending() {
    let load = this.loadCtrl.create({
      content: 'Sending Message'
    });
    let em = this.auth.getEmail();
    load.present();
    if (this.jwt != {}) {
      this.connector.postMessage(this.jwt, em, { header: 'Error Message', message: this.textAr }, this.currentRegion)
        .then(() => {
          load.dismiss();
          this.textAr = '';
          this.showTextMenu = false;
          this.alertSentMessage();
        })
        .catch(e => console.log(e));
    }

  }

  alertSentMessage() {
    let alert = this.alertCtrl.create({
      title: 'Message is sent successfully',
      buttons: ['Dismiss']
    });
    alert.present();
  }
}
