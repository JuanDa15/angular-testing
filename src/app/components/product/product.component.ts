import { Component, OnInit, Input } from '@angular/core';
import { Product } from 'src/app/models/product.model';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styles: [
  ]
})
export class ProductComponent implements OnInit {

  constructor() { }

  @Input() product!: Product;

  ngOnInit(): void {
  }

}
