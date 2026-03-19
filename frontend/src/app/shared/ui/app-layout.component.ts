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
      <nav>
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
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        border-bottom: 1px solid #ddd;
      }
      nav {
        display: flex;
        gap: 12px;
      }
      .active {
        font-weight: 600;
        text-decoration: underline;
      }
      .layout-main {
        padding: 16px;
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
