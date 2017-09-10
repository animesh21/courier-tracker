import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { RemoteServiceProvider } from '../providers/remote-service/remote-service';
import { HttpModule } from "@angular/http";
import {IonicStorageModule} from "@ionic/storage";
import { LocationServiceProvider } from '../providers/location-service/location-service';
import { Geolocation } from '@ionic-native/geolocation';
import {LocationPage} from "../pages/location/location";
import {BackgroundGeolocation} from "@ionic-native/background-geolocation";
import { VideoPlayer } from '@ionic-native/video-player';
import {ChatPage} from "../pages/chat/chat";
import {MomentModule} from 'angular2-moment';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LocationPage,
    ChatPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    MomentModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LocationPage,
    ChatPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RemoteServiceProvider,
    LocationServiceProvider,
    Geolocation,
    BackgroundGeolocation,
    VideoPlayer
  ]
})
export class AppModule {}
