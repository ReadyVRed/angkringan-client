import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderProdukPageRoutingModule } from './order-produk-routing.module';

import { OrderProdukPage } from './order-produk.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrderProdukPageRoutingModule
  ],
  declarations: [OrderProdukPage]
})
export class OrderProdukPageModule {}
