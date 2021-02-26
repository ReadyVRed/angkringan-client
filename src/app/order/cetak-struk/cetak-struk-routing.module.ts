import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CetakStrukPage } from './cetak-struk.page';

const routes: Routes = [
  {
    path: '',
    component: CetakStrukPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CetakStrukPageRoutingModule {}
