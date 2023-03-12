import { Component, OnInit } from '@angular/core';
import { Person } from 'src/app/models/person.model';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styles: [
  ]
})
export class PeopleComponent implements OnInit {
  public selectedPerson: null | Person;

  public people: Person[] = [
    new Person('carlos','alberto',64,70,168),
    new Person('nicolas','perea',64,70,168),
    new Person('ramiro','lopez',64,70,168)
  ];

  constructor() {
    this.selectedPerson = null;
  }

  ngOnInit(): void {
  }

  public onSelected(event: Person): void {
    this.selectedPerson = event; 
  }

}
