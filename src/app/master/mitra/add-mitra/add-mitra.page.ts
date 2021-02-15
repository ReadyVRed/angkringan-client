import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AppService } from 'src/app/services/app.service';
import { MITRA, USER } from 'src/app/services/datatype';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-add-mitra',
  templateUrl: './add-mitra.page.html',
  styleUrls: ['./add-mitra.page.scss'],
})
export class AddMitraPage implements OnInit {
  @Input() data: MITRA;
  @Input() isEdit: boolean;
  mitraForm: FormGroup;
  CurrentUser: USER;

  error_messages = {
    'KodeToko': [
      { type: 'required', message: 'Tidak Boleh Kosong' },
      { type: 'minlength', message: 'Range Karakter 3-12' },
      { type: 'maxlength', message: 'Range Karakter 3-12' },
      { type: 'pattern', message: 'Tidak Boleh Menggunakan Karakter Simbol' }
    ],
    'Nama': [
      { type: 'required', message: 'Tidak Boleh Kosong' },
      { type: 'minlength', message: 'Range Karakter 3-30' },
      { type: 'maxlength', message: 'Range Karakter 3-30' },
      { type: 'pattern', message: 'Tidak Boleh Menggunakan Karakter Simbol' }
    ],
    'Alamat': [
      { type: 'required', message: 'Tidak Boleh Kosong' },
      { type: 'minlength', message: 'Range Karakter 3-50' },
      { type: 'maxlength', message: 'Range Karakter 3-50' },
      { type: 'pattern', message: 'Tidak Boleh Menggunakan Karakter Simbol' }
    ]
  };
  constructor(private appService: AppService,
    private supabase: SupabaseService,
    private formBuilder: FormBuilder,
    public modalController: ModalController) {
    this.mitraForm = this.formBuilder.group({
      KodeToko: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(12),
        Validators.pattern('^[a-zA-Z0-9]*$')
      ])),
      Nama: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30),
        Validators.pattern('^[a-zA-Z0-9 ]*$')
      ])),
      Alamat: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ]))
    });
  }

  ngOnInit() {
    if (this.isEdit) {
      this.mitraForm.controls['KodeToko'].setValue(this.data.mitraid);
      this.mitraForm.controls['KodeToko'].disable();
      this.mitraForm.controls['Nama'].setValue(this.data.nama);
      this.mitraForm.controls['Alamat'].setValue(this.data.alamat);
      this.mitraForm.updateValueAndValidity();
    }
  }
  async add() {
    await this.appService.presentLoading();
    let objNew: MITRA = {
      alamat: this.mitraForm.controls['Alamat'].value,
      mitraid: this.mitraForm.controls['KodeToko'].value,
      nama: this.mitraForm.controls['Nama'].value,
      status: true
    }
    this.supabase.insert('mitra', objNew).subscribe(
      async result => {
        if (result.status == 201 && result.data.length > 0) {
          let objNew1: USER = {
            level: 1,
            userid: this.mitraForm.controls['KodeToko'].value,
            nama: this.mitraForm.controls['Nama'].value,
            mitraid: this.mitraForm.controls['KodeToko'].value,
            status: true
          }
          objNew1.password = this.appService.HashIdEncode(`${objNew.mitraid + objNew.mitraid}123456`);
          this.supabase.insert('user', objNew1).subscribe(
            async result => {
              if (result.status == 201 && result.data.length > 0) {
              } else {
                await this.appService.presentToast(`Terjadi masalah, saat menambah user`);
              }
            },
            async err => {
              await this.appService.presentToast("Terjadi masalah, saat menambah user");
              await this.appService.dismissLoading();
            },
            async () => {
              await this.appService.dismissLoading();
            }
          );
          await this.appService.presentToast(`TAMBAH DATA '${objNew.mitraid}' BERHASIL`);
          await this.modalController.dismiss(true);
        } else {
          await this.appService.presentToast(`TAMBAH DATA '${objNew.mitraid}' GAGAL, SILAHKAN COBA KEMBALI`);
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
    let objNew: MITRA = {
      alamat: this.mitraForm.controls['Alamat'].value,
      nama: this.mitraForm.controls['Nama'].value
    }
    this.supabase.update('mitra', objNew, { mitraid: this.data.mitraid }).subscribe(
      async result => {
        if (result.status == 200 && result.data.length > 0) {
          await this.appService.presentToast(`EDIT DATA '${objNew.mitraid}' BERHASIL`);
          await this.modalController.dismiss(true);
        } else {
          await this.appService.presentToast(`EDIT DATA '${objNew.mitraid}' GAGAL, SILAHKAN COBA KEMBALI`);
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
