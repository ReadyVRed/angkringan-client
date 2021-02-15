import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProdukPage } from './produk.page';

const routes: Routes = [
  {
    path: '',
    component: ProdukPage
  },
  {
    path: 'add-produk',
    loadChildren: () => import('./add-produk/add-produk.module').then( m => m.AddProdukPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProdukPageRoutingModule {}
