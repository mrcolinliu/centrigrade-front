import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {
  transform(collection: any[], property: string, searchText: string = '', token?: any): any[] {
    if (!searchText) return collection;

    return collection.filter(item => {
      let comparate = item[property];

      if (comparate == null || typeof comparate == 'undefined') return false;

      if (typeof comparate == 'number') comparate = (comparate as number).toString();

      if (typeof comparate == 'string')
        return (comparate as string).toLowerCase().indexOf(searchText.toLowerCase()) != -1;

      return false;
    });
  }
}
