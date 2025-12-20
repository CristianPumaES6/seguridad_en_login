import { Routes } from '@angular/router';
import { UserListComponent } from './list/user-list.component';
import { UserProfileComponent } from './profile/user-profile.component';
import { ProfileEditComponent } from './edit/profile-edit.component';
import { authGuard } from '../../core/guards/auth.guard';

export const USERS_ROUTES: Routes = [
    { path: '', component: UserListComponent }, // Public list
    { path: 'profile', component: UserProfileComponent, canActivate: [authGuard] },
    { path: 'profile/edit', component: ProfileEditComponent, canActivate: [authGuard] }
];
