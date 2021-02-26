import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable, throwError } from 'rxjs';
import { map, catchError, finalize } from 'rxjs/operators';
import { CetakStrukPage } from '../order/cetak-struk/cetak-struk.page';
import { EditOrderPage } from '../order/edit-order/edit-order.page';
import { AppService } from '../services/app.service';
import { USER, ORDER, MITRA } from '../services/datatype';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {
  CurrentUser = <USER>{};
  Mitra = <MITRA>{};
  listOrder: Observable<ORDER[]>;
  constructor(private appService: AppService,
    private supabase: SupabaseService,
    private modalController: ModalController) { }

  async ngOnInit() {
    this.CurrentUser = await this.appService.getCurrentUser();
    await this.getMitra();
    this.getOrder();
  }
  ionViewWillEnter() {
    this.getOrder();
  }
  RefreshContent(event?: CustomEvent) {
    this.getOrder(event);
  }
  async getMitra() {
    this.Mitra = (await this.supabase.get<MITRA>('mitra', '*', { mitraid: this.CurrentUser.mitraid }).toPromise())[0];
  }
  getOrder(event?: CustomEvent) {
    let filter = {
      mitraid: this.CurrentUser.mitraid,
      tanggal: this.appService.convDateToString(new Date(), "yyyy-MM-dd")
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
  getTotal(data: ORDER[]) {
    return data.reduce((a, b) => { return a + b.total }, 0);
  }
  getPendapatan(data: ORDER[]) {
    let hargaJual = data.reduce((a, b) => { return a + b.transaksi.reduce((x, y) => { return x + y.harga_jual }, 0) }, 0);
    let hargaDasar = data.reduce((a, b) => { return a + b.transaksi.reduce((x, y) => { return x + y.harga_dasar }, 0) }, 0);
    return (hargaJual - hargaDasar);
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
      modal.onDidDismiss().then(async res => {
        this.getOrder();
      });
      await modal.present();
    }
  }
}
