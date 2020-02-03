import { Component, OnInit } from '@angular/core';
import { LoadingProvider } from './../../_shared/loading-spinner/loading-spinner.component';
import { LocalisationService } from '../../../services/localisation.service';
import { QuestionnaireService } from '../../../services/questionnaire.service';
import { Router } from '@angular/router';
import { AuthService } from './../../../services/auth.service';

@Component({
  selector: 'app-request-payment',
  templateUrl: './request-payment.component.html',
  styleUrls: ['./request-payment.component.scss']
})
export class RequestPaymentComponent implements OnInit {
  static route: string = 'payment';

  locale: any = {};
  formSubmitted: boolean = false;

  constructor(
    private localisation: LocalisationService,
    private questionnaireService: QuestionnaireService,
    private router: Router,
    private spinner: LoadingProvider,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.locale = this.localisation.getTranslationsForComponent('RequestPaymentComponent');
    this.spinner.show(this.locale.loadingText, true);

    // check if they have paid
    this.questionnaireService.checkPayment().subscribe(res => {
      if (res.paid === true) {
        this.router.navigate([`/welcome.component.html`]);
      }
      this.spinner.hide();
    });
  }

  setFormSubmitted(value) {
    this.formSubmitted = value;
  }

  goToPaymentGateway() {
    this.setFormSubmitted(true);
    this.questionnaireService.requestPaymentGateway();
    // Should be redirect to gateway but enable button anyway
    this.setFormSubmitted(false);
  }

  signOut() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
