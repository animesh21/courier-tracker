import {Component} from '@angular/core';
import {AlertController, LoadingController, NavController} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {RemoteServiceProvider} from "../../providers/remote-service/remote-service";
import {LocationPage} from '../location/location';
import {Storage} from '@ionic/storage'

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [RemoteServiceProvider]
})
export class HomePage {
  private login: FormGroup;

  private locationPage = LocationPage;

  constructor(public navCtrl: NavController,
              public formBuilder: FormBuilder,
              public remoteServiceProvider: RemoteServiceProvider,
              public storage: Storage,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController) {
    this.storage.get('name').then((value) => {
      if (value) {
        console.log('name in login view: ' + value);
        this.navCtrl.setRoot(this.locationPage).then(() => {
          console.log('user already logged in');
        }, (error) => {
          console.error('can not set root' + error);
        });
      }
    }, (error) => {
      console.error('storage not working: ' + error);
    });
    this.login = this.formBuilder.group({
      email: ['', Validators.email],
      password: ['', Validators.required]
    });
  }

  loginUser() {
    let email = this.login.value.email;
    let password = this.login.value.password;
    let loading = this.loadingCtrl.create({
      content: 'Please wait...',
      duration: 5000
    });
    loading.present();
    this.remoteServiceProvider.loginUser(email, password)
      .subscribe((data) => {
        console.log('Response data: ');
        console.log(data);

        // case when user enters invalid credentials
        if (data == 'failed') {
          let alert = this.alertCtrl.create({
            title: 'Invalid Credentials!',
            subTitle: 'The credentials you provided didn\'t match, please try again.',
            buttons: ['Dismiss']
          });
          console.log('credentials not valid');
          loading.dismiss().then(() => {
            console.log('dismissed loading, invalid credentials');
            alert.present().then(() => {
              console.log('alert fired');
            }, (error) => {
              console.error('alert not fired: ' + error);
            })
          }, (error) => {
            console.error('can not dismiss loading: ' + error);
          });
        }

        // when credentials are valid
        else {
          this.storage.remove('failed').then(() => {
            console.log('removed failed');
          }, (error) => {
            console.error('can not remove failed: ' + error);
          });
          let name = data['data']['display_name'];
          let email = data['data']['user_email'];
          let user_id = +data['data']['ID'];

          this.storage.set('name', name);
          this.storage.set('email', email);
          this.storage.set('user_id', user_id);
          this.navCtrl.setRoot(this.locationPage)
            .then(() => {
              console.log('Root set to location page');
              loading.dismiss().then(() => {
                console.log('loader dismissed');
              }, (error) => {
                console.error('error in dismissing loader: ' + error);
              });
            }, (error) => {
              console.error('Can not set the root: ' + error);
            });
        }
      }, (error) => {
        console.error('Can not login, error: ' + error);
      });


  }
}
