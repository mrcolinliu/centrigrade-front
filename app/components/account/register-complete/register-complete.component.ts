import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalisationService } from '../../../services/localisation.service';
import { QuestionnaireComponent } from '../../questionnaire/questionnaire/questionnaire.component';
import { QuestionnaireService } from '../../../services/questionnaire.service';
import { AuthService } from '../../../services/auth.service';
import { LoadingProvider } from 'app/components/_shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-register-complete',
  templateUrl: './register-complete.component.html',
  styleUrls: ['./register-complete.component.scss']
})
export class RegisterCompleteComponent implements OnInit {
  static route: string = 'registration-complete';

  locale: any = {};

  constructor(
    private router: Router,
    private localisation: LocalisationService,
    private questionnaireService: QuestionnaireService,
    private authService: AuthService,
    private loadingProvider: LoadingProvider
  ) {}

  ngOnInit() {
    this.loadingProvider.show(null, true);
    this.locale = this.localisation.getTranslationsForComponent('RegisterCompleteComponent');

    this.questionnaireService.getQuestionnaireStatus().subscribe(Response => {
      this.loadingProvider.hide();
    });
  }

  goToStart() {
    this.router.navigateByUrl('/centigrade/questions');
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
