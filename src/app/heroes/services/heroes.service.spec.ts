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
        console.log({heroes})
        expect(heroes.length).toBe(2);
        expect(heroes).toEqual(heroesMock);
      });

      const req = httpMock.expectOne(`${basePath}/heroes`);

      expect(req.request.method).toBe('GET');
      req.flush(heroesMock);
    });
  });
});
