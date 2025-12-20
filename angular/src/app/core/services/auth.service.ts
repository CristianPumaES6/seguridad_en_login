import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap, catchError, map } from 'rxjs/operators';
import { throwError, Observable, of } from 'rxjs';
import { LoginRequest, LoginResponse, RegisterRequest } from '../models/auth.models';
import { PublicUserResponse, UserProfileResponse } from '../models/user-profile.models';
import { environment } from '../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = `${environment.apiUrl}/auth`;
    private tokenKey = 'access_token';
    private platformId = inject(PLATFORM_ID);

    // Signals for reactive state
    private _currentUser = signal<UserProfileResponse | null>(null);
    public currentUser = this._currentUser.asReadonly();
    public isAuthenticated = computed(() => !!this._currentUser());

    constructor(private http: HttpClient, private router: Router) {
        this.loadToken();
    }

    private loadToken() {
        if (isPlatformBrowser(this.platformId)) {
            const token = localStorage.getItem(this.tokenKey);
            if (token) {
                this.fetchProfile().subscribe({
                    error: () => this.logout() // Invalid token
                });
            }
        }
    }

    getToken(): string | null {
        if (isPlatformBrowser(this.platformId)) {
            return localStorage.getItem(this.tokenKey);
        }
        return null;
    }

    register(data: RegisterRequest): Observable<any> {
        return this.http.post(`${this.apiUrl}/register`, data);
    }

    login(credentials: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
            tap(response => {
                this.setSession(response);
            }),
            tap(() => {
                this.fetchProfile().subscribe();
            })
        );
    }

    private setSession(authResult: LoginResponse) {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem(this.tokenKey, authResult.access_token);
        }
    }

    logout() {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem(this.tokenKey);
        }
        this._currentUser.set(null);
        this.router.navigate(['/auth/login']);
    }

    private fetchProfile(): Observable<UserProfileResponse> {
        return this.http.get<UserProfileResponse>(`${environment.apiUrl}/users/profile`).pipe(
            tap(user => this._currentUser.set(user))
        );
    }
}
