import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MitraPage } from './mitra.page';

const routes: Routes = [
  {
    path: '',
    component: MitraPage
  },
  {
    path: 'add-mitra',
    loadChildren: () => import('./add-mitra/add-mitra.module').then( m => m.AddMitraPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MitraPageRoutingModule {}
