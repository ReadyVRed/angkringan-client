import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AppService } from 'src/app/services/app.service';
import { ORDER, TRANSAKSI, USER } from 'src/app/services/datatype';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-cetak-struk',
  templateUrl: './cetak-struk.page.html',
  styleUrls: ['./cetak-struk.page.scss'],
})
export class CetakStrukPage implements OnInit {
  @Input() data: ORDER;
  CurrentUser = <USER>{};
  transaksi: TRANSAKSI[] = [];

  constructor(private appService: AppService,
    private supabase: SupabaseService,
    public modalController: ModalController) { }

  async ngOnInit() {
    this.CurrentUser = await this.appService.getCurrentUser();
    await this.getTransaksi();
  }

  async getTransaksi() {
    await this.appService.presentLoading();
    this.supabase.get<TRANSAKSI>('transaksi', '*,produk(*)', { order_id: this.data.id }).subscribe(
      async result => {
        this.transaksi = result;
      },
      async err => {
        await this.appService.presentToast("Terjadi masalah, silahkan coba kembali");
        await this.appService.dismissLoading();
      },
      async () => {
        await this.appService.dismissLoading();
      });
  }

  async cetakStruk() {

  }
}
