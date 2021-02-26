import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CetakStrukPageRoutingModule } from './cetak-struk-routing.module';

import { CetakStrukPage } from './cetak-struk.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CetakStrukPageRoutingModule
  ],
  declarations: [CetakStrukPage]
})
export class CetakStrukPageModule {}
