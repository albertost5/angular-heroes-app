import {Injectable} from '@angular/core';
import {catchError, Observable, of} from 'rxjs';
import {Hero} from '../interfaces/hero.interface';
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
    return this.http.get<Hero[]>(`${this.basePath}/heroes`);
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
}
