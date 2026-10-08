import { Component, computed, inject, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

type Vista = 'mapa' | 'satelite';

@Component({
  selector: 'app-ubicacion',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './ubicacion.html',
  styleUrl: './ubicacion.css',
})
export class Ubicacion {
  private readonly sanitizer = inject(DomSanitizer);

  readonly direccionLinea1 = 'Ruta Nacional 38 Km 69';
  readonly direccionLinea2 = 'La Cumbre, Sierras de Córdoba';

  private readonly coordenadas = '-30.978580507965034,-64.51981403219305';

  readonly vista = signal<Vista>('mapa');

  readonly mapaActivo = signal(false);

  readonly mapaUrl = computed(() => {
    const tipo = this.vista() === 'satelite' ? 'k' : 'm';
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.google.com/maps?q=${this.coordenadas}&z=16&t=${tipo}&output=embed`
    );
  });

  readonly comoLlegarUrl =
    `https://www.google.com/maps/dir/?api=1&destination=${this.coordenadas}`;

  cambiarVista(v: Vista): void {
    this.vista.set(v);
  }
}