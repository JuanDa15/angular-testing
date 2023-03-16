import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Person } from 'src/app/models/person.model';
import { PersonComponent } from '../person/person.component';

import { PeopleComponent } from './people.component';

describe('PeopleComponent', () => {
  let component: PeopleComponent;
  let fixture: ComponentFixture<PeopleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PeopleComponent, PersonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PeopleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a list of persons', () => {
    // Arrange
    component.people = [
      new Person('carlos','alberto',64,70,168),
      new Person('nicolas','perea',64,70,168),
      new Person('ramiro','lopez',64,70,168)
    ];
    // Act
    fixture.detectChanges();
    const arr = fixture.debugElement.queryAll(By.css('app-person'));
    // Assert
    expect(arr.length).toBe(component.people.length);
  });

  it('should update the selectedPerson', () => {
    // Arrange
    component.people = [
      new Person('carlos','alberto',64,70,168),
      new Person('nicolas','perea',64,70,168),
      new Person('ramiro','lopez',64,70,168)
    ];
    // Act
    fixture.detectChanges();
    const arr = fixture.debugElement.queryAll(By.css('app-person'));

    const personComponentDebug = arr[2];
    const personComponentInstance = personComponentDebug.componentInstance as PersonComponent;
    const btnDebug = personComponentDebug.query(By.css('[data-testid="btn-emit"]'));
    btnDebug.triggerEventHandler('click', null);
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const nameDebug = fixture.debugElement.query(By.css('[data-testid="list-name"]'));
      const nameElement = nameDebug.nativeElement as HTMLLIElement;
      // Assert
      expect(component.selectedPerson).toEqual(personComponentInstance.person);
      expect(nameElement.textContent).toContain(`${personComponentInstance.person.name} ${personComponentInstance.person.lastname}`)
    })
  });
});
