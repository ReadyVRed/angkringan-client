import { Injectable } from '@angular/core';
import { CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, take, map } from 'rxjs/operators';
import { AppService } from '../app.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad {
  constructor(private authService: AppService,
    private router: Router) { }
  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.isAuth.pipe(
      filter(val => val !== null),
      take(1),
      map(isAuth => {
        if (isAuth) {
          return true;
        } else {
          this.router.navigateByUrl('/login', { replaceUrl: true });
          return false;
        }
      })
    )
  }
}
