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

  login_url = 'http://studio-tesseract.com/courier/wp-json/login/v2/user/';

  post_url = 'http://studio-tesseract.com/courier/coordinates.php/';

  constructor(public http: Http) {
    console.log('Hello RemoteServiceProvider Provider');
  }

  loginUser(email, password) {
    let postData = {
      email: email,
      password: password
    };

    return this.http.post(this.login_url, postData)
      .map((res) => res.json());
  }

  sendData(data) {
    console.log('Posting data: ', data);
    this.http.post(this.post_url, data)
      .subscribe((res) => {
      console.log('data posted successfully: ' + res);
      }, (error) => {
      console.error('error while posting data: ' + error);
      });
  }
}
