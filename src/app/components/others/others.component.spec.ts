import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { generateManyProducts } from 'src/app/models/product.mock';
import { ReversePipe } from 'src/app/pipes/reverse.pipe';
import { ProductsService } from 'src/app/services/product.service';
import { mockObservable } from 'src/testing';

import { OthersComponent } from './others.component';

describe('OthersComponent', () => {
  let component: OthersComponent;
  let fixture: ComponentFixture<OthersComponent>;
  let productService: jasmine.SpyObj<ProductsService>;
  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ProductsService', ['getAll']);
    await TestBed.configureTestingModule({
      declarations: [ OthersComponent, ReversePipe ],
      providers: [
        {
          provide: ProductsService,
          useValue: spy
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OthersComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductsService) as jasmine.SpyObj<ProductsService>;
    productService.getAll.and.returnValue(mockObservable(generateManyProducts(10)));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
