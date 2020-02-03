import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-vertical-progress-indicator',
  templateUrl: './vertical-progress-indicator.component.html',
  styleUrls: ['./vertical-progress-indicator.component.scss']
})
export class VerticalProgressIndicatorComponent implements OnInit, OnChanges {
  @Input() max: number;
  @Input() value: number;

  fillPercentage: string = '0%';

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: any) {
    if (!this.max || !this.value) return;
    this.fillPercentage = this.value / this.max * 100 + '%';
  }
}
