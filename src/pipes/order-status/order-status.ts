import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderStatus',
})
export class OrderStatusPipe implements PipeTransform {

  transform(value: string, ...args) {
    let orderStatusVal = '未接取任务';
    if (value == '0') {
      orderStatusVal = '未接取任务';
    } else if (value == '1') {
      orderStatusVal = '任务已接取';
    } else if (value == '2') {
      orderStatusVal = '已报价';
    } else if (value == '3') {
      orderStatusVal = '客户已支付';
    } else if (value == '4') {
      orderStatusVal = '任务已完结';
    }
    return orderStatusVal;
  }
}
