import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DashboardPageRoutingModule } from './dashboard-routing.module';

import { DashboardPage } from './dashboard.page';
import { EditOrderPageModule } from '../order/edit-order/edit-order.module';
import { CetakStrukPageModule } from '../order/cetak-struk/cetak-struk.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DashboardPageRoutingModule,
    EditOrderPageModule,
    CetakStrukPageModule
  ],
  declarations: [DashboardPage]
})
export class DashboardPageModule {}
