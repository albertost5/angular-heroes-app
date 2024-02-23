import {TestBed} from '@angular/core/testing';

import {HeroesService} from './heroes.service';
import {Hero} from '../interfaces/hero.interface';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {environments} from '../../../environments/environments';

describe('HeroesService', () => {
  let cut: HeroesService;
  let httpMock: HttpTestingController;

  const basePath: string = environments.baseUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HeroesService]
    });
    cut = TestBed.inject(HeroesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(cut).toBeTruthy();
  });

  describe('getHeroes',() => {
    const heroesMock: Hero[] = [
      {
        id: "1",
        name: 'hero1'
      } as unknown as Hero,
      {
        id: "2",
        name: 'hero2'
      } as unknown as Hero
    ];

    it('should return all heroes', () => {
      cut.getHeroes().subscribe(heroes => {
        expect(heroes.length).toBe(2);
        expect(heroes).toEqual(heroesMock);
      });

      const req = httpMock.expectOne(`${basePath}/heroes`);

      expect(req.request.method).toBe('GET');
      req.flush(heroesMock);
    });
  });

  describe('getHero', () => {
    it('should return null for a wrong id param', () => {
      cut.getHero('test').subscribe(hero => {
        expect(hero).toBeNull();
      });

      const req = httpMock.expectOne(`${basePath}/heroes/test`);
      expect(req.request.method).toEqual('GET');
      req.flush(null);
    });

    it('should return an hero for a correct id param', () => {
      const heroMock = {
        id: '1',
        superhero: 'test'
      } as Hero;

      cut.getHero('test').subscribe(hero => {
        expect(hero).toBe(heroMock);
      });

      const req = httpMock.expectOne(`${basePath}/heroes/test`);
      expect(req.request.method).toEqual('GET');
      req.flush(heroMock);
    })
  });
});
