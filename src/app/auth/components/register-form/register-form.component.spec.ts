import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { getEmail, getName, getPassword, getRegisterResponse, getUserRegister } from 'src/app/models/user.mock';
import { User } from 'src/app/models/user.model';
import { UsersService } from 'src/app/services/users.service';
import { environment } from 'src/environments/environment';
import { asyncData, asyncError, getText, mockObservable, queryById, setCheckBox, setInputValue } from 'src/testing';

import { RegisterFormComponent } from './register-form.component';

fdescribe('RegisterFormComponent', () => {
  let component: RegisterFormComponent;
  let fixture: ComponentFixture<RegisterFormComponent>;
  let userService: jasmine.SpyObj<UsersService>;
  let httpController: HttpTestingController;
  beforeEach(async () => {
    const spy = jasmine.createSpyObj('UsersService',['create', 'isAvailableByEmail']);
    await TestBed.configureTestingModule({
      declarations: [ RegisterFormComponent ],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule
      ],
      providers: [
        {
          provide: UsersService,
          useValue: spy
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterFormComponent);
    component = fixture.componentInstance;
    httpController = TestBed.inject(HttpTestingController);
    userService = TestBed.inject(UsersService) as jasmine.SpyObj<UsersService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be invalid the form', () => {
    userService.isAvailableByEmail.and.returnValue(mockObservable({isAvailable: false}));
    component.form.patchValue({...getUserRegister(false, true)});
    expect(component.form.invalid).toBeTruthy();
  });

  it('should the email field be async invalid from UI without helper', () => {
    // Arrange
    userService.isAvailableByEmail.and.returnValue(mockObservable({isAvailable: false}));
    const [debug, element] = queryById<RegisterFormComponent, HTMLInputElement>(fixture,'email');
    // Act
    element.value = getEmail();
    element.dispatchEvent(new Event('input'));
    element.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    // Assert
    const alertText = getText(fixture, 'emailField-notAvailable');
    expect(component.emailField?.invalid).toBeTruthy();
    expect(alertText).toContain("the email is already register");
  });
  it('should the email field be invalid from UI without helper', () => {
    // Arrange
    const [debug, element] = queryById<RegisterFormComponent, HTMLInputElement>(fixture,'email');
    // Act
    element.value = getName('male');
    element.dispatchEvent(new Event('input'));
    element.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    // Assert
    const alertText = getText(fixture, 'emailField-notEmail');
    expect(component.emailField?.invalid).toBeTruthy();
    expect(alertText).toContain("It's not a email");
  });
  it('should the email field be invalid from UI with helper', () => {
    setInputValue(fixture, 'email', getName('male'), true);
    fixture.detectChanges();
    // Assert
    const alertText = getText(fixture, 'emailField-notEmail');
    expect(component.emailField?.invalid).toBeTruthy();
    expect(alertText).toContain("It's not a email");
  });
  it('should create a user correctly', () => {
    userService.isAvailableByEmail.and.returnValue(mockObservable({isAvailable: true}));
    const mockUser: User = {...getRegisterResponse('admin')};
    userService.create.and.returnValue(mockObservable(mockUser));
    // Arrange
    component.form.patchValue({
      ...getUserRegister(true, true)
    });

    // Act
    component.register(new Event('submit'));
    // Assert
    expect(component.form.valid).toBeTruthy();
    expect(userService.create).toHaveBeenCalled();
    expect(userService.create).toHaveBeenCalledWith(component.form.value);
  });
  it('should send the form successfully and change "loading" to "success"', fakeAsync(() => {
    // Arrange
    userService.isAvailableByEmail.and.returnValue(mockObservable({isAvailable: true}))
    const mockUser: User = {...getRegisterResponse('admin')};
    userService.create.and.returnValue(asyncData(mockUser));
    component.form.patchValue({
      ...getUserRegister(true, true)
    });
    // Act
    component.register(new Event('submit'));
    // Assert
    expect(component.status).toBe('loading');
    tick();
    fixture.detectChanges();
    expect(component.status).toBe('success');
    expect(userService.create).toHaveBeenCalled();
    expect(userService.create).toHaveBeenCalledWith(component.form.value);
  }));
  /**
   * En Angular, triggerEventHandler es un método de la clase
   * DebugElement que se utiliza para simular el lanzamiento de un
   *  evento en un elemento del DOM durante las pruebas unitarias.
   *  Siempre y cuando dicho elemento tenga asociado el evento
   * ej:
   *  En este caso el triggerEventHandler no funcionaria ya que
   *  el boton no tiene asociado el evento click, para simular
   *  un click aca se haria con el HTMLElement.dispatchEvent('click'),
   *  ya que este si simula la acción del click desde el dom
   *  <button>Click</button>
   *
   *  En este otro caso si nos serviria el triggerEventHandler, el
   * dispatch tambien serviria en este caso
   * <button (click)="function()"> Click</button>
   *
   * Ejecutar el evento ngSubmit
   * DebugElement.triggerEventHandler('ngSubmit', new Event('submit'))
   */
  it('should complete the form from UI', fakeAsync(() => {
    // Arrange
    userService.isAvailableByEmail.and.returnValue(mockObservable({isAvailable: true}))
    spyOn(component, 'register').and.callThrough();
    const mockUser: User = {...getRegisterResponse('admin')};
    userService.create.and.returnValue(asyncData(mockUser));
    const password = getPassword(10);
    const [debSubmit, eleSubmit] = queryById<RegisterFormComponent, HTMLButtonElement>(fixture, 'submit-register');
    const [deb, ele] = queryById<RegisterFormComponent,HTMLInputElement>(fixture,'terms');
    // Act
    setInputValue(fixture, 'name', getName('female'), true);
    setInputValue(fixture, 'email', getEmail(true), true);
    setInputValue(fixture, 'password', password, true);
    setInputValue(fixture, 'confirmPassword', password, true);
    // EQUIVALEN TO SETCHECKBOX ---------------------------
    ele.checked = true;
    ele.dispatchEvent(new Event('change'));
    ele.dispatchEvent(new Event('blur'));
    // -------------------------------------
    fixture.detectChanges();
    eleSubmit.click();
    fixture.detectChanges();
    expect(component.status).toBe('loading');
    tick()
    // Assert
    expect(component.form.valid).toBeTruthy();
    expect(component.status).toBe('success');
    expect(component.register).toHaveBeenCalledTimes(1);
  }));

  it('should error the form from UI', fakeAsync(() => {
    userService.isAvailableByEmail.and.returnValue(mockObservable({isAvailable: true}))
    // Arrange
    spyOn(component, 'register').and.callThrough();
    const mockUser: User = {...getRegisterResponse('admin')};
    userService.create.and.returnValue(asyncError(new Error('500 Server error')));
    const password = getPassword(10);
    const [debSubmit, eleSubmit] = queryById<RegisterFormComponent, HTMLButtonElement>(fixture, 'submit-register');
    const [deb, ele] = queryById<RegisterFormComponent,HTMLInputElement>(fixture,'terms');
    // Act
    setInputValue(fixture, 'name', getName('female'), true);
    setInputValue(fixture, 'email', getEmail(true), true);
    setInputValue(fixture, 'password', password, true);
    setInputValue(fixture, 'confirmPassword', password, true);
    // EQUIVALEN TO SETCHECKBOX ---------------------------
    ele.checked = true;
    ele.dispatchEvent(new Event('change'));
    ele.dispatchEvent(new Event('blur'));
    // -------------------------------------
    fixture.detectChanges();
    eleSubmit.click();
    fixture.detectChanges();
    expect(component.status).toBe('loading');
    tick()
    // Assert
    expect(component.form.valid).toBeTruthy();
    expect(component.status).toBe('error');
    expect(component.register).toHaveBeenCalledTimes(1);
  }));
  it('should set match password error', () => {
    setInputValue(fixture, 'name', getName('female'), true);
    setInputValue(fixture, 'email', getEmail(true), true);
    setInputValue(fixture, 'password', getPassword(10,true), true);
    setInputValue(fixture, 'confirmPassword', getPassword(10,true), true);
    setCheckBox(fixture, 'terms', true, true);
    fixture.detectChanges();
    expect(component.form.errors?.['match_password']).toBeTruthy()
  });
  it('should password has invalid_password', () => {
    setInputValue(fixture, 'password', getPassword(10,false), true);
    fixture.detectChanges();
    expect(component.passwordField?.errors?.['invalid_password']).toBeTruthy()
  })
});
