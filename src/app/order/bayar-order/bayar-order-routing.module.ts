import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BayarOrderPage } from './bayar-order.page';

const routes: Routes = [
  {
    path: '',
    component: BayarOrderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BayarOrderPageRoutingModule {}
