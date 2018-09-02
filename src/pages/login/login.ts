
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HomePage } from '../home/home';
import { AuthService } from '../../services/auth.service';
import { SignupPage } from '../signup/signup';
import { LoginEmailPage } from '../login-email/login-email';
import { AlertController } from 'ionic-angular';

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
    private alertCtrl: AlertController,
    fb: FormBuilder
  ) {
    this.loginForm = fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])]
    });
  }

  login() {
    let data = this.loginForm.value;

    if (!data.email) {
      return;
    }

    let credentials = {
      email: data.email,
    };

    this.auth.signInWithEmail(credentials)
      .then(
        () => { console.log('loggedIn');
    		this.navCtrl.push(LoginEmailPage);
		},
        error => {
          this.loginError = error.message;
          if (this.loginError == 'The password is invalid or the user does not have a password.') {
            this.loginError = 'The password is invalid or the user is registered with Facebook or Google.';
          }
        }
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


  resetPassword() {
    this.alertReeset();
  }

  alertReeset() {
    let prompt = this.alertCtrl.create({
      title: 'Account email',
      inputs: [
        {
          name: 'Email',
          placeholder: 'Email',
          type: 'email'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Send Reset Link',
          handler: data => {

            //validating email entered
            let emailAddress = data.Email;
            let emailTest = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

            if (emailTest.test(String(emailAddress).toLowerCase())) {
              this.auth.sendResetEmail(emailAddress); 
            } else {
              prompt.setSubTitle('Invalid email syntax');
              return false;
            }
         
          }
        }
      ]
    });

    prompt.present();
  }
}



