import { Component, ElementRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ReversePipe } from '../pipes/reverse.pipe';
import { HighligthDirective } from './highligth.directive';

// export class MockElementRef extends ElementRef {
//   constructor(nativeElement: HTMLElement) { super(nativeElement); }
// }

@Component({
  template: `
  <h5 class="title" highligth data-testid="default-directive">Hay un valor default</h5>
  <h5 highligth="yellow" data-testid="yellow-directive">Hay un valor</h5>
  <p [highligth]="color"  data-testid="dynamic-directive">parrafo</p>
  <p>otro parrafo</p>
  <input type="color" [(ngModel)]="color" data-testid="input-color">
  <input type="text" [(ngModel)]="word" data-testid="pipe-input">
  <p data-testid="pipe-word">{{word | reverse}}</p>
  `,
})

class HostComponent {
  public color;
  public word;
  constructor() {
    this.word = '';
    this.color = '#ff0000';
  }
}

describe('HighligthDirective', () => {

  let component: HostComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async() => {
    TestBed.configureTestingModule({
      declarations: [
        HostComponent,
        HighligthDirective,
        ReversePipe
      ],
      imports: [
        FormsModule
      ],
      providers: [
        // { provide: ElementRef, useClass: MockElementRef}
      ]
    }).compileComponents();
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  })




  it('should create an instance', () => {
    const directive = new HighligthDirective(new ElementRef(document.createElement('p')));
    expect(directive).toBeTruthy();
  });

  it('should have gray background', () => {
    const element = new ElementRef(document.createElement('p'))
    const directive = new HighligthDirective(element);
    expect(element.nativeElement.style.backgroundColor).toBe('gray');
  });

  it('should have yellow background', () => {
    const element = new ElementRef(document.createElement('p'))
    const directive = new HighligthDirective(element);
    directive.bgColor = 'yellow';
    // fixture.detectChanges();
    expect(element.nativeElement.style.backgroundColor).toBe('yellow');
  });

  describe('integration test for directive', () => {
    it('should have 3 elements with highligth directive', () => {
      // Arrange
      const elements = fixture.debugElement.queryAll(By.directive(HighligthDirective));
      // Act
      // Assert
      expect(elements.length).toBe(3);
    });

    it('should have default color highligth ', () => {
      // Arrange
      const elementDebug = fixture.debugElement.query(By.css('[data-testid="default-directive"]'));
      const element = elementDebug.nativeElement as HTMLHeadingElement;
      // Act
      // Assert
      expect(element.style.backgroundColor).toBe('gray');
    });
    it('should have default yellow highligth ', () => {
      // Arrange
      const elementDebug = fixture.debugElement.query(By.css('[data-testid="yellow-directive"]'));
      const element = elementDebug.nativeElement as HTMLHeadingElement;
      // Act
      // Assert
      expect(element.style.backgroundColor).toBe('yellow');
    });

    it('should have dinamic highligth ', () => {
      // Arrange
      const inputDebug = fixture.debugElement.query(By.css('[data-testid="input-color"]'));
      const inputEle = inputDebug.nativeElement as HTMLInputElement;
      const elementDebug = fixture.debugElement.query(By.css('[data-testid="dynamic-directive"]'));
      const directive = elementDebug.injector.get(HighligthDirective);

      const element = elementDebug.nativeElement as HTMLHeadingElement;
      expect(element.style.backgroundColor).toBe('rgb(255, 0, 0)');
      inputEle.value = '#ff00ff';
      inputEle.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      expect(element.style.backgroundColor).toBe('rgb(255, 0, 255)')
    });
  })

  describe('test for dynamic pipe', () => {
    it('should reverse any word', () => {
      const inputDebug = fixture.debugElement.query(By.css('[data-testid="pipe-input"]'));
      const wordDebug = fixture.debugElement.query(By.css('[data-testid="pipe-word"]'));
      const wordEle = wordDebug.nativeElement as HTMLParagraphElement;
      const inputEle = inputDebug.nativeElement as HTMLInputElement;
      inputEle.value = 'ROMA';
      inputEle.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      expect(wordEle.textContent).toBe('AMOR');
    })
  });
});
