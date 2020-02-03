import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './../../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { LocalisationService } from '../../../services/localisation.service';

@Component({
  selector: 'app-activation',
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.scss']
})
export class ActivationComponent implements OnInit {
  static route: string = 'activation';
  static routeParams: string = '?activate=';

  activateToken: string;
  locale: any = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public localisation: LocalisationService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.locale = this.localisation.getTranslationsForComponent('ActivationComponent');

    this.route.queryParams.subscribe(params => {
      this.activateToken = params['activate'];
      if (this.activateToken) {
        this.authService.activateUser(this.activateToken).subscribe(result => {});
      }
    });
  }

  goToLogin() {
    this.router.navigate([`/login`]);
  }
}
