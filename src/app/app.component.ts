import { Component, OnInit } from '@angular/core';
import { Calculator } from './calculator';
import { Person } from './models/person.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent implements OnInit{

  title = 'ng-testing-services';

  ngOnInit(): void {
    const calculator = new Calculator();
    const rta = calculator.multiply(4,9);
    const person = new Person('juan','osorio',23,65,172);
  }
}
