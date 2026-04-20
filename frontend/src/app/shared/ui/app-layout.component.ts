import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="layout-header">
      <nav class="layout-nav">
        <a routerLink="/empleados" routerLinkActive="active">Empleados</a>
        <a routerLink="/departamentos" routerLinkActive="active">Departamentos</a>
      </nav>
      <button type="button" (click)="logout()">Cerrar sesión</button>
    </header>

    <main class="layout-main">
      <router-outlet />
    </main>
  `,
  styles: [
    `
      .layout-header {
        position: sticky;
        top: 0;
        z-index: 20;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 14px 22px;
        border-bottom: 1px solid rgba(145, 102, 255, 0.28);
        background: linear-gradient(180deg, rgba(14, 5, 34, 0.9), rgba(14, 5, 34, 0.55));
        backdrop-filter: blur(8px);
      }

      .layout-nav {
        display: flex;
        gap: 10px;
      }

      .layout-nav a {
        color: #d1c3ff;
        border: 1px solid transparent;
        border-radius: 999px;
        padding: 8px 14px;
        font-size: 0.9rem;
        font-weight: 600;
        letter-spacing: 0.02em;
        transition: all 160ms ease;
      }

      .layout-nav a:hover {
        color: #fff;
        border-color: rgba(145, 102, 255, 0.35);
        background: rgba(90, 32, 214, 0.18);
      }

      .active {
        color: #fff !important;
        background: linear-gradient(120deg, rgba(126, 46, 255, 0.45), rgba(0, 209, 255, 0.3));
        border-color: rgba(165, 132, 255, 0.55) !important;
        box-shadow: 0 10px 20px rgba(62, 22, 145, 0.45);
      }

      button {
        padding: 9px 16px;
      }

      .layout-main {
        padding: 24px;
        max-width: 1080px;
        margin: 0 auto;
      }
    `
  ]
})
export class AppLayoutComponent {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  logout(): void {
    this.authService.logout(false);
    void this.router.navigate(['/login']);
  }
}
