import {Injectable} from '@angular/core';
import {catchError, map, Observable, of} from 'rxjs';
import {CreateHeroDto, Hero} from '../interfaces/hero.interface';
import {HttpClient} from '@angular/common/http';
import {environments} from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class HeroesService {

  private basePath = environments.baseUrl;

  constructor(
    private readonly http: HttpClient
  ) {
  }

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(`${this.basePath}/heroes`).pipe(
      catchError(err => of([]))
    );
  }

  getHero(id: string): Observable<Hero | undefined> {
    return this.http.get<Hero>(`${this.basePath}/heroes/${id}`).pipe(
      catchError((error) => of(undefined))
    );
  }

  getSuggestions(query: string): Observable<Hero[]> {
    return this.http.get<Hero[]>(`${this.basePath}/heroes?q=${query}&_limit=6`).pipe(
      catchError((error) => of([]))
    );
  }

  addHero(createHeroDto: CreateHeroDto): Observable<Hero> {
    return this.http.post<Hero>(`${this.basePath}/heroes`, createHeroDto);
  }

  updateHero(updateHeroDto: Hero): Observable<Hero> {
    if (!updateHeroDto.id) throw new Error('The hero id is required!');

    return this.http.patch<Hero>(`${this.basePath}/heroes/${updateHeroDto.id}`, updateHeroDto);
  }

  deleteHeroById(id: string): Observable<boolean> {
    return this.http.delete(`${this.basePath}/heroes/${id}`).pipe(
      map(rdo => !!rdo),
      catchError((error) => of(false))
    )
  }
}
