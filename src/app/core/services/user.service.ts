import { User, UserRequest } from './../interfaces/user.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { first, Observable, take } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {

  constructor(
    private readonly http: HttpClient,
  ) { }

  public createUser(user: UserRequest): Observable<User> {
    return this.http.post<User>('/api/users', user).pipe(first());
  }

  public getUser(user: UserRequest): Observable<User> {
    return this.http.post<User>('/api/users/user', user).pipe(first());
  }
}
