import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController} from 'ionic-angular';
import {LocationServiceProvider} from '../../providers/location-service/location-service';
import {HomePage} from '../home/home';
import {Storage} from '@ionic/storage';
import {RemoteServiceProvider} from "../../providers/remote-service/remote-service";
import {ChatPage} from "../chat/chat";

/**
 * Generated class for the LocationPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-location',
  templateUrl: 'location.html',
})

export class LocationPage {

  public homePage = HomePage;
  private name: string;

  messageLog = '';

  constructor(public navCtrl: NavController,
              public locationServiceProvider: LocationServiceProvider,
              public storage: Storage,
              public loadingCtrl: LoadingController,
              public remoteServiceProvider: RemoteServiceProvider) {
    this.storage.get('name').then((value) => {
      if (value) {
        this.name = value;
      }
      else {
        this.navCtrl.setRoot(this.homePage).then(() => {
          console.log('user not logged in, please login');
        }, (error) => {
          console.error('error in setting root');
        });
      }
    }, (error) => {
      console.error('storage error: ' + error);
    });
  }

  start() {
    this.locationServiceProvider.startTracking();
  }

  stop() {
    this.locationServiceProvider.stopTracking();
  }

  // chat functions
  sendMessage(message) {
    let user_id: any;

    this.storage.get('user_id').then((res) => {
      user_id = res;
      this.remoteServiceProvider.sendMessage(user_id, message).subscribe((res) => {
        console.log('Successfully sent the message: ' + JSON.stringify(res));
        this.messageLog += ("/n" + message);
      });
    }, (err) => {
      console.error("error in db: " + JSON.stringify(err));
    });
  }

  getMessage() {
    let user_id: any;

    this.storage.get('user_id').then((res) => {
      user_id = res;
      this.remoteServiceProvider.getMessage(user_id).subscribe((res) => {
        console.log('Message received: ' + JSON.stringify(res.json()));
      }, (err) => {
        console.error("Error in getting chat: " + JSON.stringify(err));
      }, () => {
        console.log("Complete getting chats");
      });
    });
  }
  // chat functions end

  goToChat() {
    this.navCtrl.push(ChatPage);
  }

  logoutUser() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...',
      duration: 5000
    });
    loading.present();
    this.storage.clear().then(() => {
      this.stop();
      this.navCtrl.setRoot(this.homePage)
        .then(() => {
          console.log('root set to login page');
          loading.dismiss().then(() => {
            console.log('loader dismissed');
          }, (error) => {
            console.error('error dismissing loader: ' + error);
          });
        }, (error) => {
          console.error('error in setting root');
        });
    }, (error) => {
      console.error('error in clearing storage');
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LocationPage');

  }
}
