import { Component, OnInit, Input, ElementRef, Renderer, ViewEncapsulation } from '@angular/core';
import { AppConfig } from '../../../../app.config';

@Component({
  selector: 'app-round-button',
  templateUrl: './round-button.component.html',
  styleUrls: ['./round-button.component.scss']
})
export class RoundButtonComponent implements OnInit {
  @Input('color') color: string;

  disableHover: boolean;

  constructor(private el: ElementRef, private renderer: Renderer) {}

  ngOnInit() {
    this.disableHover = AppConfig.isTouchScreen;

    if (!this.colorIsValid()) {
      this.color = 'primary';
    }

    this.renderer.setElementClass(this.el.nativeElement, this.color, true);
  }

  private colorIsValid() {
    return (this.color && this.color == 'primary') || this.color == 'secondary';
  }
}
