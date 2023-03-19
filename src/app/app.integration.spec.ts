import { Component, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { Router, RouterLink, RouterLinkWithHref } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { asyncData, clickElement, getText, mockObservable, query, queryAllByDirective } from "src/testing";
import { AppComponent } from "./app.component";
import { routes } from './app-routing.module';
import { AppModule } from "./app.module";
import { ProductsService } from "./services/product.service";
import { generateManyProducts } from "./models/product.mock";
import { AuthService } from "./services/auth.service";
import { getRegisterResponse } from "./models/user.mock";

@Component({
  selector: 'app-pico'
})
class PicoPreviewComponentStub {}
@Component({
  selector: 'app-person'
})
class PeopleComponentStub {}
@Component({
  selector: 'app-others'
})
class OthersComponentStub {}

const routes2 = [
  {
    path: 'pico-preview',
    component: PicoPreviewComponentStub
  },
  {
    path: 'person',
    component: PeopleComponentStub
  },
  {
    path: 'others',
    component: OthersComponentStub
  }
]

describe('App integration test', () => {

  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;
  let router: Router;
  let productsService: jasmine.SpyObj<ProductsService>;
  let authService: jasmine.SpyObj<AuthService>;
  beforeEach(async () => {
    const productSpy = jasmine.createSpyObj('ProductsService', ['getAll']);
    const authSpy = jasmine.createSpyObj('AuthService', ['getUser']);
    await TestBed.configureTestingModule({
      imports: [
        AppModule,
        RouterTestingModule.withRoutes(routes)
      ],
      declarations: [
        AppComponent
      ],
      providers: [
        {
          provide: ProductsService,
          useValue: productSpy
        },
        {
          provide: AuthService,
          useValue: authSpy
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(fakeAsync(() => {
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    router = TestBed.inject(Router);
    productsService = TestBed.inject(ProductsService) as jasmine.SpyObj<ProductsService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router.initialNavigation();
    tick(); // wait for the router to be initialized
    fixture.detectChanges();
  }))


  it('should be created', () => {
    expect(app).toBeTruthy();
  })

  it('should there 7 routerLinks', () => {
    const links = queryAllByDirective(fixture, RouterLinkWithHref);
    expect(links.length).toBe(7)
  });

  it('should render others component when click', fakeAsync(() => {
    authService.getUser.and.returnValue(mockObservable(getRegisterResponse('admin')));
    const productsMock = generateManyProducts(10);
    productsService.getAll.and.returnValue(mockObservable(productsMock));
    clickElement(fixture, 'others-component', true);
    tick();  //NAVIGATION
    fixture.detectChanges(); //NGONINIT OTHERS COMPONENT
    expect(router.url).toEqual('/others');
    const element = query(fixture, 'app-others');
    expect(element).not.toBeNull();
    const text = getText(fixture, 'products-length');
    expect(text).toContain(productsMock.length.toString());
  }))

  it('should render Pico-PreviewComponent when clicked', fakeAsync(() => {
    clickElement(fixture, 'pico-link', true);
    tick(); // wait while nav...
    fixture.detectChanges(); // ngOnInit - PicoPreviewComponent
    expect(router.url).toEqual('/pico-preview');
    const element = query(fixture, 'app-pico-preview');
    expect(element).not.toBeNull();
  }));
  it('should redirect to home without session', fakeAsync(() => {
    authService.getUser.and.returnValue(mockObservable(null));
    const productsMock = generateManyProducts(10);
    productsService.getAll.and.returnValue(mockObservable(productsMock));
    clickElement(fixture, 'others-component', true);
    tick();  //NAVIGATION
    fixture.detectChanges(); //NGONINIT OTHERS COMPONENT
    expect(router.url).toEqual('/');
  }))
});
