import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MATERIAL_MODULES } from '../../../shared/material';
import { UsersService } from '../../../core/services/users.service';
import { UserProfileResponse } from '../../../core/models/user-profile.models';
import { SeoService } from '../../../core/services/seo.service';
import { AuthService } from '../../../core/services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, ...MATERIAL_MODULES],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit {
  private usersService = inject(UsersService);
  private seoService = inject(SeoService);
  private authService = inject(AuthService);

  profile$!: Observable<UserProfileResponse>;

  ngOnInit() {
    this.seoService.setSeoData('My Profile', 'View and manage your profile.');
    this.profile$ = this.usersService.getProfile();
  }

  logout() {
    this.authService.logout();
  }
}
