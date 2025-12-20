import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
    providedIn: 'root'
})
export class SeoService {

    constructor(private titleService: Title, private metaService: Meta) { }

    setSeoData(title: string, description: string) {
        this.titleService.setTitle(title);
        this.metaService.updateTag({ name: 'description', content: description });

        // Open Graph
        this.metaService.updateTag({ property: 'og:title', content: title });
        this.metaService.updateTag({ property: 'og:description', content: description });
        // Add more OG tags as needed
    }
}
