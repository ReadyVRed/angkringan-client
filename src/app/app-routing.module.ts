import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/guard/auth.guard';
import { AutoLoginGuard } from './services/guard/auto-login.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule),
    canLoad: [AutoLoginGuard]
  },
  {
    path: 'members',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canLoad: [AuthGuard]
  },
  {
    path: 'mitra',
    loadChildren: () => import('./master/mitra/mitra.module').then(m => m.MitraPageModule)
  },
  {
    path: 'user-sistem',
    loadChildren: () => import('./master/user-sistem/user-sistem.module').then(m => m.UserSistemPageModule)
  },
  {
    path: 'produk',
    loadChildren: () => import('./master/produk/produk.module').then(m => m.ProdukPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
