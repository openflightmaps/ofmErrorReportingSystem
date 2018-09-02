import { Injectable, NgModule } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import AuthProvider = firebase.auth.AuthProvider;


@Injectable()
export class AuthService {
  private user: firebase.User;
  private emailSent: boolean;
  private errorMessage: string;

  constructor(public afAuth: AngularFireAuth) {
    afAuth.authState.subscribe(user => {
      this.user = user;
    });
  }

  async signInWithEmail(credentials) {
    console.log('Sign in with email');
    let actionCodeSettings = {
	url: 'https://ofm-error-reporting-test.firebaseapp.com',
	handleCodeInApp: true,
    };

    try {
      await this.afAuth.auth.sendSignInLinkToEmail(credentials.email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', credentials.email);
      this.emailSent = true;
    } catch (err) {
      this.errorMessage = err.message;
    }
  }

  async confirmSignIn(url) {
    try {
      if (this.afAuth.auth.isSignInWithEmailLink(url)) {
        let email = window.localStorage.getItem('emailForSignIn');
  
        // If missing email, prompt user for it
        if (!email) {
          email = window.prompt('Please provide your email for confirmation');
        }
  
        // Signin user and remove the email localStorage
        const result = await this.afAuth.auth.signInWithEmailLink(email, url);
        window.localStorage.removeItem('emailForSignIn');
      }
    } catch (err) {
      this.errorMessage = err.message;
    }
  }

  signUp(credentials) {
    return this.afAuth.auth.createUserWithEmailAndPassword(credentials.email, credentials.password);
  }

  get authenticated(): boolean {
    return this.user !== null;
  }

  getEmail() {
    return this.user && this.user.email;
  }

  signOut(): Promise<void> {
    return this.afAuth.auth.signOut();
  }

  signInWithGoogle(): any {
    console.log('Sign in with google');
    return this.oauthSignIn(new firebase.auth.GoogleAuthProvider());
  }

  private oauthSignIn(provider: AuthProvider) {
    if (!(<any>window).cordova) {
      return this.afAuth.auth.signInWithPopup(provider);
    } else {
      return this.afAuth.auth.signInWithRedirect(provider)
        .then(() => {
          return this.afAuth.auth.getRedirectResult().then(result => {

            let user = result.user;
   
          }).catch(function (error) {
            alert(error.message);
          });
        });
    }
  }

  signInWithFacebook(): any {
    console.log('Sign in with facebook');
    return this.oauthSignIn(new firebase.auth.FacebookAuthProvider());
  }

  sendResetEmail(email) {
    this.afAuth.auth.sendPasswordResetEmail(email).then(function () {
      console.log('Email reset sent');
    }).catch(function (error) {
      console.log(error);
    });
  }
}
