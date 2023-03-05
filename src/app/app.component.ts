import { Component, OnInit } from '@angular/core';
import { Calculator } from './calculator';

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
  }
}
