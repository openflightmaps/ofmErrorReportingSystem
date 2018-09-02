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
  private currentRegion: string = '';
  constructor(
    private auth: AuthService,
    public navCtrl: NavController,
    private alertCtrl: AlertController,
    private connector: ConnectorProvider,
    private loadCtrl: LoadingController
  ) {
    this.items = [];
    this.currentRegion = '';
  }


  ionViewDidEnter() {

    let load = this.loadCtrl.create({
      content: 'Receiving Regions'
    });

    load.present();

    this.connector.getRegions()
      .then((result) => {
        //display countries to the user
        let cards = result.data;
        console.log(cards);

        for (let i = 0; i < cards.length; i++) {
          this.items.push(cards[i].name);
        }

        load.dismiss();
      })

      .catch(e => {
        load.dismiss();
        this.errorAlert(e);
      });
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
    this.showTextMenu = true;


  }

  cancel() {
    this.showTextMenu = false;
  }

  sending() {
    if (this.textAr) {
      let load = this.loadCtrl.create({
        content: 'Sending Message'
      });
      let em = this.auth.getEmail();

      load.present();

      this.connector.postMessage({ header: 'Error Message', message: this.textAr, region: this.currentRegion })
        .then(() => {
          load.dismiss();
          //after posting message return a default UI view
          this.textAr = '';
          this.showTextMenu = false;
          this.alertSentMessage();
        })
        .catch(e => {
          load.dismiss();
          this.errorAlert(e);
        });
    } else {
      this.alertEmpty();
    }
  }


  //ALERTS
  alertSentMessage() {
    let alert = this.alertCtrl.create({
      title: 'Message is sent successfully',
      buttons: ['Dismiss']
    });
    alert.present();
  }

  alertEmpty() {
    let alert = this.alertCtrl.create({
      title: 'Message is empty',
      subTitle: 'Type your message please',
      buttons: ['Ok']
    });
    alert.present();
  }

  errorAlert(e) {
    let alert = this.alertCtrl.create({
      title: 'Error',
      message: e,
      buttons: ['Ok']
    });
    alert.present();
  }
}
