import { Pipe, PipeTransform } from '@angular/core';
import { UtilService } from '../../providers/util-service';

@Pipe({
  name: 'remandDate',
})
export class RemandDatePipe implements PipeTransform {

  constructor(private utilService: UtilService) {
  }

  transform(value: string, ...args) {
    if (args && args.length > 0) {
      return this.utilService.formatDate(new Date(value), args[0]);
    } else {
      if (value === this.utilService.formatDate(new Date(new Date().setDate(new Date().getDate() - 2)), 'yyyy-MM-dd')) {
        return '前 天';
      } else if (value === this.utilService.formatDate(new Date(new Date().setDate(new Date().getDate() - 1)), 'yyyy-MM-dd')) {
        return '昨 天';
      } else if (value === this.utilService.formatDate(new Date(), 'yyyy-MM-dd')) {
        return '今 天';
      } else if (value === this.utilService.formatDate(new Date(new Date().setDate(new Date().getDate() + 1)), 'yyyy-MM-dd')) {
        return '明 天';
      } else if (value === this.utilService.formatDate(new Date(new Date().setDate(new Date().getDate() + 2)), 'yyyy-MM-dd')) {
        return '后 天';
      }
      return this.utilService.formatDate(new Date(value), 'MM 月 dd 日');
    }
  }
}
