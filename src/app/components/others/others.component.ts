import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { ProductsService } from 'src/app/services/product.service';

@Component({
  selector: 'app-others',
  templateUrl: './others.component.html',
  styles: [
  ]
})
export class OthersComponent implements OnInit {
  public color;
  public word;
  products: Product[];

  constructor(
    private _productService: ProductsService
  ) {
    this.products = [];
    this.word = '';
    this.color = '#ff0000';
  }

  ngOnInit(): void {
    this._productService.getAll().subscribe({
      next: (val) => {
        this.products = val;
      }
    })
  }

  xd(event: any){
    console.log(event)
  }
}
