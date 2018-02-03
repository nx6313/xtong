import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneEncry',
})
export class PhoneEncryPipe implements PipeTransform {

  transform(value: string, ...args) {
    let phoneEncryResult = '';
    if (value && value.length == 11 && (typeof args[0] == 'undefined' || (typeof args[0] == 'boolean' && !args[0]))) {
      phoneEncryResult = value.substr(0, 3) + '*****' + value.substr(8);
    } else {
      phoneEncryResult = value;
    }
    if (phoneEncryResult === '') {
      phoneEncryResult = '---*****---';
    }
    return phoneEncryResult;
  }
}
