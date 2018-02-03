import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'strIsNull',
})
export class StrIsNullPipe implements PipeTransform {

  transform(value: string, ...args) {
    if (value) {
      return value;
    }
    return args[0];
  }
}
