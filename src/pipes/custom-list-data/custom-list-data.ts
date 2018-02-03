import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customListData',
})
export class CustomListDataPipe implements PipeTransform {

  transform(value: string, ...args) {
    if (value !== '') {
      if (String(value).trim().toLowerCase() === 'undefined' || String(value).trim().toLowerCase() === 'null') {
        return '';
      }
      if (args[0] && args[0] === 'showForEye') {
        if (args[1]) {
          value = '***';
        }
      } else if (args[0] && args[0] === 'isMoney') {
        value = Number(value).toFixed(2);
      }
    }
    return value;
  }
}
