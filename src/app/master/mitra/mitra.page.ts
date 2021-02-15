import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { AppService } from 'src/app/services/app.service';
import { MITRA, USER } from 'src/app/services/datatype';
import { SupabaseService } from 'src/app/services/supabase.service';
import { AddMitraPage } from './add-mitra/add-mitra.page';

@Component({
  selector: 'app-mitra',
  templateUrl: './mitra.page.html',
  styleUrls: ['./mitra.page.scss'],
})
export class MitraPage implements OnInit {
  listMitra: Observable<MITRA[]>;
  CurrentUser: USER;
  constructor(private appService: AppService,
    private supabase: SupabaseService,
    private modalController: ModalController) {
  }

  async ngOnInit() {
    this.CurrentUser = await this.appService.getCurrentUser();
    this.getMitra();
  }
  RefreshContent(event?: CustomEvent) {
    this.getMitra(event);
  }
  getMitra(event?: CustomEvent) {
    this.listMitra = this.supabase.get<MITRA>('mitra', '*', null, 'mitraid').pipe(
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
      component: AddMitraPage,
      backdropDismiss: true,
      cssClass: 'small-modal',
      componentProps: {
        data: null,
        isEdit: false
      }
    });
    modal.onDidDismiss().then(async res => {
      if (res.data) {
        this.getMitra();
      }
    });
    await modal.present();
  }
  async edit(data: MITRA) {
    const modal = await this.modalController.create({
      component: AddMitraPage,
      backdropDismiss: true,
      cssClass: 'small-modal',
      componentProps: {
        data: data,
        isEdit: true
      }
    });
    modal.onDidDismiss().then(async res => {
      if (res.data) {
        this.getMitra();
      }
    });
    await modal.present();
  }
  async setAktif(data: MITRA, status: boolean) {
    let confirm = await this.appService.presentAlertConfirm(`Yakin data '${data.mitraid}' akan di set ${(status ? 'Aktif' : 'Non-Aktif')} ?`);
    if (!confirm) {
      return;
    }
    await this.appService.presentLoading();
    this.supabase.update('mitra', { status: status }, { mitraid: data.mitraid }).subscribe(
      async result => {
        if (result.status == 200 && result.data.length > 0) {
          await this.appService.presentToast(`UPDATE STATUS '${data.mitraid}' BERHASIL`);
          this.getMitra();
        } else {
          await this.appService.presentToast(`UPDATE STATUS '${data.mitraid}' GAGAL, SILAHKAN COBA KEMBALI`);
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
  async delete(data: MITRA) {
    let confirm = await this.appService.presentAlertConfirm(`Yakin data '${data.mitraid}' akan di delete ?`);
    if (!confirm) {
      return;
    }
    await this.appService.presentLoading();
    this.supabase.delete('mitra', { mitraid: data.mitraid }).subscribe(
      async result => {
        if (result.status == 200 && result.data.length > 0) {
          await this.appService.presentToast(`DELETE DATA '${data.mitraid}' BERHASIL`);
          this.getMitra();
        } else {
          await this.appService.presentToast(`DELETE DATA '${data.mitraid}' GAGAL, SILAHKAN COBA KEMBALI`);
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
