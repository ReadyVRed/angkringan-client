import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BayarOrderPageRoutingModule } from './bayar-order-routing.module';

import { BayarOrderPage } from './bayar-order.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BayarOrderPageRoutingModule
  ],
  declarations: [BayarOrderPage]
})
export class BayarOrderPageModule {}
