import { Injectable } from '@angular/core';

@Injectable()
export class Config {
  public wordpressApiUrl = 'http://demo.titaniumtemplates.com/wordpress/?json=1';
}

export const firebaseConfig = {
  fire: {
    apiKey: "AIzaSyA_ZYRKowtV012j_uywhSPT7c3zNu5tZH8",
    authDomain: "testprog-bbefd.firebaseapp.com",
    databaseURL: "https://testprog-bbefd.firebaseio.com",
    projectId: "testprog-bbefd",
    storageBucket: "",
    messagingSenderId: "1082780344229"
  }
};
