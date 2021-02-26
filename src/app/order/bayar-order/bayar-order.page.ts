import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AppService } from 'src/app/services/app.service';
import { ORDER, USER } from 'src/app/services/datatype';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-bayar-order',
  templateUrl: './bayar-order.page.html',
  styleUrls: ['./bayar-order.page.scss'],
})
export class BayarOrderPage implements OnInit {
  @Input() data: ORDER;
  CurrentUser = <USER>{};
  jmlBayar = 0;
  constructor(public modalController: ModalController,
    private appService: AppService,
    private supabase: SupabaseService) { }

  async ngOnInit() {
    this.CurrentUser = await this.appService.getCurrentUser();
  }
  async bayar() {
    await this.appService.presentLoading();
    let obj = {
      status: 1,
      user_execute: this.CurrentUser.userid,
      tanggal_selesai: this.appService.convDateToString(new Date(), "yyyy-MM-dd"),
      jam_selesai: this.appService.convDateToString(new Date(), "HH:mm:ss"),
      bayar: this.jmlBayar,
      kembalian: (this.jmlBayar - this.data.total)
    }
    this.supabase.update('order', obj, { id: this.data.id }).subscribe(
      async result => {
        if (result.status == 200 && result.data.length > 0) {
          this.modalController.dismiss();
        } else {
          await this.appService.presentToast("Terjadi masalah, silahkan coba kembali");
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
}
