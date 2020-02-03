import { Component, OnInit, ElementRef, Renderer, Input } from '@angular/core';
import { AppConfig } from '../../../../app.config';

@Component({
  selector: 'app-tick-button',
  templateUrl: './tick-button.component.html',
  styleUrls: ['./tick-button.component.scss']
})
export class TickButtonComponent implements OnInit {
  @Input('selected') selected: boolean;
  @Input('clear') clear: boolean;

  @Input('disableClick') disableClick: boolean;
  disableHover: boolean;

  constructor(private el: ElementRef, private renderer: Renderer) {}

  ngOnInit() {
    this.disableHover = AppConfig.isTouchScreen;
  }
}
