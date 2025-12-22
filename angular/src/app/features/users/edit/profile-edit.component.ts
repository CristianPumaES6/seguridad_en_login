import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MATERIAL_MODULES } from '../../../shared/material';
import { UsersService } from '../../../core/services/users.service';
import { SeoService } from '../../../core/services/seo.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProfileImageUrlPipe } from '../../../shared/pipes/profile-image-url.pipe';

import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-profile-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ...MATERIAL_MODULES, ProfileImageUrlPipe],
  templateUrl: './profile-edit.component.html',
  styleUrl: './profile-edit.component.scss'
})
export class ProfileEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private usersService = inject(UsersService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  private seoService = inject(SeoService);

  form = this.fb.group({
    name: ['', [Validators.required]]
  });

  isLoading = false;
  currentProfileImage: string | null = null;
  previewImage: string | null = null;
  selectedFile: File | null = null;

  ngOnInit() {
    this.seoService.setSeoData('Edit Profile', 'Update your personal information.');
    this.usersService.getProfile().subscribe(user => {
      this.form.patchValue({ name: user.name });
      this.currentProfileImage = user.profileImagePath;
    });
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;

      // Validation
      if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
        this.snackBar.open('Invalid format. Only PNG, JPEG, WEBP allowed.', 'Close', { duration: 3000 });
        return;
      }

      // Preview
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.isLoading = true;

      // Update Name
      this.usersService.updateProfile({ name: this.form.value.name! }).subscribe({
        next: () => {
          // If file selected, upload it
          if (this.selectedFile) {
            this.usersService.updateProfileImage(this.selectedFile).subscribe({
              next: () => this.finalizeUpdate(),
              error: (err) => this.handleError(err)
            });
          } else {
            this.finalizeUpdate();
          }
        },
        error: (err) => this.handleError(err)
      });
    }
  }

  finalizeUpdate() {
    this.isLoading = false;
    this.snackBar.open('Profile updated successfully!', 'Close', { duration: 3000 });
    this.router.navigate(['/users/profile']);
  }

  handleError(err: any) {
    this.isLoading = false;
    console.error('Update error details:', err);
    const message = err.error?.message || err.message || 'Unknown error';
    this.snackBar.open('Update failed: ' + message, 'Close', { duration: 5000 });
  }
}
