import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [MatToolbar, RouterLink, RouterOutlet],
  template: `
    <header>
      <mat-toolbar class="fc-toolbar">
        <a
          routerLink="/"
          class="flex min-h-11 items-center gap-2 font-display text-[22px] font-bold no-underline"
          aria-label="Flashcards, ir al inicio"
        >
          <i
            class="inline-block h-7 w-[22px] -rotate-10 rounded-[5px] bg-flag shadow-[8px_2px_0_-2px_var(--color-land)]"
            aria-hidden="true"
          ></i>
          Flashcards
        </a>
      </mat-toolbar>
    </header>
    <main>
      <router-outlet />
    </main>
    <footer class="px-[max(5vw,16px)] pt-6 pb-10 text-center text-[13px] opacity-70">
      Banderas e ilustraciones dibujadas en SVG (versiones simplificadas)
    </footer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
