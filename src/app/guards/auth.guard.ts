import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {
    // const token = this.tokenService.getToken();
    // if (!token) {
    //   this.router.navigate(['/home']);
    //   return false;
    // }
    // return true;
    // route.params['idProduct'];
    // route.data['idProduct'];
    // route.queryParams['idProduct'];
    // route.paramMap.get('idProduct');
    return this.authService.getUser()
    .pipe(
      map(user => {
        if(!user) {
          this.router.navigate(['/']);
          return false;
        }
        return true;
      })
    )
  }

}
