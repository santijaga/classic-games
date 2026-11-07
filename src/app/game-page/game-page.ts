import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-game-page',
  imports: [RouterLink],
  template: `
    <nav aria-label="Site navigation">
      <a routerLink="/">Home</a>
    </nav>
    <main>
      <h1>{{ title() }}</h1>
      <ng-content />
    </main>
  `,
  styles: `
    nav {
      display: flex;
      gap: 0.75rem;
      padding: 0.5rem 1rem;
      border-bottom: 1px solid var(--border);
      background: var(--surface);
    }

    a {
      display: inline-flex;
      align-items: center;
      min-height: 2.75rem;
      padding: 0 0.75rem;
      color: inherit;
      font-weight: 600;
    }

    main {
      width: min(100% - 2rem, 30rem);
      margin: 1.25rem auto 2rem;
      text-align: center;
    }

    h1 {
      margin: 0 0 1rem;
      font-size: clamp(1.5rem, 5vw, 2rem);
    }
  `,
})
export class GamePage {
  readonly title = input.required<string>();
}
