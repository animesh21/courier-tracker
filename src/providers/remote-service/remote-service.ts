import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

/*
 Generated class for the RemoteServiceProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular DI.
 */

@Injectable()
export class RemoteServiceProvider {

  login_url = 'http://hamamaqatar.com/wp-json/login/v2/user/';

  post_url = 'http://hamamaqatar.com/coordinates.php/';

  chat_post_url = 'http://hamamaqatar.com/wp-json/chat/v2/add/';

  chat_get_url = 'http://hamamaqatar.com/wp-json/chat/v2/get/';

  constructor(public http: Http) {
    console.log('Hello RemoteServiceProvider Provider');
  }

  loginUser(email, password) {
    let postData = {
      email: email,
      password: password
    };

    // let opt: RequestOptions;
    // let headers: Headers = new Headers;
    // headers.set('Content-Type', "application/x-www-form-urlencoded");
    // opt = new RequestOptions
    //

    return this.http.post(this.login_url, postData)
      .map((res) => res.json());
  }

  sendData(data) {
    console.log('Posting data: ', data);
    this.http.post(this.post_url, data)
      .subscribe((res) => {
      console.log('data posted successfully: ' + res);
      return res;
      }, (error) => {
      console.error('error while posting data: ' + error);
      });
  }

  sendMessage(userID, message) {
    let postData = {
      chatUser: 12,
      currentUserID: userID,
      msg: message
    };

    return this.http.post(this.chat_post_url, postData);

    //   .subscribe((res) => {
    //   console.log('chat posted successfully: ' + JSON.stringify(res));
    //   return res;
    //   }, (err) => {
    //   console.error("Error while posting chat: " + JSON.stringify(err));
    //   return err;
    // });
  }

  getMessage(userID) {
    let postData = {
      chatUser: 12,
      currentUserID: userID
    };
    return this.http.post(this.chat_get_url, postData);
  }
}
