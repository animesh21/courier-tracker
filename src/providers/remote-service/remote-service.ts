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

  url = 'http://studio-tesseract.com/courier/wp-json/login/v2/user/';

  constructor(public http: Http) {
    console.log('Hello RemoteServiceProvider Provider');
  }

  loginUser(email, password) {
    let postData = {
      email: email,
      password: password
    };

    return this.http.post(this.url, postData)
      .map((res) => res.json());
  }


}
