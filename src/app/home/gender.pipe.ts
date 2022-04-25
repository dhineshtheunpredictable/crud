import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'gender'
})
export class GenderPipe implements PipeTransform {

  transform(value: unknown): unknown {
    const gender = value ? 'male' : 'female';
    return gender;
  }

}
