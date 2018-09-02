import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/functions';

@Injectable()
export class ConnectorProvider {
  getRegions = firebase.functions().httpsCallable('getCountries');
  postMessage = firebase.functions().httpsCallable('postMessage');
}
