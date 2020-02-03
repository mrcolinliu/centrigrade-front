import { Router, RouterModule, RouterStateSnapshot } from '@angular/router';
import {
  Component,
  OnInit,
  Injectable,
  ViewChild,
  ViewContainerRef,
  NgModule,
  Compiler,
  ViewEncapsulation
} from '@angular/core';

@Injectable()
export class ModalProvider {
  create: (
    title: string,
    message: string,
    template?: string,
    clickHandler?: Function,
    confirmText?: string
  ) => Promise<boolean>;
  close: () => void;
}

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ModalComponent {
  @ViewChild('template', { read: ViewContainerRef })
  templateContainer: ViewContainerRef;

  isOpen: boolean = false;
  title: string;
  message: string;
  template: string;
  callback: Function;
  confirmText: string;

  resolve: (closed: boolean) => void;

  constructor(private modal: ModalProvider, private compiler: Compiler, private router: Router) {
    modal.create = this.create.bind(this);
    modal.close = this.close.bind(this);

    router.events.subscribe(val => {
      var currentUrl = this.router.url;
      if (this.isOpen && (val as any).url != currentUrl) {
        this.close();
      }
    });
  }

  create(
    title: string,
    message: string,
    template: string = null,
    clickHandler: Function = null,
    confirmText: string = null
  ): Promise<boolean> {
    this.title = title;
    this.message = message;
    this.template = template;
    this.templateContainer.clear();

    this.callback = clickHandler;
    this.confirmText = confirmText;

    if (this.template) {
      var meta = { template: this.template };
      @Component(meta)
      class ModalTemplateComponent {
        constructor(private router: Router) {}
      }

      @NgModule({ imports: [RouterModule], declarations: [ModalTemplateComponent] })
      class ModalModule {}

      this.compiler.compileModuleAndAllComponentsAsync(ModalModule).then(module => {
        var factory = module.componentFactories.find(
          f => f.componentType == ModalTemplateComponent
        );
        this.templateContainer.createComponent(factory);
      });
    }

    return new Promise<boolean>(resolve => {
      this.open();
      this.resolve = resolve;
    });
  }

  clickHandler() {
    this.callback.call([]);
  }

  open() {
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
    this.title = this.message = this.template = '';
    this.resolve(true);
  }
}
