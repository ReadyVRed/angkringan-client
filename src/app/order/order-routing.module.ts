import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderPage } from './order.page';

const routes: Routes = [
  {
    path: '',
    component: OrderPage
  },
  {
    path: 'add-order',
    loadChildren: () => import('./add-order/add-order.module').then( m => m.AddOrderPageModule)
  },
  {
    path: 'order-produk',
    loadChildren: () => import('./order-produk/order-produk.module').then( m => m.OrderProdukPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderPageRoutingModule {}
