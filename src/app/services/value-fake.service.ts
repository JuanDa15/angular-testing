import { of } from 'rxjs';

export class FakeValueService {


  get value() {
    return 'other value';
  }

  set value(val: string) {}

  public getValue(): string {
    return 'other value';
  }

  public setValue(val: string) {}

  public getPromiseValue() {
    return Promise.resolve('other value from promise');
  }

  public getObservable() {
    return of('other value from observable')
  }
}
