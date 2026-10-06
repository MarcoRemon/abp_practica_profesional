import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'inicio',
        pathMatch: 'full'
    },
    {
        path: 'inicio',
        loadComponent: () =>
            import('./pages/inicio/inicio').then(m => m.Inicio)
    },
    {
        path: 'cabanas',
        loadComponent: () =>
            import('./pages/cabanas/cabanas').then(m => m.Cabanas)
    },
    {
        path: 'servicios',
        loadComponent: () =>
            import('./pages/servicios/servicios').then(m => m.Servicios)
    },
    {
        path: 'ubicacion',
        loadComponent: () =>
            import('./pages/ubicacion/ubicacion').then(m => m.Ubicacion)
    },
    {
        path: 'contacto',
        loadComponent: () =>
            import('./pages/contacto/contacto').then(m => m.Contacto)
    },
    {
        path: '**',
        redirectTo: 'inicio'
    }
];