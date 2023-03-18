import { AsyncValidatorFn, FormControl, FormGroup } from "@angular/forms";
import { mockObservable } from "src/testing";
import { UsersService } from "../services/users.service";
import { MyValidators } from "./validators";

describe('test for validators', () => {
  it('should return null with valid price', () => {
    const input = new FormControl();
    input.setValidators(MyValidators.isPriceValid);
    input.setValue(8000);
    expect(input.errors).toBe(null);
  });

  it('should return error with valid price', () => {
    const input = new FormControl();
    input.setValidators(MyValidators.isPriceValid);
    input.setValue(110000);
    expect(input.errors?.['price_invalid']).toBeTruthy();
  });

  it('should return null with valid password', () => {
    const input = new FormControl();
    input.setValidators(MyValidators.validPassword);
    input.setValue('dddddd1');
    expect(input.errors).toBe(null);
  });

  it('should return error with valid password', () => {
    const input = new FormControl();
    input.setValidators(MyValidators.validPassword);
    input.setValue('dddddd');
    expect(input.errors?.['invalid_password']).toBeTruthy();
  });
  it('should return null with matchPasswords', () => {
    const input = new FormGroup({
      password: new FormControl('1fee22332'),
      confirmPassword: new FormControl('1fee22332')
    });
    input.setValidators(MyValidators.matchPasswords);
    expect(input.errors).toBe(null);
  });

  it('should return error with matchPasswords', () => {
    const input = new FormGroup({
      password: new FormControl('1fee22332'),
      confirmPassword: new FormControl('1fee223322')
    }, {
      validators: MyValidators.matchPasswords
    });

    expect(input.errors?.['match_password']).toBeTruthy();
  });

  it('should throw error with matchPasswords', () => {
    const input = new FormGroup({
      other: new FormControl('1fee22332'),
      d: new FormControl('1fee223322')
    });
    const fn = () => MyValidators.matchPasswords(input)
    expect(fn).toThrow(new Error('matchpasswords: password and confirmPassword not fount'));
  });


  describe('test for asyncValidator', () => {
    it('should return error', (doneFn) => {
      const userService: jasmine.SpyObj<UsersService> = jasmine.createSpyObj('UsersService',['isAvailableByEmail']);
      userService.isAvailableByEmail.and.returnValue(mockObservable({isAvailable: false}));
      const control = new FormControl('jdoo1114@cosa.co');
      // Act
      const validator = MyValidators.validateEmailAsync(userService);
      validator(control).subscribe({
        next: (val) => {
          expect(val['not_available']).toBeTruthy();
          doneFn();
        }
      })
    })
  });
});
