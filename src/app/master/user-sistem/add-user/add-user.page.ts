import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AppService } from 'src/app/services/app.service';
import { USER } from 'src/app/services/datatype';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.page.html',
  styleUrls: ['./add-user.page.scss'],
})
export class AddUserPage implements OnInit {

  @Input() data: USER;
  @Input() isEdit: boolean;
  userForm: FormGroup;
  CurrentUser: USER;

  error_messages = {
    'UserId': [
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
    'Level': [
      { type: 'required', message: 'Tidak Boleh Kosong' },
      { type: 'minlength', message: 'Range Karakter 1-50' },
      { type: 'maxlength', message: 'Range Karakter 1-50' },
      { type: 'pattern', message: 'Tidak Boleh Menggunakan Karakter Simbol' }
    ]
  };
  constructor(private appService: AppService,
    private supabase: SupabaseService,
    private formBuilder: FormBuilder,
    public modalController: ModalController) {
    this.userForm = this.formBuilder.group({
      UserId: new FormControl('', Validators.compose([
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
      Level: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50)
      ]))
    });
  }

  async ngOnInit() {
    this.CurrentUser = await this.appService.getCurrentUser();
    if (this.isEdit) {
      this.userForm.controls['UserId'].setValue(this.data.userid);
      this.userForm.controls['UserId'].disable();
      this.userForm.controls['Nama'].setValue(this.data.nama);
      this.userForm.controls['Level'].setValue(this.data.level);
      this.userForm.updateValueAndValidity();
    }
  }
  async add() {
    await this.appService.presentLoading();
    let objNew: USER = {
      level: this.userForm.controls['Level'].value,
      userid: this.userForm.controls['UserId'].value,
      nama: this.userForm.controls['Nama'].value,
      mitraid: this.CurrentUser.mitraid,
      status: true
    }
    objNew.password = this.appService.HashIdEncode(`${objNew.mitraid + objNew.userid}123456`);
    this.supabase.insert('user', objNew).subscribe(
      async result => {
        if (result.status == 201 && result.data.length > 0) {
          await this.appService.presentToast(`TAMBAH DATA '${objNew.userid}' BERHASIL`);
          await this.modalController.dismiss(true);
        } else {
          await this.appService.presentToast(`TAMBAH DATA '${objNew.userid}' GAGAL, SILAHKAN COBA KEMBALI`);
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
    let objNew: USER = {
      level: this.userForm.controls['Level'].value,
      nama: this.userForm.controls['Nama'].value
    }
    this.supabase.update('user', objNew, { userid: this.data.userid, mitraid: this.data.mitraid }).subscribe(
      async result => {
        if (result.status == 200 && result.data.length > 0) {
          await this.appService.presentToast(`EDIT DATA '${objNew.userid}' BERHASIL`);
          await this.modalController.dismiss(true);
        } else {
          await this.appService.presentToast(`EDIT DATA '${objNew.userid}' GAGAL, SILAHKAN COBA KEMBALI`);
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
