import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddMitraPageRoutingModule } from './add-mitra-routing.module';

import { AddMitraPage } from './add-mitra.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddMitraPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [AddMitraPage]
})
export class AddMitraPageModule {}
