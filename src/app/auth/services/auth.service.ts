import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environments} from '../../../environments/environments';
import {User} from '../interfaces/user.interface';
import {catchError, map, Observable, of, tap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private basePath: string = environments.baseUrl;

  private user?: User;

  constructor(private readonly http: HttpClient) {
  }

  get currentUser(): User | undefined {
    if (!this.user) return undefined;
    return structuredClone(this.user);
  }

  public login(email: string, password: string): Observable<User | undefined> {
    // this.http.post<User>
    return this.http.get<User>(`${this.basePath}/users/1`).pipe(
      tap(user => this.user = user),
      tap(user => localStorage.setItem('token', this.user!.id.toString())),
      catchError((err) => of(undefined)),
    );
  }

  public logout(): void {
    this.user = undefined;
    localStorage.clear();
  }

  public checkAuthentication(): Observable<boolean> {
    const token: string | null = localStorage.getItem('token');

    if (!token) return of(false);

    return this.http.get<User>(`${this.basePath}/users/${token}`).pipe(
      tap(user => this.user = user),
      map(user => !!user),
      catchError((err) => of(false)),
    );
  }
}
