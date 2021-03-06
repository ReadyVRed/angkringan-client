import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { IonicSelectableComponent } from 'ionic-selectable';
import { AppService } from 'src/app/services/app.service';
import { ORDER, ORDER_PRODUK, PRODUK, TRANSAKSI, USER } from 'src/app/services/datatype';
import { SupabaseService } from 'src/app/services/supabase.service';
import { OrderProdukPage } from '../order-produk/order-produk.page';

@Component({
  selector: 'app-add-order',
  templateUrl: './add-order.page.html',
  styleUrls: ['./add-order.page.scss'],
})
export class AddOrderPage implements OnInit {
  @ViewChild('produkSelectable') produkSelectable: IonicSelectableComponent;
  CurrentUser: USER;
  orderForm: FormGroup;
  listProduk: PRODUK[];
  disabledProduk: PRODUK[];
  produkSelected: ORDER_PRODUK[] = [];
  subTotal = { jumlah: 0, total: 0 };
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
    private router: Router,
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
    await this.getProduk();
  }
  async addProduk() {
    const modal = await this.modalController.create({
      component: OrderProdukPage,
      backdropDismiss: true,
      cssClass: 'small-modal'
    });
    await modal.present();
  }
  async getProduk(event?: CustomEvent) {
    this.listProduk = [];
    this.listProduk = await this.supabase.get<PRODUK>('produk', '*', { mitraid: this.CurrentUser.mitraid, status: true }, 'id').toPromise();
  }
  produkChanged(event: {
    component: IonicSelectableComponent,
    value: PRODUK[]
  }) {
    for (let i = 0; i < event.value.length; i++) {
      const produk = event.value[i];
      let temp: ORDER_PRODUK = {
        Produk: produk,
        jumlah: 1,
        stock: produk.stock,
        total: (produk.harga_jual * 1)
      }
      let findIndex = this.produkSelected.findIndex(x => x.Produk.id == produk.id);
      if (findIndex == -1) {
        this.produkSelected.push(temp);
      }
    }
    this.jumlah();
    this.produkSelectable.clear();
    this.disabledProduk = this.produkSelected.map(x => { return x.Produk });
  }
  async add() {
    await this.appService.presentLoading();
    let objNew: ORDER = {
      mitraid: this.CurrentUser.mitraid,
      nama_pembeli: this.orderForm.value.Nama,
      status: 0,
      tanggal: this.appService.convDateToString(new Date(), "yyyy-MM-dd"),
      jam: this.appService.convDateToString(new Date(), "HH:mm:ss"),
      tanggal_selesai: null,
      total: this.subTotal.total,
      user_execute: null,
      user_input: this.CurrentUser.userid
    };
    let orderInsert = await this.supabase.insert('order', objNew).toPromise();
    if (orderInsert.error != null) {
      await this.appService.presentToast(`TERJADI MASALAH KETIKA TAMBAH ORDER`);
      return;
    }
    let transaksi = this.produkSelected.map(x => {
      let trx: TRANSAKSI = {
        harga_jual: x.Produk.harga_jual,
        harga_dasar: x.Produk.harga_dasar,
        jumlah: x.jumlah,
        order_id: orderInsert.body[0].id,
        produkid: x.Produk.id,
        tanggal: this.appService.convDateToString(new Date(), "yyyy-MM-dd"),
        jam: this.appService.convDateToString(new Date(), "HH:mm:ss"),
        total: x.total,
        stock_sebelum: x.stock
      };
      return trx;
    });
    let trxInsert = await this.supabase.insert('transaksi', transaksi, true).toPromise();
    if (trxInsert.error != null) {
      await this.appService.presentToast(`TERJADI MASALAH KETIKA TAMBAH TRANSAKSI`);
      return;
    }
    for (let i = 0; i < trxInsert.body.length; i++) {
      const trx = trxInsert.body[i] as TRANSAKSI;
      let jmlstock = (trx.stock_sebelum - trx.jumlah);
      await this.supabase.update('produk', { stock: jmlstock, status: (jmlstock != 0 ? true : false) }, { id: trx.produkid }).toPromise();
    }
    await this.appService.presentAlert('BERHASIL MENAMBAHKAN ORDER');
    await this.appService.dismissLoading();
    this.modalController.dismiss();
  }
  removeItem(produk: ORDER_PRODUK) {
    for (let [index, p] of this.produkSelected.entries()) {
      if (p.Produk.id === produk.Produk.id) {
        this.produkSelected.splice(index, 1);
      }
    }
    this.jumlah();
    this.disabledProduk = this.produkSelected.map(x => { return x.Produk });
  }
  increaseItem(produk: ORDER_PRODUK) {
    for (let p of this.produkSelected) {
      if (p.Produk.id === produk.Produk.id) {
        p.jumlah += 1;
        p.total = (p.Produk.harga_jual * p.jumlah);
        break;
      }
    }
    this.jumlah();
  }
  decreasItem(produk: ORDER_PRODUK) {
    for (let p of this.produkSelected) {
      if (p.Produk.id === produk.Produk.id) {
        p.jumlah -= 1;
        p.total = (p.Produk.harga_jual * p.jumlah);
        break;
      }
    }
    this.jumlah();
  }
  jumlah() {
    this.subTotal.jumlah = 0;
    this.subTotal.total = 0;
    if (this.produkSelected.length > 0) {
      this.orderForm.controls['Order'].setValue(this.produkSelected);
      for (let i = 0; i < this.produkSelected.length; i++) {
        const produk = this.produkSelected[i];
        this.subTotal.jumlah += produk.jumlah;
        this.subTotal.total += produk.total;
      }
    } else {
      this.orderForm.controls['Order'].setValue(null);
    }
  }
}
