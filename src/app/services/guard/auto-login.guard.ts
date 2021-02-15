import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, take, map } from 'rxjs/operators';
import { AppService } from '../app.service';

@Injectable({
  providedIn: 'root'
})
export class AutoLoginGuard implements CanLoad {
  constructor(private authService: AppService,
    private router: Router) {

  }
  canLoad(): Observable<boolean> {
    return this.authService.isAuth.pipe(
      filter(val => val !== null),
      take(1),
      map(isAuth => {
        if (isAuth) {
          this.router.navigateByUrl('/members/tab1', { replaceUrl: true });
        } else {
          return true;
        }
      })
    )
  }
}
