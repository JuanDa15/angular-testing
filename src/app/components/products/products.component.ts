import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { ProductsService } from 'src/app/services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styles: [`
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      grid-template-rows: auto;
      gap: 1;
    }
  `]
})
export class ProductsComponent implements OnInit {

  products: Product[];

  constructor(
    private _productService: ProductsService
  ) {
    this.products = [];
  }

  ngOnInit(): void {
    this._productService.getAllSimple().subscribe({
      next: (val) => {
        this.products = val;
      }
    })
  }

}
