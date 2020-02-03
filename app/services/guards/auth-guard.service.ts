import { RegisterComponent } from './../../components/account/register/register.component';
import { WelcomeComponent } from './../../components/welcome/welcome.component';
import { LoginComponent } from './../../components/account/login/login.component';
import { RequestPaymentComponent } from './../../components/account/request-payment/request-payment.component';
import { AuthService } from '../auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { LocalisationService } from '../localisation.service';

@Injectable()
export class AuthGuardService implements CanActivate {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, snapshot: RouterStateSnapshot): boolean {
    var url = snapshot.url;
    return this.isAuthenticated(url);
  }

  isAuthenticated(url: string): boolean {
    var isSignIn = url == `/${LoginComponent.route}` || url == `/${RegisterComponent.route}`;

    if (this.authService.isAuthenticated()) {
      if (isSignIn) {
        this.router.navigate([`/${WelcomeComponent.route}`]);
      }
      return !isSignIn;
    }

    if (!isSignIn) {
      this.router.navigate([`/${LoginComponent.route}`]);
    }

    this.authService.redirectUrl = url;

    return isSignIn;
  }
}
