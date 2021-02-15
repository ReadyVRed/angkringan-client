import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddProdukPageRoutingModule } from './add-produk-routing.module';

import { AddProdukPage } from './add-produk.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddProdukPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [AddProdukPage]
})
export class AddProdukPageModule {}
