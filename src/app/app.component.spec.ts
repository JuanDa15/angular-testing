import { Component, DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { queryAllByDirective, RouterLinkDirectiveStub } from 'src/testing';
import { AppComponent } from './app.component';

// PARA SOLUCIONAR EL MENSAJE DE QUE NO SE ENCUENTRA UN ELEMENTO
// HAY 3 FORMAS

// 1 - MANDAR EL COMPONENTE DIRECTAMENTE A LOS DECLARATIONS DEL TESTING MODULE
//  Desventajas: si los componentes anidados tienen mucha logica se p
// puede complicar el moking

// 2 - agregar la opcion en schemas
//  schemas: [NO_ERRORS_SCHEMA]

// 3 - CREAR UN COMPONENTE SUSTITUTO

@Component({
  selector: 'app-banner'
})
class BannerComponentStub {}
@Component({
  selector: 'app-footer'
})
class FooterComponentStub {}

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        AppComponent,
        RouterLinkDirectiveStub,
        BannerComponentStub,
        FooterComponentStub
      ],
      // schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    fixture.detectChanges();
  })

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('should render 7 links', () => {
    const links = queryAllByDirective(fixture, RouterLinkDirectiveStub);
    expect(links.length).toBe(7)
  })
  it('should render 7 links with match routes', () => {
    const links = queryAllByDirective(fixture, RouterLinkDirectiveStub);
    const routerLinks = links.map(link => link.injector.get(RouterLinkDirectiveStub));
    expect(links.length).toBe(7);
    expect(routerLinks[0].linkParams).toBe('/');
    expect(routerLinks[1].linkParams).toBe('/person')

  })
});
