import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { fakeActivatedStateSnapshot, fakeParamMap, fakeRouterStateSnapshot, mockObservable } from 'src/testing';
import { getRegisterResponse } from '../models/user.mock';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';

import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let tokenService: jasmine.SpyObj<TokenService>;
  let router: jasmine.SpyObj<Router>;
  beforeEach(() => {
    const tokenServiceSpy = jasmine.createSpyObj('TokenService', ['getToken']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const authSpy = jasmine.createSpyObj('AuthService', ['getUser'])
    TestBed.configureTestingModule({
      imports: [

      ],
      providers: [
        { provide: TokenService, useValue: tokenServiceSpy },
        {
          provide: AuthService,
          useValue: authSpy
        },
        { provide: Router, useValue: routerSpy },
      ]
    });
    guard = TestBed.inject(AuthGuard);
    tokenService = TestBed.inject(TokenService) as jasmine.SpyObj<TokenService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return true', (doneFn) => {
    const activeRoute = fakeActivatedStateSnapshot({
      params: {
        idProduct: '1212'
      },
      data: {
        idProduct: '123'
      },
      queryParams: {
        idProduct: '123'
      },
      paramMap: fakeParamMap({
        idProduct: '123'
      })
    });
    const state = fakeRouterStateSnapshot({});
    authService.getUser.and.returnValue(mockObservable(getRegisterResponse('admin')));

    guard.canActivate(
      activeRoute,
      state
    ).subscribe({
      next: (val) => {
        expect(val).toBeTruthy();
        doneFn();
      }
    })
  })

  it('should return false', (doneFn) => {
    const activeRoute = fakeActivatedStateSnapshot({
      params: {
        idProduct: '1212'
      },
      data: {
        idProduct: '123'
      },
      queryParams: {
        idProduct: '123'
      },
      paramMap: fakeParamMap({
        idProduct: '123'
      })
    });
    const state = fakeRouterStateSnapshot({});
    authService.getUser.and.returnValue(mockObservable(null));

    guard.canActivate(
      activeRoute,
      state
    ).subscribe({
      next: (val) => {
        expect(val).toBeFalsy();
        expect(router.navigate).toHaveBeenCalledWith(['/'])
        doneFn();
      }
    })
  })


  it('should return false with idProduct params', (doneFn) => {
    const activeRoute = fakeActivatedStateSnapshot({
      params: {
        idProduct: '1212'
      },
      data: {
        idProduct: '123'
      },
      queryParams: {
        idProduct: '123'
      },
      paramMap: fakeParamMap({
        idProduct: '123'
      })
    });
    const state = fakeRouterStateSnapshot({});
    authService.getUser.and.returnValue(mockObservable(null));

    guard.canActivate(
      activeRoute,
      state
    ).subscribe({
      next: (val) => {
        expect(val).toBeFalsy();
        expect(router.navigate).toHaveBeenCalledWith(['/'])
        doneFn();
      }
    })
  })
});
