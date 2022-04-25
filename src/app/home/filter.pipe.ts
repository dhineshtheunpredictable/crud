import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  pure: false
})
export class FilterPipe implements PipeTransform {

  transform(value: Array<any>, ...args: string[]): unknown {
    let searchCategory = args[0];
    let searchText = args[1];
    let filteredValue = value.filter( data => {
      return data[searchCategory] === searchText;
    })
    return filteredValue.length ? filteredValue : value;
  }

}
