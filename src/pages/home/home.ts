import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {RemoteServiceProvider} from "../../providers/remote-service/remote-service";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [RemoteServiceProvider]
})
export class HomePage {
  private login: FormGroup;

  constructor(public navCtrl: NavController,
              private formBuilder: FormBuilder,
              private remoteServiceProvider: RemoteServiceProvider
  ) {
    this.login = this.formBuilder.group({
      email: ['', Validators.email],
      password: ['', Validators.required]
    });
  }

  loginUser() {
    let email = this.login.value.email;
    let password = this.login.value.password;
    this.remoteServiceProvider.loginUser(email, password)
      .subscribe((data) => {
      console.log('Post data: ');
      console.log(data);
      });
  }
}
