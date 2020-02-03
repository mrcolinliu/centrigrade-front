import {
  Component,
  OnInit,
  Injectable,
  ViewChild,
  ViewContainerRef,
  NgModule,
  Compiler
} from '@angular/core';

@Injectable()
export class LoadingProvider {
  show: (loadingText?: string, immediate?: boolean) => void;
  hide: () => void;
}

@Component({
  selector: 'loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss']
})
export class LoadingSpinnerComponent {
  private readonly timeout = 800;

  isSpinnerOpen: boolean = false;
  loadingText: string;

  currentTimer: any = null;

  constructor(private spinner: LoadingProvider) {
    spinner.show = this.show.bind(this);
    spinner.hide = this.hide.bind(this);
  }

  show(loadingText: string = null, immediate: boolean = false) {
    this.loadingText = loadingText;

    if (!!this.currentTimer) this.clearTimeout();

    if (immediate) {
      this.isSpinnerOpen = true;
      return;
    }

    this.currentTimer = window.setTimeout(() => {
      this.isSpinnerOpen = true;
    }, this.timeout);
  }

  hide() {
    if (!!this.currentTimer) {
      this.clearTimeout();
      setTimeout(() => {
        this.isSpinnerOpen = false;
        this.loadingText = '';
      }, this.timeout);
    } else {
      this.isSpinnerOpen = false;
      this.loadingText = '';
    }
  }

  private clearTimeout() {
    window.clearTimeout(this.currentTimer);
    this.currentTimer = null;
  }
}
