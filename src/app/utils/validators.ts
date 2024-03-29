import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { map, Observable } from 'rxjs';
import { UsersService } from '../services/users.service';

export class MyValidators {

  static isPriceValid(control: AbstractControl) {
    const value = control.value;
    if (value > 10000) {
      return {price_invalid: true};
    }
    return null;
  }

  static validPassword(control: AbstractControl) {
    const value = control.value;
    if (!containsNumber(value)) {
      return {invalid_password: true};
    }
    return null;
  }

  static matchPasswords(control: AbstractControl) {
    const password = control?.get('password')?.value;
    const confirmPassword = control?.get('confirmPassword')?.value;

    if (password === undefined || confirmPassword === undefined) {
      throw new Error('matchpasswords: password and confirmPassword not fount');
    }
    if (password !== confirmPassword) {
      return {match_password: true};
    }
    return null;
  }

  // static validateCategory(service: CategoriesService) {
  //   return (control: AbstractControl) => {
  //     const value = control.value;
  //     return service.checkCategory(value)
  //     .pipe(
  //       map((response: any) => {
  //         const isAvailable = response.isAvailable;
  //         if (!isAvailable) {
  //           return {not_available: true};
  //         }
  //         return null;
  //       })
  //     );
  //   };
  // }

    static validateEmailAsync(service: UsersService) {
    return (control: AbstractControl): Observable<any> => {
      const value = control.value;
      console.log(service)
      return service.isAvailableByEmail(value).pipe(
        map((response: any) => {
          const isAvailable = response.isAvailable;
          if (!isAvailable) {
            return {not_available: true};
          }
          return null;
        })
      );
    };
  }

}

function containsNumber(value: string){
  return value.split('').find(v => isNumber(v)) !== undefined;
}


function isNumber(value: string){
  return !isNaN(parseInt(value, 10));
}
