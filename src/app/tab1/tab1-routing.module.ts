import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Tab1Page } from './tab1.page';

const routes: Routes = [
  {
    path: '',
    component: Tab1Page,
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('../dashboard/dashboard.module').then(m => m.DashboardPageModule)
      },
      {
        path: 'mitra',
        loadChildren: () => import('../master/mitra/mitra.module').then(m => m.MitraPageModule)
      },
      {
        path: 'user-sistem',
        loadChildren: () => import('../master/user-sistem/user-sistem.module').then(m => m.UserSistemPageModule)
      },
      {
        path: 'produk',
        loadChildren: () => import('../master/produk/produk.module').then(m => m.ProdukPageModule)
      },
      {
        path: '',
        redirectTo: '/members/tab1/dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/members/tab1/dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class Tab1PageRoutingModule { }
