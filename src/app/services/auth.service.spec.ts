import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';

import { AuthService } from './auth.service';
import { TokenService } from './token.service';

describe('AuthService', () => {
  let service: AuthService;
  let tokenService: TokenService;
  let httpController: HttpTestingController
  beforeEach(() => {
    const tokenSpy = jasmine.createSpyObj('TokenService', ['getToken','saveToken','removeToken']);
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        {
          provide: TokenService,
          useValue: tokenSpy
        }
      ]
    });
    service = TestBed.inject(AuthService);
    httpController = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(TokenService);
  });

  afterEach(() => {
    httpController.verify();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Test for login', () => {
    it('should return a token', (doneFn) => {
      // Arrange
      const email = 'test@email.com';
      const password = '123456789';
      const token = {
        access_token: '123'
      };
      // Act
      service.login(email, password).subscribe({
        next: (val) => {
          expect(tokenService.saveToken).toHaveBeenCalledWith(val.access_token);
          expect(val).toBe(token);
          doneFn();
        }
      })
      // Assert
      const url = `${environment.API_URL}/api/v1/auth/login`;
      const req = httpController.expectOne(url);
      req.flush(token);
      httpController.verify();
    });
  })
});
