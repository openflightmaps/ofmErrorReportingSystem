import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HomePage } from '../home/home';
import { AuthService } from '../../services/auth.service';

@IonicPage()
@Component({
  selector: 'as-page-signup',
  templateUrl: './signup.html'
})
export class SignupPage {

  signupError: string;
  form: FormGroup;

  constructor(
    private auth: AuthService,
    fb: FormBuilder,
    private navCtrl: NavController
  ) {
    this.form = fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    });
  }

  signup() {
    console.log('signed');
    let data = this.form.value;
    let credentials = {
      email: data.email,
      password: data.password
    };
    this.auth.signUp(credentials).then(
      () => this.navCtrl.setRoot(HomePage),
      error => this.signupError = error.message
    );
  }
}


