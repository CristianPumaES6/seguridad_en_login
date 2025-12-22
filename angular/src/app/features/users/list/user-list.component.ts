import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MATERIAL_MODULES } from '../../../shared/material';
import { UsersService } from '../../../core/services/users.service';
import { PublicUserResponse } from '../../../core/models/user-profile.models';
import { SeoService } from '../../../core/services/seo.service';
import { AuthService } from '../../../core/services/auth.service';
import { Observable, catchError } from 'rxjs';

import { RouterModule } from '@angular/router';
import { ProfileImageUrlPipe } from '../../../shared/pipes/profile-image-url.pipe';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule, ...MATERIAL_MODULES, ProfileImageUrlPipe],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {
  private usersService = inject(UsersService);
  private seoService = inject(SeoService);
  public authService = inject(AuthService);

  currentUser = this.authService.currentUser;

  users$!: Observable<PublicUserResponse[]>;

  ngOnInit() {
    this.seoService.setSeoData('Public Users', 'Explore our community members.');
    this.users$ = this.usersService.getPublicUsers().pipe(
      catchError(err => {
        console.warn('Error fetching users', err);
        return []; // Return empty list on error to prevent template crash
      })
    );
  }
}
