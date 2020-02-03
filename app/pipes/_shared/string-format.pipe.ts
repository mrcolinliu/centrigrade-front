import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

declare global {
  interface String {
    format(args: string[]): string;
  }
}

@Pipe({
  name: 'stringFormat'
})
export class StringFormatPipe implements PipeTransform {
  transform(value: string, args?: string[]): any {
    return value.format.apply(value, args);
  }
}
