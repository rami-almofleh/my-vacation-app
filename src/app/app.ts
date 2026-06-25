import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { LanguageService } from './services/language.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  readonly languageService = inject(LanguageService);
  readonly copy = this.languageService.dictionary;
  protected readonly title = signal('my-vacation');
}
