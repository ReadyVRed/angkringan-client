import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { throwError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, finalize, map } from 'rxjs/operators';
import { AppService } from '../services/app.service';
import { ORDER, TRANSAKSI, USER } from '../services/datatype';
import { SupabaseService } from '../services/supabase.service';
import { AddOrderPage } from './add-order/add-order.page';

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})
export class OrderPage implements OnInit {
  CurrentUser = <USER>{};
  listOrder: Observable<ORDER[]>;
  constructor(private appService: AppService,
    private supabase: SupabaseService,
    private modalController: ModalController) { }

  async ngOnInit() {
    this.CurrentUser = await this.appService.getCurrentUser();
    this.getOrder();
  }
  RefreshContent(event?: CustomEvent) {
    this.getOrder(event);
  }
  getOrder(event?: CustomEvent) {
    this.listOrder = this.supabase.get<ORDER>('order', '*,transaksi(*)', { mitraid: this.CurrentUser.mitraid }).pipe(
      map(result => {
        console.log(result);
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
      cssClass: 'small-modal',
      componentProps: {
        data: null,
        isEdit: false
      }
    });
    modal.onDidDismiss().then(async res => {
      if (res.data) {
        this.getOrder();
      }
    });
    await modal.present();
  }
  async edit(data: ORDER) {
    const modal = await this.modalController.create({
      component: AddOrderPage,
      backdropDismiss: true,
      cssClass: 'small-modal',
      componentProps: {
        data: data,
        isEdit: true
      }
    });
    modal.onDidDismiss().then(async res => {
      if (res.data) {
        this.getOrder();
      }
    });
    await modal.present();
  }
  async setStatus(data: ORDER) {
    const modal = await this.modalController.create({
      component: AddOrderPage,
      backdropDismiss: true,
      cssClass: 'small-modal',
      componentProps: {
        data: data,
        isEdit: true
      }
    });
    modal.onDidDismiss().then(async res => {
      if (res.data) {
        this.getOrder();
      }
    });
    await modal.present();
  }
  async delete(data: ORDER) {
    let confirm = await this.appService.presentAlertConfirm(`Yakin data '${data.nama_pembeli}' akan di delete ?`);
    if (!confirm) {
      return;
    }
    await this.appService.presentLoading();
    this.supabase.delete('order', { id: data.id }).subscribe(
      async result => {
        if (result.status == 200 && result.data.length > 0) {
          await this.appService.presentToast(`DELETE DATA '${data.nama_pembeli}' BERHASIL`);
          this.getOrder();
        } else {
          await this.appService.presentToast(`DELETE DATA '${data.nama_pembeli}' GAGAL, SILAHKAN COBA KEMBALI`);
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
