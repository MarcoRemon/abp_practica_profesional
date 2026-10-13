import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import emailjs from '@emailjs/browser';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contacto.html',
  styleUrls: ['./contacto.css']
})
export class Contacto implements OnInit {
  contactoForm!: FormGroup;
  formEnviado = false;
  cargando = false;
  mensajeExito = false;
  mensajeError = false;

  // ===== CONFIGURACIÓN EMAILJS =====
  private readonly SERVICE_ID = 'service_s329sys';
  private readonly TEMPLATE_ID = 'template_u3tecao';
  private readonly PUBLIC_KEY = 'D8S3UJD4FLQloNA5I';

  // ===== CONFIGURACIÓN WHATSAPP =====
  readonly numeroWhatsapp = '5492612498457';

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.contactoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      mensaje: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  get f() {
    return this.contactoForm.controls;
  }

  // Enviar correo mediante EmailJS
  onSubmit(): void {
    this.formEnviado = true;
    this.mensajeExito = false;
    this.mensajeError = false;

    if (this.contactoForm.invalid) {
      return;
    }

    this.cargando = true;

    // Aseguramos que los datos vayan limpios de espacios accidentales
    const emailLimpio = (this.contactoForm.value.email || '').trim();
    const nombreLimpio = (this.contactoForm.value.nombre || '').trim();
    const mensajeLimpio = (this.contactoForm.value.mensaje || '').trim();

    const templateParams = {
      from_name: nombreLimpio,
      from_email: emailLimpio,
      message: mensajeLimpio
    };

    console.log('Enviando a EmailJS:', templateParams);

    emailjs.send(this.SERVICE_ID, this.TEMPLATE_ID, templateParams, this.PUBLIC_KEY)
      .then((response) => {
        console.log('Email enviado con éxito:', response.status, response.text);
        this.cargando = false;
        this.mensajeExito = true;
        this.contactoForm.reset();
        this.formEnviado = false;
      })
      .catch((error) => {
        console.error('Error enviando mail con EmailJS:', error);
        this.cargando = false;
        this.mensajeError = true;
      });
  }

  // Redireccionar a la API de WhatsApp con el mensaje prearmado
  abrirWhatsapp(): void {
    const nombre = (this.contactoForm.value.nombre || '').trim();
    const consulta = (this.contactoForm.value.mensaje || '').trim();

    let textoMensaje = '¡Hola! Quisiera realizar una consulta sobre Cabañas Los Chañaritos.';
    if (nombre) {
      textoMensaje += ` Mi nombre es ${nombre}.`;
    }
    if (consulta) {
      textoMensaje += ` Consulta: ${consulta}`;
    }

    const url = `https://wa.me/${this.numeroWhatsapp}?text=${encodeURIComponent(textoMensaje)}`;
    window.open(url, '_blank');
  }
}