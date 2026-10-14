import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export type EstadoReserva = 'pendiente_pago' | 'confirmada' | 'cancelada';
export interface Reserva {
  id: string;
  codigoReserva: string;
  cabaniaId: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  huespedes: number;
  fechaEntrada: string;
  fechaSalida: string;
  estado: EstadoReserva;
  fechaCreacion: string;
  fechaLimitePago: string;
}

@Injectable({ providedIn: 'root' })
export class ReservasService {
  private readonly http = inject(HttpClient);
  private readonly url = 'http://localhost:3000/reservas';

  listar(): Promise<Reserva[]> {
    return firstValueFrom(this.http.get<Reserva[]>(this.url));
  }

  actualizarEstado(
    id: string,
    estado: EstadoReserva
  ): Promise<Reserva> {
    return firstValueFrom(
      this.http.patch<Reserva>(
        `${this.url}/${encodeURIComponent(id)}`,
        { estado }
      )
    );
  }

  crear(reserva: Omit<Reserva, 'id'>): Promise<Reserva> {
    return firstValueFrom(
      this.http.post<Reserva>(this.url, reserva)
    );
  }

  activa(reserva: Reserva): boolean {
    return reserva.estado === 'confirmada' ||
      (reserva.estado === 'pendiente_pago' && new Date(reserva.fechaLimitePago).getTime() > Date.now());
  }

  seSuperpone(reserva: Reserva, cabaniaId: string, entrada: string, salida: string): boolean {
    return reserva.cabaniaId === cabaniaId && this.activa(reserva) &&
      entrada < reserva.fechaSalida && salida > reserva.fechaEntrada;
  }
}
