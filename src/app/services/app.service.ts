import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { BehaviorSubject } from 'rxjs';
import { USER } from './datatype';
import * as datefns from 'date-fns';
const Hashids = require('hashids/cjs');


const KeysEnc = "4d4ng4p1Client";
@Injectable({
  providedIn: 'root'
})
export class AppService {
  isAuth: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  userData: BehaviorSubject<USER> = new BehaviorSubject<USER>(null);
  constructor(private alertController: AlertController,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private router: Router,
    private storage: Storage) { this.loadToken(); }

  async loadToken() {
    const token = await this.storage.get("DATA-USER");
    if (token) {
      this.isAuth.next(true);
    } else {
      this.isAuth.next(false);
    }
  }
  async getCurrentUser() {
    return this.userData.value;
  }
  async Logout() {
    await this.storage.clear().then(d => {
      this.isAuth.next(false);
      this.userData.next(null);
      this.router.navigateByUrl('/login');
    })
  }
  async presentAlert(msg: string) {
    await this.alertController.getTop().then(async alert => {
      if (alert) {
        await this.alertController.dismiss();
      }
    });
    const alert = await this.alertController.create({
      header: 'Alert !',
      message: msg,
      mode: 'ios',
      backdropDismiss: false,
      buttons: ['OK']
    });
    await alert.present();
  }
  async presentAlertConfirm(msg: string) {
    let choice: any;
    await this.alertController.getTop().then(async alert => {
      if (alert) {
        await this.alertController.dismiss();
      }
    });
    const alert = await this.alertController.create({
      header: 'Confirm !',
      message: msg,
      mode: 'ios',
      buttons: [{
        text: 'Cancel',
        handler: () => {
          alert.dismiss(false);
          return false;
        }
      }, {
        text: "Ok",
        handler: () => {
          alert.dismiss(true);
          return false;
        }
      }]
    });
    await alert.present();
    await alert.onDidDismiss().then((data) => {
      choice = data;
    })
    return choice.data;
  }
  async presentToast(msg: string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      buttons: [
        { text: "Close", role: 'close' }
      ]
    });
    await toast.present();
  }
  async presentLoading() {
    await this.dismissLoading();
    const loading = await this.loadingController.create({
      message: 'Mohon Tunggu !',
      spinner: 'bubbles',
      mode: "ios",
      backdropDismiss: false
    });
    await loading.present();
  }
  async dismissLoading() {
    await this.loadingController.getTop().then(async loading => {
      if (loading) {
        await this.loadingController.dismiss();
      }
    });
  }
  convDateToString(date: Date, format: string = "dd/MM/yyyy") {
    return datefns.format(new Date(date), format);
  }
  convStringToDate(date: string, format: string = "dd/MM/yyyy") {
    return datefns.parse(date, format, new Date());
  }
  convStringDateToString(date: string, format: string = "dd/MM/yyyy", format1: string = "dd/MM/yyyy") {
    let ds = this.convStringToDate(date, format);
    let sd = this.convDateToString(ds, format1);
    return sd;
  }
  public HashIdDecode(str: string): string {
    const hashids = new Hashids(KeysEnc);
    const id = hashids.decode(str);
    const intBytes = this.getString(id);
    return intBytes
  }
  public HashIdEncode(str: string): string {
    const intBytes = this.getBytes(str);
    const hashids = new Hashids(KeysEnc);
    const id = hashids.encode(intBytes);
    return id;
  }
  private getBytes(stringValue: string) {
    var bytes = [];
    for (var i = 0; i < stringValue.length; ++i) {
      bytes.push(stringValue.charCodeAt(i));
    }
    return bytes;
  }
  private getString(utftext: string | any[]) {
    var result = "";
    for (var i = 0; i < utftext.length; i++) {
      result += String.fromCharCode(parseInt(utftext[i], 10));
    }
    return result;
  }
}
