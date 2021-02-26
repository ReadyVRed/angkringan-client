import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OrderPageRoutingModule } from './order-routing.module';

import { OrderPage } from './order.page';
import { IonicSelectableModule } from 'ionic-selectable';
import { EditOrderPageModule } from './edit-order/edit-order.module';
import { CetakStrukPageModule } from './cetak-struk/cetak-struk.module';
import { BayarOrderPageModule } from './bayar-order/bayar-order.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrderPageRoutingModule,
    ReactiveFormsModule,
    IonicSelectableModule,
    EditOrderPageModule,
    CetakStrukPageModule,
    BayarOrderPageModule
  ],
  declarations: [OrderPage]
})
export class OrderPageModule {}
