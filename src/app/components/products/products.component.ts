import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { ProductsService } from 'src/app/services/product.service';
import { ValueService } from 'src/app/services/value.service';

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
  public limit;
  public offset;
  public status: 'loading'|'success'|'error'|'init';
  public rta: string;
  products: Product[];

  constructor(
    private _productService: ProductsService,
    private _valueService: ValueService
  ) {
    this.status = 'init';
    this.offset = 0;
    this.limit = 10;
    this.products = [];
    this.rta = '';
  }

  ngOnInit(): void {
    this.getProducts();
  }

  public getProducts() {
    this.status = 'loading';
    this._productService.getAll(this.limit, this.offset).subscribe({
      next: (val) => {
        this.status = 'success';
        this.offset += this.limit;
        this.products = [...this.products, ...val];
      },
      error: () => {
        setTimeout(() => {
          this.products = [];
          this.status = 'error';
        }, 3000)
      }
    })
  }

  public async callPromise(){
    const rta = await this._valueService.getPromiseValue();
    this.rta = rta;
  }
}
