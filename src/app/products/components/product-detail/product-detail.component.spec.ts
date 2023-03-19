import { Location } from '@angular/common';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { generateOneProduct } from 'src/app/models/product.mock';
import { Product } from 'src/app/models/product.model';
import { ProductsService } from 'src/app/services/product.service';
import { ActivatedRouteStub, asyncData, getText, mockObservable, queryById } from 'src/testing';

import { ProductDetailComponent } from './product-detail.component';

describe('ProductDetailComponent', () => {
  let component: ProductDetailComponent;
  let fixture: ComponentFixture<ProductDetailComponent>;
  let route: ActivatedRouteStub;
  let productService: jasmine.SpyObj<ProductsService>;
  let location: jasmine.SpyObj<Location>;
  beforeEach(async () => {
    const routeStub = new ActivatedRouteStub();
    const productSpy = jasmine.createSpyObj('ProductsService', ['getOne']);
    const locationSpy = jasmine.createSpyObj('Location', ['back']);
    await TestBed.configureTestingModule({
      declarations: [ ProductDetailComponent ],
      imports: [
        RouterTestingModule
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: routeStub
        },
        {
          provide: ProductsService,
          useValue: productSpy
        },
        {
          provide: Location,
          useValue: locationSpy
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDetailComponent);
    component = fixture.componentInstance;
    route = TestBed.inject(ActivatedRoute) as unknown as ActivatedRouteStub;
    productService = TestBed.inject(ProductsService) as jasmine.SpyObj<ProductsService>;
    location = TestBed.inject(Location) as jasmine.SpyObj<Location>;

  });

  it('should create', () => {
    const productId = '1';
    route.setParamMap({id: productId});
    const productMock: Product = {...generateOneProduct(), id: productId};
    productService.getOne.and.returnValue(mockObservable(productMock));
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should render the product in view', () => {
    // Arrange
    const productId = '2';
    route.setParamMap({id: productId});
    const productMock: Product = {...generateOneProduct(), id: productId};
    productService.getOne.and.returnValue(mockObservable(productMock));
    fixture.detectChanges();
    // Act
    const title = getText(fixture, 'detail-product-title');
    const price = getText(fixture, 'detail-product-price');
    expect(title).toBe(productMock.title);
    expect(price).toContain(productMock.price.toString());
    expect(productService.getOne).toHaveBeenCalled()
  });
  it('should go back', () => {
    route.setParamMap({id: null});
    fixture.detectChanges();
    expect(location.back).toHaveBeenCalled()
  })
  it('should loading to success', fakeAsync(() => {
    const productId = '3';
    route.setParamMap({id: productId});
    const productMock = {...generateOneProduct(), id: productId};
    productService.getOne.and.returnValue(asyncData(productMock));
    fixture.detectChanges();
    expect(component.status).toBe('loading');
    tick();
    fixture.detectChanges();
    expect(component.status).toBe('success');
  }));
  it('should render query param type', () => {
    const productId = '3';
    route.setParamMap({id: productId});
    route.setQueryParamMap({type: 'admin'})
    const productMock = {...generateOneProduct(), id: productId};
    productService.getOne.and.returnValue(mockObservable(productMock));
    fixture.detectChanges()

    const text = getText(fixture, 'type');
    expect(text).toContain('admin');
  })
});
