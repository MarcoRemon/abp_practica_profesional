import { Component, computed, inject, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cabanas',
  imports: [],
  templateUrl: './cabanas.html',
  styleUrl: './cabanas.css',
})
export class Cabanas {

  calendarioAbierto: number | null = null;

  mesActual = new Date().getMonth();
  anioActual = new Date().getFullYear();

  fechaSeleccionada: string | null = null;

propuestas = [
  {
    id: 1,
    titulo: 'Cabaña para 2 a 4 personas',
    capacidad: '2 a 4 huéspedes',
    descripcion: 'Ideal para parejas, familias pequeñas o grupos reducidos.',
    imagen: '/img/entrada.png',
  },
  {
    id: 2,
    titulo: 'Cabaña para 4 a 6 personas',
    capacidad: '4 a 6 huéspedes',
    descripcion: 'Una opción cómoda para familias o grupos medianos.',
    imagen: "/img/pileta.png",
  },
  {
    id: 3,
    titulo: 'Cabaña para 6 a 8 personas',
    capacidad: '6 a 8 huéspedes',
    descripcion: 'Pensada para familias numerosas o grupos grandes.',
    imagen: "/img/fuera.png",
  },
];

  abrirCalendario(id: number): void {
    this.calendarioAbierto = id;
    this.fechaSeleccionada = null;

    const hoy = new Date();
    this.mesActual = hoy.getMonth();
    this.anioActual = hoy.getFullYear();
  }

  cerrarCalendario(): void {
    this.calendarioAbierto = null;
  }

  cambiarMes(cambio: number): void {
    const nuevaFecha = new Date(
      this.anioActual,
      this.mesActual + cambio,
      1
    );

    const hoy = new Date();
    const inicioMesActual = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      1
    );

    if (nuevaFecha < inicioMesActual) {
      return;
    }

    this.mesActual = nuevaFecha.getMonth();
    this.anioActual = nuevaFecha.getFullYear();
  }

  obtenerDiasDelMes(): (number | null)[] {
    const primerDia = new Date(
      this.anioActual,
      this.mesActual,
      1
    ).getDay();

    const cantidadDias = new Date(
      this.anioActual,
      this.mesActual + 1,
      0
    ).getDate();

    const dias: (number | null)[] = [];

    for (let i = 0; i < primerDia; i++) {
      dias.push(null);
    }

    for (let dia = 1; dia <= cantidadDias; dia++) {
      dias.push(dia);
    }

    return dias;
  }

  esFechaPasada(dia: number): boolean {
    const fecha = new Date(
      this.anioActual,
      this.mesActual,
      dia
    );

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    return fecha < hoy;
  }

  seleccionarFecha(dia: number): void {

    if (this.esFechaPasada(dia)) {
      return;
    }

    this.fechaSeleccionada = [
      String(dia).padStart(2, '0'),
      String(this.mesActual + 1).padStart(2, '0'),
      String(this.anioActual),
    ].join('/');
  }

  get nombreMes(): string {
    return new Date(
      this.anioActual,
      this.mesActual,
      1
    ).toLocaleDateString('es-AR', {
      month: 'long',
      year: 'numeric',
    });
  }

  get puedeIrAlMesAnterior(): boolean {
    const hoy = new Date();

    return (
      this.anioActual > hoy.getFullYear() ||
      (
        this.anioActual === hoy.getFullYear() &&
        this.mesActual > hoy.getMonth()
      )
    );
  }
}