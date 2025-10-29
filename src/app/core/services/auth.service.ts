import { Injectable } from '@angular/core';
import { User } from '../interfaces/user.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private KEY = 'app_token';

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.KEY);
  }

  login(token: User): void {
    localStorage.setItem(this.KEY, JSON.stringify(token));
  }

  getUser(): User | null {
    const userData = localStorage.getItem(this.KEY);
    return userData ? JSON.parse(userData) as User : null;
  }

  logout(): void {
    localStorage.clear();
  }
}
