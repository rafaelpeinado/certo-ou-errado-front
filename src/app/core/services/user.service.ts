import { User, UserRequest } from './../interfaces/user.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first, Observable, take } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {

  private readonly base = environment.apiBase + '/users';

  constructor(
    private readonly http: HttpClient,
  ) { }

  public createUser(user: UserRequest): Observable<User> {
    return this.http.post<User>(this.base, user).pipe(first());
  }

  public getUser(user: UserRequest): Observable<User> {
    return this.http.post<User>(`${this.base}/user`, user).pipe(first());
  }
}
