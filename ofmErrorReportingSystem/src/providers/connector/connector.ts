import { Injectable } from '@angular/core';


@Injectable()
export class ConnectorProvider {
  private url: string = '';
  constructor() {
    this.url = 'https://beta.dronaid.org/ofm/{typeOfRequest}';
  }
  getRegions(jwt) {
    return new Promise((resolve, reject) => {

      let xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function () {//Call a function when the state changes.
        if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
          let data = JSON.parse(xhr.responseText);

          resolve([data.cards]);

        } else if (xhr.readyState == XMLHttpRequest.DONE) {

          reject('Cannot get regions!');

        };
      };

      let u = this.url.replace("{typeOfRequest}", "getCountries");
      xhr.open("GET", u, true);
      xhr.setRequestHeader("Authorization", jwt);
      xhr.send(null);
    });
  }

  postMessage(jwt, email, message, region) {
    return new Promise((resolve, reject) => {

      let content = {
        email: email,
        message: message.message,
        title: region
      }

      let xhr = new XMLHttpRequest();
      xhr.onreadystatechange = function () {//Call a function when the state changes.
        if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
          let data = JSON.parse(xhr.responseText);

          resolve(data);

        } else if (xhr.readyState == XMLHttpRequest.DONE) {

          reject('Unnable to post message');

        };
      };

      let u = this.url.replace("{typeOfRequest}", "postErrorMessage");
      xhr.open("POST", u, true);
      xhr.setRequestHeader("Authorization", jwt);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(JSON.stringify(content));
    });

  }
}
