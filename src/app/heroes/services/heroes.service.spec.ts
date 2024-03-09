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
      imports: [HttpClientTestingModule]
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

  describe('getHeroes', () => {
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

    it('should return an empty array if there is an error', () => {
      cut.getHeroes().subscribe(heroes => {
        expect(heroes.length).toBe(0);
        expect(heroes).toEqual([]);
      });

      const req = httpMock.expectOne(`${basePath}/heroes`);

      expect(req.request.method).toBe('GET');
      req.flush([]);
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

  describe('getSuggestions', () => {
    it('should return an empty array for a wrong search term', () => {
      const searchTerm: string = 'asdf';

      cut.getSuggestions(searchTerm).subscribe(heroes => {
        expect(heroes).toHaveSize(0);
      });

      const req = httpMock.expectOne(`${basePath}/heroes?q=${searchTerm}&_limit=6`);
      expect(req.request.method).toEqual('GET');
      req.flush([]);
    });

    it('should return an array of heroes for a correct search term', () => {
      const searchTerm: string = 'b';
      const heroesMock = [
        {id: '1'},
        {id: '2'},
        {id: '3'}
      ] as Hero[];

      cut.getSuggestions(searchTerm).subscribe(heroes => {
        expect(heroes).toHaveSize(3);
        expect(heroes).toEqual(heroesMock);
      });

      const req = httpMock.expectOne(`${basePath}/heroes?q=${searchTerm}&_limit=6`);
      expect(req.request.method).toEqual('GET');
      req.flush(heroesMock);
    });
  });

  describe('addHero', ()=> {
    it('should create a new hero', () => {
      const heroMock = {
        id: 'test'
      } as Hero;

      cut.addHero(heroMock).subscribe(hero => {
        expect(hero).toEqual(heroMock);
      });

      const req = httpMock.expectOne(`${basePath}/heroes`);
      expect(req.request.method).toEqual('POST');
      req.flush(heroMock);
    });
  });

  describe('updateHero', () => {

    it('should throw an error if the id is not given', () => {
      const updateHeroDto = {id: '', superhero: 'Superman' } as Hero;

      expect(() => {
        cut.updateHero(updateHeroDto);
      }).toThrowError();
    });

    it('should update the hero', () => {
      const heroMock = {
        id: 'test',
        superhero: 'test1'
      } as Hero;

      const expectedHero = {
        ...heroMock,
        superhero: 'test2'
      } as Hero;

      cut.updateHero(heroMock).subscribe(heroUpdated => {
        expect(heroUpdated).toEqual(expectedHero);
      });

      const req = httpMock.expectOne(`${basePath}/heroes/test`);
      expect(req.request.method).toEqual('PATCH');
      req.flush(expectedHero);
    });
  });

  describe('deleteHeroById', () => {
    it('should return false if the here was not found', () => {
      cut.deleteHeroById('test').subscribe(res => {
        expect(res).toBeDefined();
        expect(res).toBeFalse();
      });

      const req = httpMock.expectOne(`${basePath}/heroes/test`);
      expect(req.request.method).toEqual('DELETE');
      req.flush(false);
    });

    it('should return false when there is an error during deletion', () => {
      cut.deleteHeroById('').subscribe(result => {
        expect(result).toBe(false);
      });

      const req = httpMock.expectOne(`${basePath}/heroes/`);
      expect(req.request.method).toBe('DELETE');

      req.flush('Id required!', { status: 404, statusText: 'Not Found' });
    });

    it('should return true if the hero was deleted successfully',() => {

      cut.deleteHeroById('test').subscribe(res => {
        expect(res).toBeDefined();
        expect(res).toBeTrue();
      });

      const req = httpMock.expectOne(`${basePath}/heroes/test`);
      expect(req.request.method).toEqual('DELETE');
      req.flush(true);
    });
  });
});
