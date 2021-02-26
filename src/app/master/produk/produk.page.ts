import { Component, OnInit } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { AppService } from 'src/app/services/app.service';
import { PRODUK, USER } from 'src/app/services/datatype';
import { SupabaseService } from 'src/app/services/supabase.service';
import { AddProdukPage } from './add-produk/add-produk.page';

@Component({
  selector: 'app-produk',
  templateUrl: './produk.page.html',
  styleUrls: ['./produk.page.scss'],
})
export class ProdukPage implements OnInit {
  listProduk: Observable<any>;
  CurrentUser: USER;
  constructor(private appService: AppService,
    private supabase: SupabaseService,
    private modalController: ModalController,
    private alertController: AlertController) {
  }

  async ngOnInit() {
    this.CurrentUser = await this.appService.getCurrentUser();
    this.getProduk();
  }
  RefreshContent(event?: CustomEvent) {
    this.getProduk(event);
  }
  getProduk(event?: CustomEvent) {
    this.listProduk = this.supabase.get<PRODUK>('produk', '*', { mitraid: this.CurrentUser.mitraid }, 'id').pipe(
      map(result => {
        let filtered = result.reduce((r, a) => {
          r[a.kategori] = r[a.kategori] || [];
          r[a.kategori].push(a);
          return r;
        }, Object.create(null));
        var e = Object.entries(filtered);
        return e;
      }),
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
      component: AddProdukPage,
      backdropDismiss: true,
      componentProps: {
        data: null,
        isEdit: false
      }
    });
    modal.onDidDismiss().then(async res => {
      if (res.data) {
        this.getProduk();
      }
    });
    await modal.present();
  }
  async edit(data: PRODUK) {
    const modal = await this.modalController.create({
      component: AddProdukPage,
      backdropDismiss: true,
      componentProps: {
        data: data,
        isEdit: true
      }
    });
    modal.onDidDismiss().then(async res => {
      if (res.data) {
        this.getProduk();
      }
    });
    await modal.present();
  }
  async setAktif(data: PRODUK, status: boolean) {
    let confirm = await this.appService.presentAlertConfirm(`Yakin data '${data.id}' akan di set ${(status ? 'Aktif' : 'Non-Aktif')} ?`);
    if (!confirm) {
      return;
    }
    await this.appService.presentLoading();
    this.supabase.update('produk', { status: status }, { id: data.id }).subscribe(
      async result => {
        if (result.status == 200 && result.data.length > 0) {
          await this.appService.presentToast(`UPDATE STATUS '${data.nama}' BERHASIL`);
          this.getProduk();
        } else {
          await this.appService.presentToast(`UPDATE STATUS '${data.nama}' GAGAL, SILAHKAN COBA KEMBALI`);
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
  async addStock(data: PRODUK) {
    const inputAlert = await this.alertController.create({
      header: 'Tambah Stock :',
      mode: 'ios',
      inputs: [{ type: 'number', value: data.stock }],
      buttons: [{ text: 'Cancel', role: 'cancel' }, { text: 'Ok', role: 'ok' }]
    });
    await inputAlert.present();
    await inputAlert.onDidDismiss().then(async res => {
      let resData: number = res.data.values[0];
      if (resData && (res.role == 'ok')) {
        await this.appService.presentLoading();
        this.supabase.update('produk', { stock: resData, status: true }, { id: data.id }).subscribe(
          async result => {
            if (result.status == 200 && result.data.length > 0) {
              await this.appService.presentToast(`UPDATE STOCK '${data.nama}' BERHASIL`);
              this.getProduk();
            } else {
              await this.appService.presentToast(`UPDATE STOCK '${data.nama}' GAGAL, SILAHKAN COBA KEMBALI`);
            }
          },
          async err => {
            await this.appService.presentToast("Terjadi masalah, silahkan coba kembali");
            await this.appService.dismissLoading();
          },
          async () => {
            await this.appService.dismissLoading();
          });
      };
    });
  }
  async delete(data: PRODUK) {
    let confirm = await this.appService.presentAlertConfirm(`Yakin data '${data.id}' akan di delete ?`);
    if (!confirm) {
      return;
    }
    await this.appService.presentLoading();
    this.supabase.delete('produk', { id: data.id }).subscribe(
      async result => {
        if (result.status == 200 && result.data.length > 0) {
          await this.appService.presentToast(`DELETE DATA '${data.nama}' BERHASIL`);
          this.getProduk();
        } else {
          await this.appService.presentToast(`DELETE DATA '${data.nama}' GAGAL, SILAHKAN COBA KEMBALI`);
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
