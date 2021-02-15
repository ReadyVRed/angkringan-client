import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserSistemPageRoutingModule } from './user-sistem-routing.module';

import { UserSistemPage } from './user-sistem.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserSistemPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [UserSistemPage]
})
export class UserSistemPageModule {}
