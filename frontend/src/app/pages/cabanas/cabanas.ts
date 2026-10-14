import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReservasService, Reserva } from '../../services/reservas.service';

@Component({
  selector: 'app-cabanas',
  imports: [FormsModule],
  templateUrl: './cabanas.html',
  styleUrl: './cabanas.css',
})
export class Cabanas {

  private readonly reservasService = inject(ReservasService);
  private readonly cdr = inject(ChangeDetectorRef);
  calendarioAbierto: number | null = null;
  reservas: Reserva[] = [];
  cargando = false;
  guardando = false;
  error = '';
  codigoReserva = '';
  fechaEntrada = '';
  fechaSalida = '';
  nombre = '';
  apellido = '';
  email = '';
  telefono = '';
  huespedes = 2;

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

  async abrirCalendario(id: number): Promise<void> {
    this.calendarioAbierto = id;
    this.error = '';
    this.codigoReserva = '';
    this.fechaEntrada = '';
    this.fechaSalida = '';
    this.cargando = true;
    try { this.reservas = await this.reservasService.listar(); }
    catch { this.error = 'No se pudo conectar con JSON Server. Iniciá la API en el puerto 3000.'; }
    finally { this.cargando = false; this.cdr.markForCheck(); }
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

    const fechaISO = [String(this.anioActual), String(this.mesActual + 1).padStart(2, '0'), String(dia).padStart(2, '0')].join('-');
    if (!this.fechaEntrada || this.fechaSalida) {
      this.fechaEntrada = fechaISO;
      this.fechaSalida = '';
    } else if (fechaISO > this.fechaEntrada) {
      this.fechaSalida = fechaISO;
    } else {
      this.fechaEntrada = fechaISO;
      this.fechaSalida = '';
    }
    this.error = '';
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
  get cabaniaActual() {
    return this.propuestas.find(p => p.id === this.calendarioAbierto);
  }

  fechaDia(dia: number): string {
    return `${this.anioActual}-${String(this.mesActual + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
  }

  fechaBloqueada(dia: number): boolean {
    if (this.calendarioAbierto === null) return false;
    const fecha = this.fechaDia(dia);
    return this.reservas.some(r => this.reservasService.seSuperpone(r, String(this.calendarioAbierto), fecha, this.siguienteDia(fecha)));
  }

  siguienteDia(fecha: string): string {
    const d = new Date(`${fecha}T12:00:00`);
    d.setDate(d.getDate() + 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  async reservar(): Promise<void> {
    if (this.calendarioAbierto === null || this.guardando) return;
    this.error = '';
    if (!this.fechaEntrada || !this.fechaSalida || this.fechaSalida <= this.fechaEntrada) {
      this.error = 'Seleccioná una fecha de entrada y una de salida posterior.';
      return;
    }
    if (!this.nombre.trim() || !this.apellido.trim() || !this.email.trim() || !this.telefono.trim()) {
      this.error = 'Completá todos los datos de contacto.';
      return;
    }
    const max = this.calendarioAbierto === 1 ? 4 : this.calendarioAbierto === 2 ? 6 : 8;
    if (!Number.isInteger(this.huespedes) || this.huespedes < 1 || this.huespedes > max) {
      this.error = `La cantidad de huéspedes debe estar entre 1 y ${max}.`;
      return;
    }
    this.guardando = true;
    try {
      this.reservas = await this.reservasService.listar();
      if (this.reservas.some(r => this.reservasService.seSuperpone(r, String(this.calendarioAbierto), this.fechaEntrada, this.fechaSalida))) {
        this.error = 'La cabaña ya está reservada en esas fechas. Elegí otras.';
        return;
      }
      const ahora = new Date();
      const limite = new Date(ahora.getTime() + 48 * 60 * 60 * 1000);
      const codigoReserva = `RES-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
      const nueva: Omit<Reserva, 'id'> = {
        codigoReserva,
        cabaniaId: String(this.calendarioAbierto),
        nombre: this.nombre.trim(),
        apellido: this.apellido.trim(),
        email: this.email.trim(),
        telefono: this.telefono.trim(),
        huespedes: this.huespedes,
        fechaEntrada: this.fechaEntrada,
        fechaSalida: this.fechaSalida,
        estado: 'pendiente_pago',
        fechaCreacion: ahora.toISOString(),
        fechaLimitePago: limite.toISOString()
      };
      const reservaGuardada = await this.reservasService.crear(nueva);

      this.reservas.push(reservaGuardada);
      this.codigoReserva = reservaGuardada.codigoReserva;
    } catch {
      this.error = 'No se pudo guardar la reserva. Verificá que JSON Server esté funcionando.';
    } finally { this.guardando = false; this.cdr.markForCheck(); }
  }

}