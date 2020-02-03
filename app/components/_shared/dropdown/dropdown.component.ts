import {
  Component,
  OnInit,
  OnChanges,
  Input,
  Output,
  ViewEncapsulation,
  ElementRef,
  EventEmitter
} from '@angular/core';

@Component({
  selector: 'dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  host: {
    '(document:click)': 'documentClicked($event)'
  }
})
export class DropdownComponent implements OnInit, OnChanges {
  @Input() title: string;
  @Input() items: DropdownItem<any>[] = [];

  @Output() changed: EventEmitter<DropdownItem<any>> = new EventEmitter<DropdownItem<any>>();

  isOpen: boolean = false;
  label: string;

  ngOnInit() {}

  ngOnChanges(changes: any) {
    if (changes.items) {
      let selected = this.items.find(item => item.selected);

      if (selected) this.label = selected.label;
    }
  }

  toggleState() {
    this.isOpen = !this.isOpen;
  }

  select(item: DropdownItem<any>) {
    this.isOpen = false;

    this.items.forEach(item => (item.selected = false));
    this.label = item.label;
    item.selected = true;

    this.changed.next(item);
  }

  documentClicked($event: any) {
    var path = $event.path || this.getPath($event);
    if (!!path && (path as any[]).some(obj => obj.localName == 'dropdown')) return;

    this.isOpen = false;
  }

  private getPath($event: any) {
    var path = [];
    var currentElem = $event.target;
    while (currentElem) {
      path.push(currentElem);
      currentElem = currentElem.parentElement;
    }
    if (path.indexOf(window) === -1 && path.indexOf(document) === -1) path.push(document);
    if (path.indexOf(window) === -1) path.push(window);
    return path;
  }
}

export class DropdownItem<T> {
  constructor(label: string, direction: string, data: T, selected: boolean) {
    this.label = label;
    this.direction = direction;
    this.data = data;
    this.selected = selected;
  }

  label: string;
  direction: string;
  data: T;
  selected: boolean = false;
}
