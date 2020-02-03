import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from './../../services/user.service';
import { AuthService } from './../../services/auth.service';
import { ModalProvider } from './../_shared/modal/modal.component';
import { LoadingProvider } from './../_shared/loading-spinner/loading-spinner.component';
import { QuestionnaireService } from './../../services/questionnaire.service';
import { CourseService } from './../../services/course.service';
import { UserModel } from './../../models/user/user.model';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import * as _ from 'lodash';
import { LocalisationService } from '../../services/localisation.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit, OnDestroy {
  static route: string = 'welcome';

  locale: any = {};

  firstTime: boolean;
  currentUser: UserModel = new UserModel();
  questionsRemaining: number;
  questionnaireStatus: number;

  subscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private questionnaireService: QuestionnaireService,
    private modal: ModalProvider,
    private spinner: LoadingProvider,
    private localisation: LocalisationService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.locale = this.localisation.getTranslationsForComponent('WelcomeComponent');
    this.spinner.show();
    this.subscription = Observable.forkJoin(
      this.userService.getUser(),
      this.questionnaireService.getCurrentQuestionnaire()
    ).subscribe(
      result => {
        const user = result[0];
        const questionnaire = result[1];
        this.questionsRemaining = questionnaire.questions - questionnaire.completed;

        this.currentUser = user;
        this.firstTime = questionnaire.completed === 0 && questionnaire.firstIncomplete === 1;
        this.questionnaireStatus = questionnaire.status;

        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  goToMain() {
    this.router.navigate([`/centigrade`]);
  }

  goToResults() {
    if (this.questionsRemaining === 0 && this.questionnaireStatus < 100) {
      //Questionnaire complete but not marked as complete so lets mark it as complete
      this.questionnaireService.submitCompleteQuestionnaire().subscribe(result => {
        this.router.navigate([`/centigrade/course-areas`]);
      });
    } else {
      this.router.navigate([`/centigrade/course-areas`]);
    }
  }

  logout() {
    this.authService.logout();
    this.goToMain();
  }
}
