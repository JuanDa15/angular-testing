import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Person } from 'src/app/models/person.model';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styles: [
  ]
})
export class PersonComponent implements OnInit {

  public imc:string = '';

  @Input() person!: Person;

  @Output() onSelected: EventEmitter<Person>;

  constructor() {
    this.onSelected = new EventEmitter();
  }

  ngOnInit(): void {
  }

  public calcImc(): void {
    this.imc = this.person.calcIMC();
  }

  public emit(): void {
    this.onSelected.emit(this.person);
  }

}
