import {
  Component,
  ChangeDetectorRef,
  OnInit,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  ReservasService,
  Reserva,
  EstadoReserva
} from '../../services/reservas.service';

@Component({
  selector: 'app-admin-reservas',
  imports: [CommonModule],
  templateUrl: './admin-reservas.html',
  styleUrl: './admin-reservas.css'
})
export class AdminReservas implements OnInit {

  readonly reservasService = inject(ReservasService);
  private readonly cdr = inject(ChangeDetectorRef);

  reservas: Reserva[] = [];
  cargando = false;
  procesandoId: string | null = null;
  error = '';
  mensaje = '';

  ngOnInit(): void {
    void this.cargarReservas();
  }

  async cargarReservas(): Promise<void> {
    this.cargando = true;
    this.error = '';

    try {
      this.reservas = await this.reservasService.listar();
    } catch {
      this.error = 'No se pudieron cargar las reservas.';
    } finally {
      this.cargando = false;
      this.cdr.markForCheck();
    }
  }

  async cambiarEstado(
    reserva: Reserva,
    estado: EstadoReserva
  ): Promise<void> {

    if (this.procesandoId) return;

    const accion = estado === 'confirmada'
      ? 'confirmar'
      : 'cancelar';

    if (!confirm(`¿Querés ${accion} la reserva ${reserva.id}?`)) {
      return;
    }

    this.procesandoId = reserva.id;
    this.error = '';
    this.mensaje = '';

    try {
      // Volvemos a consultar para no actuar sobre datos desactualizados.
      const actuales = await this.reservasService.listar();
      const actual = actuales.find(r => r.id === reserva.id);

      if (!actual || actual.estado !== 'pendiente_pago') {
        throw new Error('La reserva ya no está pendiente de pago.');
      }

      if (
        estado === 'confirmada' &&
        !this.reservasService.activa(actual)
      ) {
        throw new Error('La reserva venció y no puede confirmarse.');
      }

      await this.reservasService.actualizarEstado(
        reserva.id,
        estado
      );

      this.mensaje = `Reserva ${reserva.id} actualizada correctamente.`;

      await this.cargarReservas();

    } catch (e) {
      this.error = e instanceof Error
        ? e.message
        : 'No se pudo actualizar la reserva.';
    } finally {
      this.procesandoId = null;
      this.cdr.markForCheck();
    }
  }
}