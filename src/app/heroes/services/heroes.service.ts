import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
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
}