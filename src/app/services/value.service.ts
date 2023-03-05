import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ValueService {

  private _value = 'testing value';

  constructor() { }

  get value() {
    return this._value;
  }

  set value(val: string) {
    this._value = val;
  }

  public getValue(): string {
    return this._value;
  }

  public setValue(val: string) {
    this._value = val;
  }

  public getPromiseValue() {
    return Promise.resolve(this._value);
  }

  public getObservable() {
    return of(this._value)
  }
}
