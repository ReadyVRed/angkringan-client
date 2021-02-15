import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderProdukPage } from './order-produk.page';

const routes: Routes = [
  {
    path: '',
    component: OrderProdukPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderProdukPageRoutingModule {}
