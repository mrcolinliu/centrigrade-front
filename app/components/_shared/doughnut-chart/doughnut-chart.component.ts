import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'doughnut-chart',
  templateUrl: './doughnut-chart.component.html',
  styleUrls: ['./doughnut-chart.component.scss']
})
export class DoughnutChartComponent implements OnInit, OnChanges {
  @Input('labels') doughnutChartLabels: string[] = [];
  @Input('colors') chartColors: string[] = [];
  @Input('datasets') datasets: any[] = [];
  @Input('options') options: any[] = [];
  @Output() onChartClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() onChartHover: EventEmitter<any> = new EventEmitter<any>();

  chartType: string = 'doughnut';

  private defaultOptions = {
    responsive: true,
    hover: {
      onHover: null,
      mode: null
    },
    tooltips: {
      enabled: false
    },
    legend: {
      position: 'right',
      fontFamily: "'museo-sans', 'sans-serif'",
      labels: {
        fontSize: 14,
        boxWidth: 14
      },
      onClick: null
    },
    title: {
      display: true,
      fontSize: 16,
      fontFamily: "'museo-sans', 'sans-serif'"
    }
  };

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: any) {
    if (changes.options) {
      this.options = _.merge(this.defaultOptions, this.options);
    }
  }

  chartClicked(e: any): void {
    this.onChartClick.next(e);
  }

  chartHovered(e: any): void {
    this.onChartHover.next(e);
  }
}
