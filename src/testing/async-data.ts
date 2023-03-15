import { defer, of } from "rxjs";

export function asyncData<K>(data: K) {
  return defer(() => Promise.resolve(data))
}

export function asyncError<K>(error: K) {
  return defer(() => Promise.reject(error))
}

export function mockObservable<K>(data: K) {
  return of(data);
}

export function mockPromise<K>(data: K) {
  return Promise.resolve(data)
}

