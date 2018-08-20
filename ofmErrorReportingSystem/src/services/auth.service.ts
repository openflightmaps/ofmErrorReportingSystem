import { Injectable, NgModule } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import AuthProvider = firebase.auth.AuthProvider;


@Injectable()
export class AuthService {
  private user: firebase.User;

  constructor(public afAuth: AngularFireAuth) {
    afAuth.authState.subscribe(user => {
      this.user = user;
    });
  }

  signInWithEmail(credentials) {
    console.log('Sign in with email');
    return this.afAuth.auth.signInWithEmailAndPassword(credentials.email,
      credentials.password);
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

  getJwt() {
    return new Promise((resolve, reject) => {
      this.user.getIdToken()
        .then(data => {
          resolve(data);
        })
        .catch(e => {
          reject(e);
        });
    });
    
  }

  sendResetEmail(email) {
    this.afAuth.auth.sendPasswordResetEmail(email).then(function () {
      console.log('Email reset sent');
    }).catch(function (error) {
      console.log(error);
    });
  }
}
