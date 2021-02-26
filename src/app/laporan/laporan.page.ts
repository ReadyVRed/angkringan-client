import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Observable, throwError } from 'rxjs';
import { map, catchError, finalize } from 'rxjs/operators';
import { AppService } from '../services/app.service';
import { LAPORAN_PERPRODUK, LAPORAN_PERTANGGAL, ORDER, TRANSAKSI, USER } from '../services/datatype';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-laporan',
  templateUrl: './laporan.page.html',
  styleUrls: ['./laporan.page.scss'],
})
export class LaporanPage implements OnInit {
  CurrentUser = <USER>{};
  jenisLaporan: string = "tanggal";
  Tanggal1: any;
  Tanggal2: any;
  listTransaksi: Observable<TRANSAKSI[]>;
  listLpTanggal: Observable<LAPORAN_PERTANGGAL[]>;
  listLpProduk: Observable<TRANSAKSI[]>;
  listOrder: Observable<ORDER[]>;
  constructor(public appService: AppService,
    private supabase: SupabaseService,
    private modalController: ModalController) { }

  async ngOnInit() {
    this.CurrentUser = await this.appService.getCurrentUser();
    this.Tanggal1 = this.appService.convDateToString(new Date(), "yyyy-MM-dd");
    this.Tanggal2 = this.appService.convDateToString(new Date(), "yyyy-MM-dd");
    this.RefreshContent();
  }
  RefreshContent(event?: CustomEvent) {
    if (this.jenisLaporan == "tanggal") {
      this.getPerTanggal(event);
    } else if (this.jenisLaporan == "produk") {
      this.getPerProduk(event);
    } else if (this.jenisLaporan == '') {
      this.appService.presentToast('Pilih Jenis Laporan !');
    }
  }
  jenisLaporanChanged(event: CustomEvent) {
    if (this.jenisLaporan == "tanggal") {
      this.getPerTanggal();
    } else if (this.jenisLaporan == "produk") {
      this.getPerProduk();
    }
  }
  getPerTanggal(event?: CustomEvent) {
    let filter = {
      mitraid: this.CurrentUser.mitraid,
      status: 1
    };
    this.listLpTanggal = this.supabase.getLaporan<ORDER>('order', '*,transaksi(*,produk(*)),mitra(*)', filter, 'jam',
      { column: 'tanggal', value: this.Tanggal1 }, { column: 'tanggal', value: this.Tanggal2 }).pipe(
        map(result => {
          let order = result.map(x => {
            let lpTgl: LAPORAN_PERTANGGAL = {
              jumlah: x.transaksi.reduce((a, b) => { return a + b.jumlah }, 0),
              total: x.transaksi.reduce((a, b) => { return a + b.total }, 0),
              tanggal: this.appService.convStringDateToString(x.tanggal, "yyyy-MM-dd", "dd/MM/yyyy")
            }
            let hargaDasar = x.transaksi.reduce((a, b) => { return a + b.harga_dasar }, 0);
            let hargaJual = x.transaksi.reduce((a, b) => { return a + b.harga_jual }, 0);
            lpTgl.pendapatan = (hargaJual - hargaDasar);
            return lpTgl;
          });
          let res = order.reduce((a, b) => {
            if (b.tanggal in a) {
              a[b.tanggal].total += b.total;
              a[b.tanggal].jumlah += b.jumlah;
              a[b.tanggal].pendapatan += b.pendapatan;
            } else {
              a[b.tanggal] = b;
            }
            return a;
          }, {});
          let res1 = Object.keys(res).map(id => res[id]);
          return res1;
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
  getPerProduk(event?: CustomEvent) {
    let filter = {
      mitraid: this.CurrentUser.mitraid,
      status: 1
    };
    this.listLpProduk = this.supabase.getLaporan<ORDER>('order', '*,transaksi(*,produk(*)),mitra(*)', filter, 'jam',
      { column: 'tanggal', value: this.Tanggal1 }, { column: 'tanggal', value: this.Tanggal2 }).pipe(
        map(result => {
          let pertgl = result.map(x => {
            return x.transaksi.map(s => s);
          });
          let pertgl2 = pertgl.reduce((a, b) => { return a.concat(...b) }, []);
          let res = pertgl2.reduce((a, b) => {
            if (b.produkid in a) {
              a[b.produkid].total += b.total;
              a[b.produkid].jumlah += b.jumlah;
              a[b.produkid].harga_jual += b.harga_jual;
              a[b.produkid].harga_dasar += b.harga_dasar;
            } else {
              a[b.produkid] = b;
            }
            return a;
          }, {});
          let res1 = Object.keys(res).map(id => res[id]);
          return res1;
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
  getTransaksi(event?: CustomEvent) {
    let filter = {
      mitraid: this.CurrentUser.mitraid,
      tanggal: this.appService.convDateToString(new Date(), "yyyy-MM-dd")
    };
    this.listTransaksi = this.supabase.get<TRANSAKSI>('transaksi', '*,order(*)', filter, 'jam').pipe(
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
  getTotal(array: any[]) {
    return array.reduce((a, b) => { return a + b.total }, 0);
  }
  getJumlah(array: any[]) {
    return array.reduce((a, b) => { return a + b.jumlah }, 0);
  }
  getPendapatan(array: any[]) {
    return array.reduce((a, b) => { return a + b.pendapatan }, 0);
  }
  getPendapatanProduk(array: any[]) {
    return array.reduce((a, b) => { return a + (b.harga_jual - b.harga_dasar) }, 0);
  }
}
