import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map, tap, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly LS_KEY = 'cp_token';
  private readonly base = environment.apiBase;
  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<string> {
    return this.http.post<{ token: string }>(`${this.base}/login`, { username, password })
      .pipe(map(r => r.token), tap(tok => localStorage.setItem(this.LS_KEY, tok)));
  }

  logout(): Observable<void> {
    const token = this.getToken();
    const headers = token ? new HttpHeaders({ token }) : undefined;
    return this.http.delete<void>(`${this.base}/logout`, { headers }).pipe(
      tap(() => localStorage.removeItem(this.LS_KEY))
    );
  }

  getToken(): string | null { return localStorage.getItem(this.LS_KEY); }
  get isLoggedIn(): boolean { return !!this.getToken(); }
}
