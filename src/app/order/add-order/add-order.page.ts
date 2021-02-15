import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AppService } from 'src/app/services/app.service';
import { ORDER, USER } from 'src/app/services/datatype';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.page.html',
  styleUrls: ['./add-order.page.scss'],
})
export class AddOrderPage implements OnInit {
  CurrentUser: USER;
  orderForm: FormGroup;
  error_messages = {
    'Nama': [
      { type: 'required', message: 'Tidak Boleh Kosong' },
      { type: 'minlength', message: 'Range Karakter 3-30' },
      { type: 'maxlength', message: 'Range Karakter 3-30' },
      { type: 'pattern', message: 'Tidak Boleh Menggunakan Karakter Simbol' }
    ],
    'Order': [
      { type: 'required', message: 'Tidak Boleh Kosong' }
    ]
  };
  constructor(private appService: AppService,
    private supabase: SupabaseService,
    private formBuilder: FormBuilder,
    public modalController: ModalController) {
    this.orderForm = this.formBuilder.group({
      Nama: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30),
        Validators.pattern('^[a-zA-Z0-9 ]*$')
      ])),
      Order: new FormControl('', Validators.compose([
        Validators.required
      ]))
    });
  }

  async ngOnInit() {
    this.CurrentUser = await this.appService.getCurrentUser();
  }
  async add() {
    await this.appService.presentLoading();
    let objNew = <ORDER>{};
    this.supabase.insert('user', objNew).subscribe(
      async result => {
        if (result.status == 201 && result.data.length > 0) {
          await this.appService.presentToast(`TAMBAH DATA ORDER '${objNew.nama_pembeli}' BERHASIL`);
          await this.modalController.dismiss(true);
        } else {
          await this.appService.presentToast(`TAMBAH DATA ORDER '${objNew.nama_pembeli}' GAGAL, SILAHKAN COBA KEMBALI`);
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
