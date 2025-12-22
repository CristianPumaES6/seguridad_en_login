import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment';

@Pipe({
    name: 'profileImageUrl',
    standalone: true
})
export class ProfileImageUrlPipe implements PipeTransform {
    transform(path: string | null | undefined): string {
        if (!path) {
            return 'https://material.angular.io/assets/img/examples/shiba1.jpg';
        }

        if (path.startsWith('http')) {
            return path;
        }

        // Clean up old Windows paths or relative paths
        const filename = path.split('\\').pop()?.split('/').pop();
        return `${environment.uploadsUrl}/${filename}`;
    }
}
