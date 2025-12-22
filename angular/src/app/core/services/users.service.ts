import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PublicUserResponse, UserProfileResponse, UpdateProfileRequest } from '../models/user-profile.models';

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/users`;

    getPublicUsers(): Observable<PublicUserResponse[]> {
        return this.http.get<PublicUserResponse[]>(this.apiUrl);
    }

    getProfile(): Observable<UserProfileResponse> {
        return this.http.get<UserProfileResponse>(`${this.apiUrl}/profile`);
    }

    updateProfile(data: UpdateProfileRequest): Observable<UserProfileResponse> {
        return this.http.put<UserProfileResponse>(`${this.apiUrl}/profile`, data);
    }

    updateProfileImage(image: File): Observable<{ profileImagePath: string }> {
        const formData = new FormData();
        formData.append('file', image);
        return this.http.put<{ profileImagePath: string }>(`${this.apiUrl}/profile/image`, formData);
    }

    getUserById(id: string): Observable<UserProfileResponse> {
        return this.http.get<UserProfileResponse>(`${this.apiUrl}/${id}`);
    }
}
