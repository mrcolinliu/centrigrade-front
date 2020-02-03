import { Subject, Subscription } from 'rxjs';
import { Injectable } from '@angular/core';
import { OnInit, Output, OnDestroy } from '@angular/core';

@Injectable()
export class NavigationService {
  @Output() filtersComplete: Subject<boolean> = new Subject<boolean>();

  defaultFiltersComplete: boolean = true;

  updateFiltersComplete(complete: boolean) {
    this.filtersComplete.next(complete);
  }
}
