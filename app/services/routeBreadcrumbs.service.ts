import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Breadcrumb } from './../models/_base/breadcrumb.model';

@Injectable()
export class RouteBreadcrumbs {
  breadcrumbs: Subject<Breadcrumb[]> = new Subject<Breadcrumb[]>();
  disableBackButton: Subject<boolean> = new Subject<boolean>();
}
