import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { generateManyProducts } from 'src/app/models/product.mock';
import { ProductsService } from 'src/app/services/product.service';
import { ProductComponent } from '../product/product.component';
import { of, defer } from "rxjs";
import { ProductsComponent } from './products.component';
import { By } from '@angular/platform-browser';
import { ValueService } from 'src/app/services/value.service';

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let productService: jasmine.SpyObj<ProductsService>;
  let valueService: jasmine.SpyObj<ValueService>;
  beforeEach(async () => {
    // Crear spy
    const productsSpy = jasmine.createSpyObj('ProductsService',['getAll']);
    const valueSpy = jasmine.createSpyObj('ValueService',['getPromiseValue'])
    await TestBed.configureTestingModule({
      declarations: [
        ProductsComponent,
        ProductComponent
      ],
      providers: [
        {
          provide: ProductsService,
          useValue: productsSpy
        },
        {
          provide: ValueService,
          useValue: valueSpy
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    // Injectar el servicio
    productService = TestBed.inject(ProductsService)as jasmine.SpyObj<ProductsService>;
    valueService = TestBed.inject(ValueService) as jasmine.SpyObj<ValueService>;
    // Generar la respuesta del servicio
    const productsMock = generateManyProducts(10);
    productService.getAll.and.returnValue(of(productsMock))

    fixture.detectChanges();
  });

  it('should create', () => {
    // Generar la respuesta del servicio
    // const productsMock = generateManyProducts(4);
    // productService.getAll.and.returnValue(of(productsMock))

    // fixture.detectChanges()
    expect(component).toBeTruthy();
  });


  describe('test for getAllProducts', () => {
    it('should call getAll', () => {
      // Generar la respuesta del servicio
      // const productsMock = generateManyProducts(4);
      // productService.getAll.and.returnValue(of(productsMock))

      // fixture.detectChanges()
      expect(productService.getAll).toHaveBeenCalledTimes(1);
    });
    it('should return a product list from service', () => {
      // Arrange
      const productsMock = generateManyProducts(10);
      productService.getAll.and.returnValue(of(productsMock));
      const prevProducts = component.products.length;
      // Act
      component.getProducts();
      fixture.detectChanges();
      fixture.whenRenderingDone().then(() => {
        const productsArr = fixture.debugElement.queryAll(By.css('app-product'));
        // Assert
        expect(productsArr.length).toBe(component.products.length);
        expect(component.products.length).toBe(productsMock.length+prevProducts);
      })
    });
    /**
     * fakeAsync es una función que se utiliza en las pruebas
     * unitarias de Angular para ejecutar código sincrónico
     * de manera asincrónica.
     *
     * fakeAsync permite ejecutar el código sincrónicamente,
     * pero avanza el reloj del temporizador de manera
     * controlada utilizando el método tick De esta manera,
     * puedes verificar el estado del código después de
     * que se haya ejecutado el temporizador.
     */
    it('should change status "loading" to "success"', fakeAsync(() => {
      // Arrange
      const productMocks = generateManyProducts(10);
      productService.getAll.and.returnValue(defer(()=> Promise.resolve(productMocks)));
      // Act
      component.getProducts();
      fixture.detectChanges();
      expect(component.status).toEqual('loading');
      tick(); // EJECUTA TODO LO QUE ESTE PENDIENTE POR RESOLVER ASYNC
      fixture.detectChanges();
      // Assert
      expect(component.status).toEqual('success');
    }));

    it('should change status "loading" to "error"', fakeAsync(() => {
      // Arrange
      productService.getAll.and.returnValue(defer(() => Promise.reject('error')))
      // Act
      component.getProducts();
      fixture.detectChanges();

      expect(component.status).toBe('loading');
      tick(4000);
      fixture.detectChanges();

      expect(component.status).toBe('error');
    }));
  });

  describe('call promise', () => {
    it('should return promise value',async() => {
      // Arrange
      const valueToTest = 'hello juan';
      // valueService.getPromiseValue.and.callFake(() => Promise.resolve(valueToTest));
      valueService.getPromiseValue.and.returnValue(Promise.resolve(valueToTest));
      await component.callPromise();
      fixture.detectChanges();
      // Assert
      expect(valueService.getPromiseValue).toHaveBeenCalled();
      expect(component.rta).toBe(valueToTest);
    });
    it('should render promise response in template', fakeAsync(() => {
      // Arrange
      const valueToTest = 'hello juan';
      // valueService.getPromiseValue.and.callFake(() => Promise.resolve(valueToTest));
      valueService.getPromiseValue.and.returnValue(Promise.resolve(valueToTest));
      const btnDebug = fixture.debugElement.query(By.css('[test-id="btn-promise"]'));
      const textDebug = fixture.debugElement.query(By.css('[test-id="response-promise"]'));
      const textElement = <HTMLHeadingElement>textDebug.nativeElement;
      // Act
      btnDebug.triggerEventHandler('click', null);
      // RESOLVE THE PROMISE OF THE FUNCTION
      tick();
      fixture.detectChanges();
      // Assert
      expect(valueService.getPromiseValue).toHaveBeenCalled();
      expect(textElement.textContent).toContain(valueToTest);
    }));
  });
});
