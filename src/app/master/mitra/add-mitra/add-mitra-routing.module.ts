import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddMitraPage } from './add-mitra.page';

const routes: Routes = [
  {
    path: '',
    component: AddMitraPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddMitraPageRoutingModule {}
