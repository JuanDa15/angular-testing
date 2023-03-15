import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { getEmail, getName, getUserRegister } from 'src/app/models/user.mock';
import { UsersService } from 'src/app/services/users.service';
import { getText, queryById, setInputValue } from 'src/testing';

import { RegisterFormComponent } from './register-form.component';

fdescribe('RegisterFormComponent', () => {
  let component: RegisterFormComponent;
  let fixture: ComponentFixture<RegisterFormComponent>;
  let userService: jasmine.SpyObj<UsersService>;
  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService',['create']);
    await TestBed.configureTestingModule({
      declarations: [ RegisterFormComponent ],
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule
      ],
      providers: [
        {
          provider: UsersService,
          useValue: userServiceSpy
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterFormComponent);
    component = fixture.componentInstance;
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
});
