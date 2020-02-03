import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Breadcrumb } from './../../../models/_base/breadcrumb.model';
import { Location } from '@angular/common';

@Component({
  selector: 'breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {
  @Input() breadcrumbs: Breadcrumb[];
  @Input() disableBackButton: Boolean;

  constructor(private location: Location) {}

  ngOnInit() {}

  goBack() {
    this.location.back();
  }
}
