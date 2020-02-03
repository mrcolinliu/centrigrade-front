import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class Footer {
  onUpdated: Subject<FooterOptions> = new Subject<FooterOptions>();
  onActionClicked: Subject<boolean> = new Subject<boolean>();

  update(options: FooterOptions) {
    this.onUpdated.next(options);
  }
}

export class FooterOptions {
  title: string;
  action?: string | (() => void) = null;
  checkbox?: boolean = false;
  checked?: boolean = false;
  helpText?: string = null;
}
