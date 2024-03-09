import {TestBed} from '@angular/core/testing';

import {AuthService} from './auth.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {User} from '../interfaces/user.interface';
import {environments} from '../../../environments/environments';

describe('AuthService', () => {
  let cut: AuthService;
  let httpMock: HttpTestingController;

  const basePath: string = environments.baseUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });

    httpMock = TestBed.inject(HttpTestingController);
    cut = TestBed.inject(AuthService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(cut).toBeTruthy();
  });

  describe('login', () => {
    it('should return undefined if the users is not found', () => {
      cut.login('test@test.com', 'pw').subscribe(user => {
        expect(user).toBeUndefined();
      });

      const req = httpMock.expectOne(`${basePath}/users/1`);
      expect(req.request.method).toEqual('GET');
      req.flush({}, { status: 400, statusText: 'Bad Request' });
    });

    it('should login the user', () => {
      const mockUser: User = {
        id: 1,
        email: 'test@test.com',
        usuario: 'test'
      }
      const localStorageSetItemSpy = spyOn(window.localStorage, 'setItem');

      cut.login('test@test.com', 'pw').subscribe(user => {
          expect(cut.currentUser).toBeDefined();
          expect(cut.currentUser).toEqual(user);
      });

      const req = httpMock.expectOne(`${basePath}/users/1`);
      expect(req.request.method).toEqual('GET');
      req.flush(mockUser);
      expect(localStorageSetItemSpy).toHaveBeenCalledWith('token', `${mockUser.id}`);
    });
  });

  describe('logout', () => {
    it('should logout the user', () => {
      cut['user'] = { id: 1 } as User;
      expect(cut.currentUser).toBeDefined();
      const localStorageClearSpy = spyOn(window.localStorage, 'clear');

      cut.logout();

      expect(cut.currentUser).toBeUndefined();
      expect(localStorageClearSpy).toHaveBeenCalledTimes(1);
    });
  })

  describe('checkAuthentication', () => {
    it('should return true if the user is authenticated', () => {
      spyOn(window.localStorage, 'getItem').and.callFake((key: string) => '1');

      cut.checkAuthentication().subscribe(auth => {
        expect(auth).toBeTruthy();
      });

      const req = httpMock.expectOne(`${basePath}/users/1`);
      expect(req.request.method).toEqual('GET');
      req.flush(true);
    });

    it('should return false if there is not a token in localStorage', () => {
      spyOn(window.localStorage, 'getItem').and.callFake((key: string) => null);

      cut.checkAuthentication().subscribe(auth => {
        expect(auth).toBeFalsy();
      });
    });

    it('should return false if the user is not found for the given token', () => {
      spyOn(window.localStorage, 'getItem').and.callFake((key: string) => '1');

      cut.checkAuthentication().subscribe(auth => {
        expect(auth).toBeFalsy();
      })

      const req = httpMock.expectOne(`${basePath}/users/1`);
      expect(req.request.method).toEqual('GET');
      req.flush(false, { status: 404, statusText: 'Bad Request' });
    });
  });
});

