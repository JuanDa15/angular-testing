import { DebugElement } from "@angular/core";
import { ComponentFixture } from "@angular/core/testing";
import { query, queryById } from "./finders";
/**
 * Al hacer click con el trigerEventHandler, no se esta haciendo
 * click en el html, solamente se esta emitiendo el evento (output)
 *
 * @param fixture
 * @param selector
 * @param withTestById
 * @param event
 */
export function clickEvent<F>(
  fixture: ComponentFixture<F>,
  selector: string,
  withTestById: boolean = false,
  event: unknown = null
) {

  let debug: DebugElement;
  let element: HTMLElement;

  if (withTestById) {
    [debug, element] = queryById<F,HTMLElement>(fixture, selector);
  } else {
    [debug, element] = query<F, HTMLElement>(fixture, selector);
  }

  debug.triggerEventHandler('click', event);
}

export function clickElement<F>(
  fixture: ComponentFixture<F>,
  selector: string,
  withTestById: boolean = false,
) {

  let debug: DebugElement;
  let element: HTMLElement;

  if (withTestById) {
    [debug, element] = queryById<F,HTMLElement>(fixture, selector);
  } else {
    [debug, element] = query<F, HTMLElement>(fixture, selector);
  }
  element.click();
}
