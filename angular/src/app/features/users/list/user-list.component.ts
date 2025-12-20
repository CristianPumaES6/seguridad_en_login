import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MATERIAL_MODULES } from '../../../shared/material';
import { UsersService } from '../../../core/services/users.service';
import { PublicUserResponse } from '../../../core/models/user-profile.models';
import { SeoService } from '../../../core/services/seo.service';
import { Observable, catchError } from 'rxjs';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, ...MATERIAL_MODULES],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit {
  private usersService = inject(UsersService);
  private seoService = inject(SeoService);

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
