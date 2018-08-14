
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HomePage } from '../home/home';
import { AuthService } from '../../services/auth.service';
import { SignupPage } from '../signup/signup';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loginForm: FormGroup;
  loginError: string;


  constructor(
    private auth: AuthService,
    private navCtrl: NavController,
    fb: FormBuilder
  ) {
    this.loginForm = fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    });
  }

  login() {
    let data = this.loginForm.value;

    if (!data.email) {
      return;
    }

    let credentials = {
      email: data.email,
      password: data.password
    };
    this.auth.signInWithEmail(credentials)
      .then(
        () => console.log('loggedIn')/*this.navCtrl.setRoot(HomePage)*/,
        error => this.loginError = error.message
      );
  }

  signup() {
    this.navCtrl.push(SignupPage);
  }

  loginWithGoogle() {
    this.auth.signInWithGoogle()
      .then(
        () => this.navCtrl.setRoot(HomePage),
        error => console.log(error.message)
      );
  }

  loginWithFacebook() {

    this.auth.signInWithFacebook()
      .then(
        () => this.navCtrl.setRoot(HomePage),
        error => console.log(error.message)
      );
  }

  makeRequest(url, comment, coords, country) {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      let newObj;
      let data = {
        comment: comment,
        coordinates: coords,
        country: country
      };
      xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
          console.log(xhr.responseText);
          newObj = JSON.stringify(data);
          resolve();
        } else if (xhr.readyState == XMLHttpRequest.DONE) {
          reject()
        }
      }
      xhr.open('POST', url);
      xhr.send(newObj)
    });
  }

}



