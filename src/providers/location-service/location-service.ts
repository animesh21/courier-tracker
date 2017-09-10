import {Injectable, NgZone} from '@angular/core';
import {Geolocation, GeolocationOptions, Geoposition} from '@ionic-native/geolocation';
import {BackgroundGeolocation, BackgroundGeolocationConfig} from '@ionic-native/background-geolocation';
import 'rxjs/add/operator/filter';
import {RemoteServiceProvider} from "../remote-service/remote-service";
import {Storage} from '@ionic/storage';

/*
 Generated class for the LocationServiceProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular DI.
 */

declare var google;

@Injectable()
export class LocationServiceProvider {

  public watchUserPosition: any;
  public lat: number = 0;
  public lng: number = 0;
  public address: string;

  public geocoder = new google.maps.Geocoder;

  constructor(public zone: NgZone,
              public geolocation: Geolocation,
              public backgroundGeolocation: BackgroundGeolocation,
              public remoteServiceProvider: RemoteServiceProvider,
              public storage: Storage) {
    console.log('Hello LocationServiceProvider Provider');
  }

  startTracking() {

    // Background Tracking

    const config: BackgroundGeolocationConfig = {
      desiredAccuracy: 10,
      stationaryRadius: 20,
      distanceFilter: 20,
      debug: true,
      interval: 2000
    };

    this.backgroundGeolocation.configure(config).subscribe((location) => {
      console.log('Background Geolocation: (' + location.latitude +
        ', ' + location.longitude + ')');

      // Run the update inside of angular's zone
      this.zone.run(() => {
        this.lat = location.latitude;
        this.lng = location.longitude;
        this.send(this.lat, this.lng);  // sends the location to the specified url
      });
    }, (error) => {
      console.log(error);
    });

    // turning ON the background tracking
    this.backgroundGeolocation.start();

    // Foreground Tracking

    const options: GeolocationOptions = {
      enableHighAccuracy: true,
      maximumAge: 2000
    };

    this.watchUserPosition = this.geolocation.watchPosition(options)
      .filter((p: any) => p.code === undefined)
      .subscribe((position: Geoposition) => {
        console.log(position.coords);
        this.zone.run(() => {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
          this.send(this.lat, this.lng);  // sends the location to the specified url
        });
      }, (error) => {
        console.error('Can not run in the zone: ' + error);
      });
  }

  stopTracking() {
    console.log('Stopping tracking');

    this.backgroundGeolocation.finish().then(() => {
      console.log('Successfully stopped background tracking');
    }, (error) => {
      console.error('Background tracking not stopped: ' + error);
    });
    console.log('value of watch: ' + this.watchUserPosition);
    if(this.watchUserPosition) {
      this.watchUserPosition.unsubscribe();
    }
  }

  send(lat, lng) {
    this.geocoder.geocode({'location': {lat: lat, lng: lng}}, (results, status) => {
      // console.log(results);
      if(status == 'OK') {
        this.address = results[0]['formatted_address'];
        this.storage.get('user_id').then((value) => {
          let postData = {
            lat: this.lat,
            lng: this.lng,
            address: this.address,
            id: value
          };
          this.remoteServiceProvider.sendData(postData);
        }, (error) => {
          console.error('error in storage: ' + error);
        });
      }
    });
  }
}
