import { FilterOption } from './../../../models/courses/filterOption.model';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'valuesFilter'
})
export class FilterValuesPipe implements PipeTransform {
  transform(options: FilterOption[], name: any): any {
    if (options == null) {
      return null;
    }

    return options.filter(
      opt =>
        opt.values.filter(val => val.value.toLowerCase().includes(name.toLowerCase())).length > 0
    );
  }
}
