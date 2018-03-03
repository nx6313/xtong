import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'distance',
})
export class DistancePipe implements PipeTransform {

  transform(value: string, ...args) {
    if (Number(value) > 1000) {
      return (Number(value) / 1000).toFixed(1) + 'k';
    }
    return value;
  }
}
