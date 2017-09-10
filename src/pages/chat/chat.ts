import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { RemoteServiceProvider } from "../../providers/remote-service/remote-service";
import { Storage } from '@ionic/storage';
/**
 * Generated class for the ChatPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html'
})
export class ChatPage {
  @ViewChild('chatcontent') chatcontent;

  myChats: any;
  chatTimer: any;

  constructor(public navCtrl: NavController, public remoteServiceProvider: RemoteServiceProvider,
              public storage: Storage) {
    this.myChats = this.getMessage();
  }

  // chat functions
  sendMessage(message) {
    let user_id: any;

    this.storage.get('user_id').then((res) => {
      user_id = res;
      this.remoteServiceProvider.sendMessage(user_id, message).subscribe((res) => {
        console.log('Successfully sent the message: ' + JSON.stringify(res));
        this.getMessage();
        // this.messageLog += ("/n" + message);
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
        let myChats = res.json();
        this.myChats = myChats.sort(function(a, b) {
          let dateA = new Date(a.date_added);
          let dateB = new Date(b.date_added);
          if (dateB > dateA) {
            return -1;
          }
          else if (dateA > dateB) {
            return 1;
          }
          else {
            return 0;
          }
        });
        // console.log('chatcontent: ' + JSON.stringify(this.chatcontent));
        this.chatcontent.scrollToBottom();

        // console.log('Message received: ' + JSON.stringify(this.myChats));
      }, (err) => {
        console.error("Error in getting chat: " + JSON.stringify(err));
      }, () => {
        console.log("Complete getting chats");
      });
    });
  }
  // chat functions end

  ionViewDidLoad() {
    this.chatcontent.scrollToBottom();
    this.chatTimer = setInterval(() => {
      this.getMessage();
    }, 4000);

    console.log('ionViewDidLoad ChatPage');
  }

  ionViewWillLeave() {
    clearInterval(this.chatTimer);
  }

}
