import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: 'inicio', pathMatch: 'full' },
    { path: 'inicio', loadComponent: () => import('./pages/inicio/inicio').then(m => m.Inicio) },
    { path: 'cabanias', loadComponent: () => import('./pages/cabanias/cabanias').then(m => m.Cabanias) },
    { path: 'servicios', loadComponent: () => import('./pages/servicios/servicios').then(m => m.Servicios) },
    { path: 'ubicacion', loadComponent: () => import('./pages/ubicacion/ubicacion').then(m => m.Ubicacion) },
    { path: 'contacto', loadComponent: () => import('./pages/contacto/contacto').then(m => m.Contacto) },
    { path: '**', redirectTo: 'inicio' }
];