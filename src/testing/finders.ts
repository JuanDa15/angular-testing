import { DebugElement, Type } from "@angular/core";
import { ComponentFixture } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
/**
 * [query]
 * @type {F} Fixture type
 * @type {T} Element type
 * @param fixture
 * @param selector
 * @returns
 */
export function queryById<F, T>(
  fixture: ComponentFixture<F>,
  selector: string
): [DebugElement, T]{
  const selectorTemplate = `[data-testid="${selector}"]`;
  const debug = fixture.debugElement.query(By.css(selectorTemplate));
  let element;

  if (!debug) {
    throw new Error(`queryById: Element with data-testid ${selector} not found`);
  }
  element = <T>debug.nativeElement;
  return [debug, element];
}

export function query<F, T>(
  fixture: ComponentFixture<F>,
  selector: string
): [DebugElement, T]{
  const debug = fixture.debugElement.query(By.css(selector));
  let element;

  if (!debug) {
    throw new Error(`query: Element with selector ${selector} not found`);
  }
  element = <T>debug.nativeElement;
  return [debug, element];
}

export function queryAll<F>(
  fixture: ComponentFixture<F>,
  selector: string
): DebugElement[] {
  return fixture.debugElement.queryAll(By.css(selector));
}

export function queryAllByDirective<T, D>(
  fixture:ComponentFixture<T>,
  directive: Type<D>
): DebugElement[]  {
  return fixture.debugElement.queryAll(By.directive(directive));
}

export function getText<F>(
  fixture: ComponentFixture<F>,
  testId: string
) {
  const [debug, element] = queryById<F,HTMLElement>(fixture, testId);
  return element.textContent;
}
