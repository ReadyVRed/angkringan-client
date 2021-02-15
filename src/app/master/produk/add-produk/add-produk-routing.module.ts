import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddProdukPage } from './add-produk.page';

const routes: Routes = [
  {
    path: '',
    component: AddProdukPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddProdukPageRoutingModule {}
