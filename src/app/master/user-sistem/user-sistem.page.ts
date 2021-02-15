import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { AppService } from 'src/app/services/app.service';
import { USER } from 'src/app/services/datatype';
import { SupabaseService } from 'src/app/services/supabase.service';
import { AddUserPage } from './add-user/add-user.page';

@Component({
  selector: 'app-user-sistem',
  templateUrl: './user-sistem.page.html',
  styleUrls: ['./user-sistem.page.scss'],
})
export class UserSistemPage implements OnInit {
  listUser: Observable<USER[]>;
  CurrentUser: USER;
  constructor(private appService: AppService,
    private supabase: SupabaseService,
    private modalController: ModalController) {
  }

  async ngOnInit() {
    this.CurrentUser = await this.appService.getCurrentUser();
    this.getUser();
  }
  RefreshContent(event?: CustomEvent) {
    this.getUser(event);
  }
  getUser(event?: CustomEvent) {
    this.listUser = this.supabase.get<USER>('user', '*', { mitraid: this.CurrentUser.mitraid }, 'userid').pipe(
      catchError(err => {
        this.appService.presentToast("TERJADI MASALAH, SILAHKAN COBA LAGI").then(() => {
          if (event) {
            event.detail.complete();
          }
        });
        return throwError(err);
      }),
      finalize(async () => {
        if (event) {
          event.detail.complete();
        }
      })
    );
  }
  async add() {
    const modal = await this.modalController.create({
      component: AddUserPage,
      backdropDismiss: true,
      cssClass: 'small-modal',
      componentProps: {
        data: null,
        isEdit: false
      }
    });
    modal.onDidDismiss().then(async res => {
      if (res.data) {
        this.getUser();
      }
    });
    await modal.present();
  }
  async edit(data: USER) {
    const modal = await this.modalController.create({
      component: AddUserPage,
      backdropDismiss: true,
      cssClass: 'small-modal',
      componentProps: {
        data: data,
        isEdit: true
      }
    });
    modal.onDidDismiss().then(async res => {
      if (res.data) {
        this.getUser();
      }
    });
    await modal.present();
  }
  async setAktif(data: USER, status: boolean) {
    let confirm = await this.appService.presentAlertConfirm(`Yakin data '${data.userid}' akan di set ${(status ? 'Aktif' : 'Non-Aktif')} ?`);
    if (!confirm) {
      return;
    }
    await this.appService.presentLoading();
    this.supabase.update('user', { status: status }, { userid: data.userid }).subscribe(
      async result => {
        if (result.status == 200 && result.data.length > 0) {
          await this.appService.presentToast(`UPDATE STATUS '${data.userid}' BERHASIL`);
          this.getUser();
        } else {
          await this.appService.presentToast(`UPDATE STATUS '${data.userid}' GAGAL, SILAHKAN COBA KEMBALI`);
        }
      },
      async err => {
        await this.appService.presentToast("Terjadi masalah, silahkan coba kembali");
        await this.appService.dismissLoading();
      },
      async () => {
        await this.appService.dismissLoading();
      });
  }
  async resetPassword(data: USER) {
    let confirm = await this.appService.presentAlertConfirm(`Yakin password '${data.userid}' akan reset ?`);
    if (!confirm) {
      return;
    }
    await this.appService.presentLoading();
    this.supabase.update('user', { password: this.appService.HashIdEncode(data.mitraid + data.userid + "123456") }, { userid: data.userid }).subscribe(
      async result => {
        if (result.status == 200 && result.data.length > 0) {
          await this.appService.presentToast(`RESET '${data.userid}' BERHASIL`);
          this.getUser();
        } else {
          await this.appService.presentToast(`RESET '${data.userid}' GAGAL, SILAHKAN COBA KEMBALI`);
        }
      },
      async err => {
        await this.appService.presentToast("Terjadi masalah, silahkan coba kembali");
        await this.appService.dismissLoading();
      },
      async () => {
        await this.appService.dismissLoading();
      });
  }
  async delete(data: USER) {
    let confirm = await this.appService.presentAlertConfirm(`Yakin data '${data.userid}' akan di delete ?`);
    if (!confirm) {
      return;
    }
    await this.appService.presentLoading();
    this.supabase.delete('user', { userid: data.userid }).subscribe(
      async result => {
        if (result.status == 200 && result.data.length > 0) {
          await this.appService.presentToast(`DELETE DATA '${data.userid}' BERHASIL`);
          this.getUser();
        } else {
          await this.appService.presentToast(`DELETE DATA '${data.userid}' GAGAL, SILAHKAN COBA KEMBALI`);
        }
      },
      async err => {
        await this.appService.presentToast("Terjadi masalah, silahkan coba kembali");
        await this.appService.dismissLoading();
      },
      async () => {
        await this.appService.dismissLoading();
      }
    );
  }
}
