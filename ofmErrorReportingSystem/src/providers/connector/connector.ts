import { Injectable } from '@angular/core';

/*
  Generated class for the ConnectorProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ConnectorProvider {
  private url: string = '';
  constructor() {
    console.log('Hello ConnectorProvider Provider');
    this.url = '{myurl}';
  }
  getRegions(jwt) {
    return new Promise((resolve, reject) => {
      //DEV
      setTimeout(() => {
        console.log(jwt);
        resolve();
      }, 3000);
    //ORIGINAL VERSION
      //let xhr = new XMLHttpRequest();
      //xhr.onreadystatechange = function () {//Call a function when the state changes.
      //  if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
      //    let data = JSON.parse(xhr.responseText);
      //    resolve(data);

      //    // Request finished. Do processing here.
      //  } else if (xhr.readyState == XMLHttpRequest.DONE) {
      //    reject();

      //  };
      //};
      
      //let u = this.url;
      //xhr.open("GET", u, true);
      //xhr.setRequestHeader("Authorization", jwt);
      //xhr.send(null);
    });
  }

  postMessage(jwt, email, content, region) {
    return new Promise((resolve, reject) => {
    //DEV
      setTimeout(() => {
        console.log(jwt);
        console.log(email);
        console.log(content.header);
        console.log(content.message);
        console.log(region);
        resolve();
      }, 3000);
    //ORIGINAL VERSION
    //  let objForRequest = {
    //    email: email,
    //    content: content,
    //    region: region
    //  }

    //  let xhr = new XMLHttpRequest();
    //  xhr.onreadystatechange = function () {//Call a function when the state changes.
    //    if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
    //      let data = JSON.parse(xhr.responseText);
    //      resolve(data);

    //      // Request finished. Do processing here.
    //    } else if (xhr.readyState == XMLHttpRequest.DONE) {
    //      reject();

    //    };
    //  };


    //  xhr.open("POST", this.url, true);
    //  xhr.setRequestHeader("Authorization", jwt);
    //  xhr.setRequestHeader("Content-Type", "application/json");
    //  xhr.send(JSON.stringify(objForRequest));
    });

  }
}
