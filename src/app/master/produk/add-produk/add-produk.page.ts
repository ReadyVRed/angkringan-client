import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { AlertController, IonSelect, ModalController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { AppService } from 'src/app/services/app.service';
import { PRODUK, USER } from 'src/app/services/datatype';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-add-produk',
  templateUrl: './add-produk.page.html',
  styleUrls: ['./add-produk.page.scss'],
})
export class AddProdukPage implements OnInit {
  @Input() data: PRODUK;
  @Input() isEdit: boolean;
  produkForm: FormGroup;
  CurrentUser: USER;
  listKategori: any[];
  error_messages = {
    'Nama': [
      { type: 'required', message: 'Tidak Boleh Kosong' },
      { type: 'minlength', message: 'Range Karakter 3-30' },
      { type: 'maxlength', message: 'Range Karakter 3-30' },
      { type: 'pattern', message: 'Tidak Boleh Menggunakan Karakter Simbol' }
    ],
    'NamaStruk': [
      { type: 'required', message: 'Tidak Boleh Kosong' },
      { type: 'minlength', message: 'Range Karakter 3-15' },
      { type: 'maxlength', message: 'Range Karakter 3-15' },
      { type: 'pattern', message: 'Tidak Boleh Menggunakan Karakter Simbol' }
    ],
    'Kategori': [
      { type: 'required', message: 'Tidak Boleh Kosong' },
      { type: 'minlength', message: 'Range Karakter 3-12' },
      { type: 'maxlength', message: 'Range Karakter 3-12' },
      { type: 'pattern', message: 'Tidak Boleh Menggunakan Karakter Simbol' }
    ],
    'Stock': [
      { type: 'required', message: 'Tidak Boleh Kosong' }
    ],
    'HargaJual': [
      { type: 'required', message: 'Tidak Boleh Kosong' }
    ],
    'HargaDasar': [
      { type: 'required', message: 'Tidak Boleh Kosong' }
    ]
  };
  constructor(private appService: AppService,
    private supabase: SupabaseService,
    private formBuilder: FormBuilder,
    public modalController: ModalController,
    private alertController: AlertController) {
    this.produkForm = this.formBuilder.group({
      Nama: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30),
        Validators.pattern('^[a-zA-Z0-9 ]*$')
      ])),
      Stock: new FormControl('', Validators.compose([
        Validators.required
      ])),
      HargaDasar: new FormControl('', Validators.compose([
        Validators.required
      ])),
      HargaJual: new FormControl('', Validators.compose([
        Validators.required
      ])),
      Kategori: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30),
        Validators.pattern('^[a-zA-Z0-9 ]*$')
      ])),
      NamaStruk: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
        Validators.pattern('^[a-zA-Z0-9 ]*$')
      ])),
    });
  }

  async ngOnInit() {
    this.CurrentUser = await this.appService.getCurrentUser();
    this.listKategori = [];
    await this.getKategori();
    if (this.isEdit) {
      this.produkForm.controls['Nama'].setValue(this.data.nama);
      this.produkForm.controls['Stock'].setValue(this.data.stock);
      this.produkForm.controls['HargaJual'].setValue(this.data.harga_jual);
      this.produkForm.controls['HargaDasar'].setValue(this.data.harga_dasar);
      this.produkForm.controls['Kategori'].setValue(this.data.kategori);
      this.produkForm.controls['NamaStruk'].setValue(this.data.nama_struk);
      this.produkForm.updateValueAndValidity();
    }
  }
  async getKategori() {
    await this.supabase.get<any>('produk', 'kategori', { mitraid: this.CurrentUser.mitraid }).pipe(
      map(result => {
        if (result.length > 0) {
          this.listKategori = result.filter((v, i, a) => a.findIndex(t => (t.kategori === v.kategori)) === i);
        }
      }
      )).toPromise();
  }
  async kategoriChanged(event: CustomEvent) {
    let value = event.detail.value;
    if (value != "custom") {
      this.produkForm.controls['Kategori'].setValue(value);
      this.produkForm.updateValueAndValidity();
    } else {
      await this.inputCustomColorValue();
    }
  }
  async inputCustomColorValue() {
    const inputAlert = await this.alertController.create({
      header: 'Tambah Kategori :',
      mode: 'ios',
      inputs: [{ type: 'text' }],
      buttons: [{ text: 'Cancel' }, { text: 'Ok' }]
    });
    await inputAlert.present();
    await inputAlert.onDidDismiss().then(data => {
      let customColorName: string = data.data.values[0];
      if (customColorName) {
        let indexFound = this.listKategori.findIndex(color => color === customColorName)
        if (indexFound === -1) {
          this.listKategori.push({ kategori: customColorName });
          this.produkForm.controls['Kategori'].setValue(customColorName);
          this.produkForm.updateValueAndValidity();
        } else {
          this.produkForm.controls['Kategori'].setValue(this.listKategori[indexFound]);
          this.produkForm.updateValueAndValidity();
        };
      };
    });
  };

  async add() {
    await this.appService.presentLoading();
    let objNew: PRODUK = {
      nama: this.produkForm.controls['Nama'].value,
      stock: this.produkForm.controls['Stock'].value,
      harga_jual: this.produkForm.controls['HargaJual'].value,
      harga_dasar: this.produkForm.controls['HargaDasar'].value,
      kategori: this.produkForm.controls['Kategori'].value,
      nama_struk: this.produkForm.controls['NamaStruk'].value,
      status: true,
      user_update: this.CurrentUser.userid,
      mitraid: this.CurrentUser.mitraid
    }
    this.supabase.insert('produk', objNew).subscribe(
      async result => {
        if (result.status == 201 && result.data.length > 0) {
          await this.appService.presentToast(`TAMBAH DATA '${objNew.nama}' BERHASIL`);
          await this.modalController.dismiss(true);
        } else {
          await this.appService.presentToast(`TAMBAH DATA '${objNew.nama}' GAGAL, SILAHKAN COBA KEMBALI`);
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
  async edit() {
    await this.appService.presentLoading();
    let objNew: PRODUK = {
      nama: this.produkForm.controls['Nama'].value,
      stock: this.produkForm.controls['Stock'].value,
      harga_jual: this.produkForm.controls['HargaJual'].value,
      harga_dasar: this.produkForm.controls['HargaDasar'].value,
      kategori: this.produkForm.controls['Kategori'].value,
      nama_struk: this.produkForm.controls['NamaStruk'].value,
      user_update: this.CurrentUser.userid,
      last_update: new Date()
    }
    this.supabase.update('produk', objNew, { id: this.data.id }).subscribe(
      async result => {
        if (result.status == 200 && result.data.length > 0) {
          await this.appService.presentToast(`EDIT DATA '${objNew.nama}' BERHASIL`);
          await this.modalController.dismiss(true);
        } else {
          await this.appService.presentToast(`EDIT DATA '${objNew.nama}' GAGAL, SILAHKAN COBA KEMBALI`);
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
