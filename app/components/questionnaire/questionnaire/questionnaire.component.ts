import { ModalProvider } from './../../_shared/modal/modal.component';
import { LoadingProvider } from './../../_shared/loading-spinner/loading-spinner.component';
import { AnswerResponse } from './../../../models/questionnaire/answerResponse.model';
import { SubmitAnswersModel } from './../../../models/questionnaire/submitAnswers.model';
import { QuestionnaireModel } from './../../../models/questionnaire/questionnaire.model';
import { Answer } from './../../../models/questionnaire/answer.model';
import { Subject, Subscription } from 'rxjs';
import { AnswerRequest } from './../../../models/questionnaire/answerRequest.model';
import { Question } from './../../../models/questionnaire/question.model';
import { QuestionnaireService } from './../../../services/questionnaire.service';
import { RouteBreadcrumbs } from './../../../services/routeBreadcrumbs.service';
import { Footer } from './../../../services/footer.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { WindowUtils } from './../../../utils/windowUtils';
import { Breadcrumb } from './../../../models/_base/breadcrumb.model';
import * as _ from 'lodash';
import { LocalisationService } from '../../../services/localisation.service';
import {
  OfflineQuestionnaireService,
  QuestionPost
} from 'app/services/offline-questionnaire.service';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.scss']
})
export class QuestionnaireComponent implements OnInit, OnDestroy {
  public static route: string = 'questions';

  locale: any = {};

  questionnaire: QuestionnaireModel;
  question: Question = new Question();
  questions: Question[];
  defaultQuestion = new Question();

  isReview: boolean;
  questionIndex: number = 0;
  maxIndex: number;
  onQuestionChange: Subject<any> = new Subject();
  onQuestionSubmit: Subject<any> = new Subject();
  lastAnswered: number = 0;

  submitingQuestion: boolean = false;

  questionnaireSubscription: Subscription;

  constructor(
    private routeBreadcrumbs: RouteBreadcrumbs,
    private footerService: Footer,
    private modal: ModalProvider,
    private questionnaireService: QuestionnaireService,
    private router: Router,
    private loading: LoadingProvider,
    private route: ActivatedRoute,
    private localisation: LocalisationService,
    private offlineQuestionnaireService: OfflineQuestionnaireService
  ) {}

  ngOnInit() {
    this.locale = this.localisation.getTranslationsForComponent('QuestionnaireComponent');

    this.loading.show(this.locale.loadingText, true);

    this.routeBreadcrumbs.breadcrumbs.next([new Breadcrumb(this.locale.breadcrumbText, null)]);
    this.routeBreadcrumbs.disableBackButton.next(true);

    this.footerService.update(null);

    this.route.params.subscribe(
      params => {
        this.isReview = params['review'];
      },
      error => {
        this.loading.hide();
      }
    );

    this.questionnaireSubscription = this.questionnaireService.getCurrentQuestionnaire().subscribe(
      questionnaire => {
        this.questionnaire = questionnaire;
        this.maxIndex = questionnaire.questions - 1;
        this.offlineQuestionnaireService.setSaveLimit(questionnaire.saveLimit);

        this.questionnaireService.getQuestions().subscribe(
          questionsModel => {
            this.questions = questionsModel.questions;

            if (questionnaire.firstIncomplete) {
              this.showQuestion(
                this.offlineQuestionnaireService.firstIncomplete(questionnaire.firstIncomplete)
              );
            } else if (this.isReview) {
              this.showQuestion(_.last(questionsModel.questions).questionId);
            } else {
              this.router.navigate([`/review-questions`]);
            }

            this.loading.hide();
          },
          error => {
            this.loading.hide();
          }
        );
      },
      error => {
        this.loading.hide();
      }
    );

    this.defaultQuestion.type = 'QTYPE_SINGLE';
  }

  ngOnDestroy() {
    this.questionnaireSubscription.unsubscribe();
  }

  nextQuestion() {
    if (this.isReview && this.questionIndex >= this.maxIndex) {
      this.router.navigate([`/centigrade/questions/complete`]);
    } else {
      this.onQuestionChange.next(true);
    }
  }

  previousQuestion() {
    this.onQuestionChange.next(false);
  }

  onAnswersSubmitted(model: SubmitAnswersModel) {
    if (!this.submitingQuestion) {
      this.submitingQuestion = true;
      if (!model.directionIsNext || model.answers == null) {
        //Go back without submitting answers
        this.changeQuestion(model.directionIsNext);
        this.submitingQuestion = false;
        return;
      }

      let request = new AnswerRequest();
      request.responses = model.answers;

      let post = { questionId: this.question.questionId, answer: request } as QuestionPost;
      if (this.offlineQuestionnaireService.sendQuestion(post) >= 0) {
        this.offlineQuestionnaireService.trySendAll(() => {
          this.changeQuestion(model.directionIsNext);
          this.onQuestionSubmit.next();
        });
      } else {
        this.answerRequestFailed(null);
        model.answers.forEach(e => (e.selected = false));
        this.onQuestionSubmit.next();
      }

      this.submitingQuestion = false;
    }
  }

  showQuestion(questionIndex: number) {
    let question = _.find(this.questions, (q, index) => {
      this.questionIndex = index;
      return q.questionId === questionIndex;
    });

    this.question = this.defaultQuestion;

    setTimeout(() => {
      this.question = question;
    });
  }

  private changeQuestion(isNext: boolean) {
    let nextIndex = this.questionIndex;

    if (isNext) {
      nextIndex++;
      if (this.lastAnswered < nextIndex) {
        this.lastAnswered = nextIndex;
      }
    } else {
      nextIndex--;
    }

    if (nextIndex > this.maxIndex) {
      //Questionnaire complete
      this.questionnaireService.submitCompleteQuestionnaire().subscribe(
        result => {
          this.router.navigate([`/centigrade/questions/complete`]);
        },
        result => {
          this.showQuestion(result.firstIncomplete);
        }
      );
    } else {
      this.questionIndex = nextIndex;

      this.question = this.defaultQuestion;

      setTimeout(() => {
        this.question = this.questions[this.questionIndex];
      });
    }
    WindowUtils.scrollToY(0, 1500, 'easeInOutQuint');
    document.getElementsByTagName('body')[0].style.webkitTransform = 'scale(1)';
  }

  retry = () => {
    this.offlineQuestionnaireService.trySendAll(() => {
      if (this.offlineQuestionnaireService.count() === 0) {
        this.changeQuestion(true);
        this.onQuestionSubmit.next();
        this.modal.close();
      }
    });
  };

  private answerRequestFailed(err: AnswerResponse) {
    if (!err) {
      this.modal.create(
        this.locale.noInternetModelTitle,
        this.locale.noInternetModelMessage,
        null,
        this.retry,
        this.locale.noInternetModelButtonText
      );
    } else {
      switch (err.returnCode.label) {
        case 'E_NO_ANSWER':
          this.modal.create(this.locale.errorModalTitle, err.returnCode.message);
          break;
        case 'E_INVALID_REQUEST':
          this.modal.create(
            this.locale.errorModalTitle,
            err.returnCode.errors ? err.returnCode.errors.toString() : err.returnCode.message
          );
          break;
        default:
          this.modal.create(this.locale.errorModalTitle, err.returnCode.message);
          break;
      }
    }
  }

  isAnswered(question: Question) {
    return question.answered || question.options.some(e => e.selected);
  }
}
