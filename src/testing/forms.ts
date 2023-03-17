import { DebugElement } from "@angular/core";
import { ComponentFixture } from "@angular/core/testing";
import { query, queryById } from "./finders";

export function setInputValue<F>(
  fixture: ComponentFixture<F>,
  selector: string,
  value: string,
  withTextId: boolean = false,
) {

  let debug: DebugElement;
  let element: HTMLInputElement;

  if(withTextId) {
    [debug, element] = queryById(fixture, selector);
  } else {
    [debug, element] = query(fixture, selector);
  }

  element.value = value;
  element.dispatchEvent(new Event('input'));
  element.dispatchEvent(new Event('blur'));
}

export function setCheckBox<F>(
  fixture: ComponentFixture<F>,
  selector: string,
  value: boolean,
  withTextId: boolean = false,
) {

  let debug: DebugElement;
  let element: HTMLInputElement;

  if(withTextId) {
    [debug, element] = queryById(fixture, selector);
  } else {
    [debug, element] = query(fixture, selector);
  }

  element.checked = value;
  element.dispatchEvent(new Event('change'));
  element.dispatchEvent(new Event('blur'));
}

