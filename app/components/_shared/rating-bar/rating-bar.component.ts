import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'rating-bar',
  templateUrl: './rating-bar.component.html',
  styleUrls: ['./rating-bar.component.scss']
})
export class RatingBarComponent implements OnInit, OnChanges {
  @Input() percentage: number;

  cssClass: string;

  constructor() {}

  ngOnInit() {
    this.cssClass = this.getCssClass();
  }

  ngOnChanges(changes: any) {
    if (changes.percentage) {
      this.cssClass = this.getCssClass();
    }
  }

  private getCssClass() {
    return this.percentage >= 66 ? 'high' : this.percentage >= 33 ? 'medium' : 'low';
  }
}
