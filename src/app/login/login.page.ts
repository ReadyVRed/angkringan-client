import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AppService } from '../services/app.service';
import { MITRA, USER } from '../services/datatype';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  error_messages = {
    'MitraId': [
      { type: 'required', message: 'Tidak Boleh Kosong' },
      { type: 'minlength', message: 'Range Karakter 2-15' },
      { type: 'maxlength', message: 'Range Karakter 2-15' },
      { type: 'pattern', message: 'Tidak Boleh Menggunakan Karakter Simbol' }
    ],
    'UserId': [
      { type: 'required', message: 'Tidak Boleh Kosong' },
      { type: 'minlength', message: 'Range Karakter 3-15' },
      { type: 'maxlength', message: 'Range Karakter 3-15' },
      { type: 'pattern', message: 'Tidak Boleh Menggunakan Karakter Simbol' }
    ],
    'Password': [
      { type: 'required', message: 'Tidak Boleh Kosong' },
      { type: 'minlength', message: 'Range Karakter 4-15' },
      { type: 'maxlength', message: 'Range Karakter 4-15' },
      { type: 'pattern', message: 'Tidak Boleh Menggunakan Karakter Simbol' }
    ]
  };
  constructor(private appService: AppService,
    private storage: Storage,
    private formBuilder: FormBuilder,
    private supabase: SupabaseService,
    private router: Router) {
    this.loginForm = this.formBuilder.group({
      MitraId: new FormControl('SYSTEM', Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(15),
        Validators.pattern('^[a-zA-Z0-9]*$')
      ])),
      UserId: new FormControl('SYSTEM', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
        Validators.pattern('^[a-zA-Z0-9]*$')
      ])),
      Password: new FormControl('123456', Validators.compose([
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(15),
        Validators.pattern('^[a-zA-Z0-9]*$')
      ]))
    });
  }

  ngOnInit() {
  }
  async Login() {
    if (this.loginForm.invalid) {
      await this.appService.presentToast("Form tidak valid");
      return;
    }
    await this.appService.presentLoading();
    let filter: USER = { mitraid: this.loginForm.value.MitraId, userid: this.loginForm.value.UserId };
    this.supabase.get<USER>('user', '*', filter).subscribe(
      async result => {
        if (result.length > 0) {
          if (result[0].password != (this.appService.HashIdEncode(filter.mitraid + filter.userid + this.loginForm.value.Password))) {
            await this.appService.presentToast("PASSWORD TIDAK SESUAI");
          } else {
            await this.storage.set('DATA-USER', result[0]);
            this.appService.isAuth.next(true);
            this.appService.userData.next(result[0]);
            if (result[0].level == 2) {
              this.router.navigateByUrl('/members/order', { replaceUrl: true });
            } else {
              this.router.navigateByUrl('/members/tab1/dashboard', { replaceUrl: true });
            }
          }
        } else {
          await this.appService.presentToast("USER TIDAK DITEMUKAN");
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
