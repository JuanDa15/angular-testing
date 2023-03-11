import { HttpStatusCode, HTTP_INTERCEPTORS } from "@angular/common/http";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { environment } from "src/environments/environment";
import { TokenInterceptor } from "../interceptors/token.interceptor";
import { generateManyProducts, generateOneProduct } from "../models/product.mock";
import { CreateProductDTO, Product } from "../models/product.model";
import { ProductsService } from "./product.service";
import { TokenService } from "./token.service";

describe('ProductService', () => {

  let productService: ProductsService;
  let httpController: HttpTestingController;
  let tokenService: TokenService;
  beforeEach(() => {
    // Create the spy
    TestBed.configureTestingModule({
      imports: [
        // Could be a solution, but angular has an specific testing module
        // HttpClientModule
        HttpClientTestingModule
      ],
      providers: [
        ProductsService,
        TokenService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TokenInterceptor,
          multi: true
        }
      ],
    });
    tokenService = TestBed.inject(TokenService);
    productService = TestBed.inject(ProductsService);
    httpController = TestBed.inject(HttpTestingController);
  })

  afterEach(() => {
    // httpController.verify();
  })

  it('should be created', () => {
    expect(productService).toBeTruthy()
  })

  describe('test for get all simple', () => {
    it('Should return a product list', (doneFn) => {
      // Arrange
      // mockData: simulate the data that is returned for the server
      const mockData: Product[] = [...generateManyProducts(3)]
      // Act
      productService.getAllSimple().subscribe({
        next: (val) => {
          // Assert
          expect(val).toBe(mockData);
          doneFn()
        }
      });

      // http config
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
      httpController.verify();
    });
    it('Should return a product list with token', (doneFn) => {
      // Arrange
      // mockData: simulate the data that is returned for the server
      const mockData: Product[] = [...generateManyProducts(3)];
      spyOn(tokenService, 'getToken').and.returnValue('123');
      // Act
      productService.getAllSimple().subscribe({
        next: (val) => {
          // Assert
          expect(val).toBe(mockData);
          doneFn()
        }
      });

      // http config
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
      const headers = req.request.headers;
      expect(headers.get('Authorization')).toBe('Bearer 123');
      httpController.verify();
    })
  });

  describe('test for get all', () => {
    it('should return a product list', (doneFn) => {
      // Arrange
      const mockData: Product[] = generateManyProducts(3);
      // Act
      productService.getAll().subscribe({
        next: (val) => {
          // Assert
          expect(val.length).toBe(mockData.length)
          doneFn();
        }
      });

      // http config
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
      httpController.verify();
    });

    it('Should return product list with taxes', (doneFn) => {
      // Arrange
      const mockData: Product[] = [
        {
          ...generateOneProduct(),
          price: 100, //100*0.19 = 19
        },
        {
          ...generateOneProduct(),
          price: 200, // 200*0.19 = 38
        }
      ]
      // Act
      productService.getAll().subscribe({
        next: (val) => {
          // Assert
          expect(val[0].taxes).toBe(19);
          doneFn()
        }
      })

      // http config
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
      httpController.verify();
    })
    it('should not return negative taxes', (doneFn) => {
       // Arrange
       const mockData: Product[] = [
        {
          ...generateOneProduct(),
          price: 100, //100*0.19 = 19
        },
        {
          ...generateOneProduct(),
          price: -200, // -200*0.19 = 0
        }
      ]
      // Act
      productService.getAll().subscribe({
        next: (val) => {
          // Assert
          expect(val[1].taxes).toBe(0);
          doneFn()
        }
      })
      // http config
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
      httpController.verify();
    });

    it('should send params with limit 10 and offset 2', (doneFn) => {
      // Arrange
      const mockData = generateManyProducts(3);
      const limit = 10;
      const offset = 2;
      //Act
      productService.getAll(limit, offset).subscribe({
        next: (val) => {
          expect(val.length).toEqual(mockData.length)
          doneFn();
        }
      })
      // http config
      const url = `${environment.API_URL}/api/v1/products?limit=${limit}&offset=${offset}`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
      const params = req.request.params;
      expect(params.get('limit')).toEqual(limit.toString());
      expect(params.get('offset')).toEqual(offset.toString());
      httpController.verify();
    })
  });

  describe('test for create', () => {
    it('should return a new product', (doneFn) => {
      // Arrange
      const mockData = generateOneProduct()
      const dto: CreateProductDTO = {
        ...mockData,
        categoryId: 1
      }
      // Act
      productService.create({...dto}).subscribe({
        next: (val) => {
          // Assert
          expect(val).toEqual(mockData)
          doneFn();
        }
      })
      // http config
      const url = `${environment.API_URL}/api/v1/products`;
      const req = httpController.expectOne(url);
      req.flush(mockData);
      expect(req.request.body).toEqual(dto);
      expect(req.request.method).toEqual('POST');
      httpController.verify();
    })
  })

  describe('test for update', () => {
    it('should update the title', (doneFn) => {
      // Arrange
      const id = '1';
      const dto = {
        title: 'Red car'
      }
      const product = generateOneProduct();
      // Act
      productService.update(id, {...dto}).subscribe({
        next: (val) => {
          // Assert
          expect(val).toEqual({...product, ...dto});
          doneFn()
        }
      })
      // http config
      const url = `${environment.API_URL}/api/v1/products/${id}`;
      const req = httpController.expectOne(url);
      req.flush({...product, ...dto});
      // expect(req.request.body).toEqual(dto);
      expect(req.request.method).toEqual('PUT');
      httpController.verify();
    })
  });

  describe('test for delete', () => {
    it('should delete the element', (doneFn) => {
    // Arrange
    const id = '1';

    // Act
    productService.delete(id).subscribe({
      next:(val) => {
        expect(val).toBe(true);
        doneFn();
      },
    })
    // Assert
    const url = `${environment.API_URL}/api/v1/products/${id}`;
    const req = httpController.expectOne(url);
    req.flush(true);
    expect(req.request.method).toBe('DELETE');
    httpController.verify();
    });
  });

  describe('test for get one', () => {
    it('should return a product', (doneFn) => {
      // Arrange
      const id = '1';
      const mockData = generateOneProduct();
      // Act
      productService.getOne(id).subscribe({
        next:(val) => {
          // Assert
          expect(val).toEqual(mockData);
          doneFn();
        }
      });
      // http config
      const url = `${environment.API_URL}/api/v1/products/${id}`
      const req = httpController.expectOne(url);
      req.flush(mockData);
      httpController.verify();
    });

    it('should return "El producto no existe"', (doneFn) => {
      // Arrange
      const id = '1';
      const msgError = '404 msg';
      const mockError = {
        status: HttpStatusCode.NotFound,
        statusText: msgError
      }
      // Act
      productService.getOne(id).subscribe({
        next:(val) => {
          doneFn();
        },
        error: (err) => {
          expect(err).toEqual(new Error('El producto no existe'));
          doneFn();
        }
      })
      // Assert
      const url = `${environment.API_URL}/api/v1/products/${id}`;
      const req = httpController.expectOne(url);
      req.flush(msgError, mockError);
      httpController.verify();
    });
  });
})
