import { Component, OnInit, Input, HostListener, Output } from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss']
})
export class StarRatingComponent implements OnInit {
  @Input('highlight') highlight: boolean;
  @Input('value') value: number;
  @Input('mode') mode: StarRatingMode = 'static';
  @Input('rating-step') ratingStep: number = 0.5;
  @Input('size') size: string = 'normal';

  @Output('change') change: Subject<number> = new Subject();

  showSlider: boolean = false;

  constructor() {}

  ngOnInit() {}

  onStarClick($value: number) {
    if (this.mode != 'edit') return;

    if (this.value == $value) $value--;

    this.value = $value;
    this.change.next(this.value);
  }
}

type StarRatingMode = 'static' | 'edit';
