import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/models/product.model';
import { ProductsService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styles: [
  ]
})
export class ProductDetailComponent implements OnInit {
  typeCustomer: string | null = null;
  status: 'init' | 'loading' | 'success' | 'error';
  product: Product | null = null;
  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private location: Location
  ) {
    this.status = 'init';
   }

  ngOnInit(): void {
    this.route.paramMap
      .subscribe((params) => {
        const productId = params.get('id');
        if (productId) {
          this.getProductDetail(productId);
        } else {
          this.goToBack();
        }
      });
      this.route.queryParamMap.subscribe(params => {
        this.typeCustomer = params.get('type');
      })
  }

  private getProductDetail(productId: string) {
    this.status = 'loading';
    this.productsService.getOne(productId)
    .subscribe({
      next: (product) => {
        this.status = 'success';
        this.product = product;
      },
      error: () => {
        this.status = 'error';
        this.goToBack();
      }
    })
  }

  goToBack() {
    this.location.back();
  }

}
