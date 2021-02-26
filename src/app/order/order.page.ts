import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { throwError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, finalize, map } from 'rxjs/operators';
import { AppService } from '../services/app.service';
import { ORDER, TRANSAKSI, USER } from '../services/datatype';
import { SupabaseService } from '../services/supabase.service';
import { AddOrderPage } from './add-order/add-order.page';
import * as datefns from 'date-fns';
import { EditOrderPage } from './edit-order/edit-order.page';
import { CetakStrukPage } from './cetak-struk/cetak-struk.page';
import { BayarOrderPage } from './bayar-order/bayar-order.page';

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})
export class OrderPage implements OnInit {
  public filTanggal;
  CurrentUser = <USER>{};
  listOrder: Observable<ORDER[]>;
  constructor(private appService: AppService,
    private supabase: SupabaseService,
    private modalController: ModalController,
    private router: Router) { }

  async ngOnInit() {
    this.filTanggal = this.appService.convDateToString(new Date(), "yyyy-MM-dd");
    this.CurrentUser = await this.appService.getCurrentUser();
  }
  RefreshContent(event?: CustomEvent) {
    this.getOrder(event);
  }
  async ionViewWillEnter() {
    this.CurrentUser = await this.appService.getCurrentUser();
    this.getOrder();
  }
  getOrder(event?: CustomEvent) {
    let filter = {
      mitraid: this.CurrentUser.mitraid,
      tanggal: this.filTanggal
    };
    this.listOrder = this.supabase.get<ORDER>('order', '*,transaksi(*),mitra(*)', filter, 'jam').pipe(
      map(result => {
        return result;
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
      component: AddOrderPage,
      backdropDismiss: true,
    });
    modal.onDidDismiss().then(async res => {
      this.getOrder();
    });
    await modal.present();
  }
  async edit(data: ORDER) {
    if (data.status == 0) {
      const modal = await this.modalController.create({
        component: EditOrderPage,
        backdropDismiss: true,
        componentProps: {
          data: data
        }
      });
      modal.onDidDismiss().then(async res => {
        this.getOrder();
      });
      await modal.present();
    } else {
      const modal = await this.modalController.create({
        component: CetakStrukPage,
        backdropDismiss: true,
        componentProps: {
          data: data
        }
      });
      await modal.present();
    }
  }
  async setStatus(data: ORDER) {
    const modal = await this.modalController.create({
      component: BayarOrderPage,
      backdropDismiss: true,
      cssClass: 'small-modal',
      componentProps: {
        data: data
      }
    });
    modal.onDidDismiss().then(async res => {
      this.getOrder();
    });
    await modal.present();
    /* let confirm = await this.appService.presentAlertConfirm(`Yakin order '${data.nama_pembeli}' sudah selesai ?`);
    if (!confirm) {
      return;
    }
    await this.appService.presentLoading();
    let obj = {
      status: 1,
      user_execute: this.CurrentUser.userid,
      tanggal_selesai: this.appService.convDateToString(new Date(), "yyyy-MM-dd"),
      jam_selesai: this.appService.convDateToString(new Date(), "HH:mm:ss"),
    }
    this.supabase.update('order', obj, { id: data.id }).subscribe(
      async result => {
        if (result.status == 200 && result.data.length > 0) {
          await this.appService.presentToast(`ORDER '${data.nama_pembeli}' TELAH SELESAI`);
          this.getOrder();
        } else {
          await this.appService.presentToast(`DATA ORDER '${data.nama_pembeli}' GAGAL, SILAHKAN COBA KEMBALI`);
        }
      },
      async err => {
        await this.appService.presentToast("Terjadi masalah, silahkan coba kembali");
        await this.appService.dismissLoading();
      },
      async () => {
        await this.appService.dismissLoading();
      }
    ); */
  }
  async delete(data: ORDER) {
    let confirm = await this.appService.presentAlertConfirm(`Yakin data '${data.nama_pembeli}' akan di delete ?`);
    if (!confirm) {
      return;
    }
    await this.appService.presentLoading();
    let Trx = await this.supabase.get<TRANSAKSI>('transaksi', '*,produk(*)', { order_id: data.id }).toPromise();
    for (let i = 0; i < Trx.length; i++) {
      const trx = Trx[i];
      let jmlstock = (trx.produk.stock + trx.jumlah);
      await this.supabase.update('produk', { stock: jmlstock, status: (jmlstock != 0 ? true : false) }, { id: trx.produkid }).toPromise();
    }
    let deleteTrx = await this.supabase.delete('transaksi', { order_id: data.id }).toPromise();
    if (deleteTrx.error != null) {
      await this.appService.presentToast(`DELETE ORDER '${data.nama_pembeli}' BERHASIL`);
      await this.appService.dismissLoading();
      return;
    }
    this.supabase.delete('order', { id: data.id }).subscribe(
      async result => {
        if (result.status == 200 && result.data.length > 0) {
          await this.appService.presentToast(`DELETE ORDER '${data.nama_pembeli}' BERHASIL`);
          this.getOrder();
        } else {
          await this.appService.presentToast(`DELETE ORDER '${data.nama_pembeli}' GAGAL, SILAHKAN COBA KEMBALI`);
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
  async GantiPass() {

  }
  async Logout() {
    let confirm = await this.appService.presentAlertConfirm('Yakin akan logout ?');
    if (confirm) {
      await this.appService.Logout();
    }
  }
}
