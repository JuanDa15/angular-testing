import { DebugElement, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Person } from 'src/app/models/person.model';

import { PersonComponent } from './person.component';

describe('PersonComponent', () => {
  // Referencia al componente
  let component: PersonComponent;
  // Para interactuar con el dom
  let fixture: ComponentFixture<PersonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a <p> with text "Soy el parrafo xd"', () => {
    // Arrange
    const personElement: HTMLElement = fixture.nativeElement;
    // Act
    const pTag = personElement.querySelector('p');
    // Assert
    expect(pTag?.textContent).toEqual("Soy el parrafo xd")
  });

  it('should have a <p> with text "Soy el parrafo xd" using debug element', () => {
    // Arrange
    const personDebug: DebugElement = fixture.debugElement;
    // Act
    const pDebug = personDebug.query(By.css('[test-id="p-test"]'));
    const pTag = <HTMLParagraphElement>pDebug?.nativeElement;
    // Assert
    expect(pTag.textContent).toEqual("Soy el parrafo xd")
  });

  it('should have a <h3> with text "Hola, esto es el PersonComponent"', () => {
    // Arrange
    const h3Debug = fixture.debugElement.query(By.css('[test-id="h3-test"]'));
    const h3Tag = <HTMLHeadingElement>h3Debug.nativeElement;
    // Act
    // Assert
    expect(h3Tag.textContent).toEqual("Hola, esto es el PersonComponent")
  });

  describe('Test for input', () => {
    beforeEach(() => {
      component.person = new Person('juan david','osorio',14,65,172);
      fixture.detectChanges();
    })
    it('Should have the name juan david osorio', () => {
      // Arrange
      // Act
      // Assert
      expect(`${component.person.name} ${component.person.lastname}`).toBe('juan david osorio');
    });
    it('should render the name', () => {
      // Arrange
      const h3Debug = fixture.debugElement.query(By.css('[test-id="h3-name"]'));
      const h3Element = <HTMLHeadingElement>h3Debug.nativeElement;
      // Act
      // Assert
      expect(h3Element.textContent).toContain(`${component.person.name} ${component.person.lastname}`);
    });
    it('should render the heigth', () => {
      // Arrange
      const pDebug = fixture.debugElement.query(By.css('[test-id="p-heigth"]'));
      const pElement = <HTMLHeadingElement>pDebug.nativeElement;
      // Act
      // Assert
      expect(pElement.textContent).toContain(`${component.person.heigth}`);
    });
  });

  describe('text for click', () => {
    beforeEach(() => {
      component.person = new Person('juan david','osorio',14,65,172);
      fixture.detectChanges();
    });

    it('should calc imc when click', () => {
      // Arrange
      const expectedMessage = 'down';
      const btnDebug = fixture.debugElement.query(By.css('[test-id="imc-btn"]'));
      const btnElement = <HTMLButtonElement>btnDebug.nativeElement;
      // Act
      btnDebug.triggerEventHandler('click', {});
      fixture.detectChanges();
      // Assert
      expect(btnElement.textContent).toContain(expectedMessage);
    })
  });

  describe('test for output', () => {
    beforeEach(() => {
      component.person = new Person('juan david','osorio',14,65,172);
      fixture.detectChanges();
    });
    it('should raise onSelected event', () => {
      // Arrange
      const btnDebug = fixture.debugElement.query(By.css('[test-id="btn-emit"]'));
      const btnElement = <HTMLButtonElement>btnDebug.nativeElement;
      let selectedPerson: Person | undefined;
      component.onSelected.subscribe({
        next: (person: Person) => {
          selectedPerson = person;
        }
      })
      // Act
      btnDebug.triggerEventHandler('click', {});
      fixture.detectChanges();
      // Assert
      fixture.whenStable().then(() => {
        expect(selectedPerson).toEqual(component.person);
      })
    })
  });
});

@Component({
  selector: 'host-component',
  template: `
    <app-person
      [person]="person"
      (onSelected)="onSelected($event)"
    ></app-person>
  `
})
class HostComponent {
  public person = new Person('carlos','ortiz',84,76,146);
  public selectedPerson: Person | null;

  constructor() {
    this.selectedPerson = null;
  }

  public onSelected(event: Person): void {
    this.selectedPerson = event;
  }
}

describe('Isolate test to person component (PersonComponent from host component)', () => {
  let component: HostComponent;
  let fixture: ComponentFixture<HostComponent>;
  let componentChild: PersonComponent;
  let fixtureChild: ComponentFixture<PersonComponent>;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PersonComponent,
        HostComponent
      ]
    }).compileComponents();
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;
    fixtureChild = TestBed.createComponent(PersonComponent);
    componentChild = fixtureChild.componentInstance;
    fixture.detectChanges();
  })

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('Should create child component', () => {
    expect(componentChild).toBeTruthy();
  })

  it('Should display person name', () => {
    const expectedName = `${component.person.name} ${component.person.lastname}`;

    const h3Debug = fixture.debugElement.query(By.css('app-person [test-id="h3-name"]'));
    const h3Element = <HTMLHeadingElement>h3Debug.nativeElement;

    expect(h3Element.textContent).toContain(expectedName);
  })

  it('Should fire an event', () => {
    // Arrange
    const expectedValue = component.person;
    const btnDebug = fixture.debugElement.query(By.css('app-person [test-id="btn-emit"]'));
    const btnElement = <HTMLButtonElement>btnDebug.nativeElement;
    // Act
    btnDebug.triggerEventHandler('click', null);
    fixture.detectChanges();
    // Assert
    expect(component.selectedPerson).toEqual(expectedValue);
  })
})
