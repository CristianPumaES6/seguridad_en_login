import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UsersService } from '../../../core/services/users.service';
import { UserProfileResponse } from '../../../core/models/user-profile.models';
import { Observable, switchMap } from 'rxjs';

@Component({
    selector: 'app-user-detail',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatListModule,
        MatProgressSpinnerModule,
        RouterLink
    ],
    templateUrl: './user-detail.component.html',
    styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private usersService = inject(UsersService);

    user$: Observable<UserProfileResponse> | undefined;

    ngOnInit() {
        this.user$ = this.route.paramMap.pipe(
            switchMap(params => {
                const id = params.get('id');
                if (id) {
                    return this.usersService.getUserById(id);
                }
                throw new Error('User ID not found in route');
            })
        );
    }
}
