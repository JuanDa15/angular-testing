import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-others',
  templateUrl: './others.component.html',
  styles: [
  ]
})
export class OthersComponent implements OnInit {
  public color;
  public word;
  constructor() {
    this.word = '';
    this.color = '#ff0000';
  }

  ngOnInit(): void {
  }

  xd(event: any){
    console.log(event)
  }
}
