import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { getEmail, getName, getRegisterResponse, getUserRegister } from 'src/app/models/user.mock';
import { User } from 'src/app/models/user.model';
import { UsersService } from 'src/app/services/users.service';
import { environment } from 'src/environments/environment';
import { asyncData, getText, mockObservable, queryById, setInputValue } from 'src/testing';

import { RegisterFormComponent } from './register-form.component';

fdescribe('RegisterFormComponent', () => {
  let component: RegisterFormComponent;
  let fixture: ComponentFixture<RegisterFormComponent>;
  let userService: jasmine.SpyObj<UsersService>;
  let httpController: HttpTestingController;
  beforeEach(async () => {
    const spy = jasmine.createSpyObj('UsersService',['create']);
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
    component.form.patchValue({...getUserRegister(false, true)});
    expect(component.form.invalid).toBeTruthy();
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
});
