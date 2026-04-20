import { Routes } from '@angular/router';
import { authGuard } from './core/auth/auth.guard';
import { AppLayoutComponent } from './shared/ui/app-layout.component';
import { LoginPageComponent } from './features/login/login-page.component';
import { DepartamentosListPageComponent } from './features/departamentos/departamentos-list-page.component';
import { DepartamentoFormPageComponent } from './features/departamentos/departamento-form-page.component';
import { EmpleadosListPageComponent } from './features/empleados/empleados-list-page.component';
import { EmpleadoFormPageComponent } from './features/empleados/empleado-form-page.component';

export const routes: Routes = [
	{ path: 'login', component: LoginPageComponent },
	{
		path: '',
		component: AppLayoutComponent,
		canActivate: [authGuard],
		children: [
			{ path: '', pathMatch: 'full', redirectTo: 'empleados' },
			{ path: 'departamentos', component: DepartamentosListPageComponent },
			{ path: 'departamentos/nuevo', component: DepartamentoFormPageComponent },
			{ path: 'departamentos/:clave/editar', component: DepartamentoFormPageComponent },
			{ path: 'empleados', component: EmpleadosListPageComponent },
			{ path: 'empleados/nuevo', component: EmpleadoFormPageComponent },
			{ path: 'empleados/:clave/editar', component: EmpleadoFormPageComponent }
		]
	},
	{ path: '**', redirectTo: '' }
];
