import { FormControl, FormGroup } from "@angular/forms";
import { MyValidators } from "./validators";

fdescribe('test for validators', () => {
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
});
