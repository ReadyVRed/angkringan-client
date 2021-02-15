import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProdukPageRoutingModule } from './produk-routing.module';

import { ProdukPage } from './produk.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProdukPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [ProdukPage]
})
export class ProdukPageModule {}
