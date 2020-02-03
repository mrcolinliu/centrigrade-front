import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { CourseAreaListComponent } from 'app/components/course-areas/list/course-area-list/course-area-list.component';
import { ErrorService } from 'app/services/error.service';
import { ModalProvider } from 'app/components/_shared/modal/modal.component';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {
  constructor(private errorService: ErrorService, private modal: ModalProvider) {}

  canDeactivate(component: CanComponentDeactivate) {
    if (
      (component instanceof CourseAreaListComponent && !sessionStorage.getItem('token')) ||
      !sessionStorage.getItem('areas-intro-seen')
    ) {
      return true;
    }

    if (!!this.errorService.error && this.errorService.error.code === 'E_PAUSED_ACCESS') {
      return true;
    }

    return component.canDeactivate ? component.canDeactivate() : true;
  }
}
