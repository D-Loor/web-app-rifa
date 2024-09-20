import { ChangeDetectorRef, Component } from '@angular/core';
import { Auth, signInWithPhoneNumber } from '@angular/fire/auth';
import { RecaptchaVerifier } from 'firebase/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { americaCountries, CountryInfo, Eleccion, PadronElectoral } from 'src/app/control-electoral/api/interface';
import { EleccionService } from 'src/app/control-electoral/services/eleccion.service';
import { VoluntarioService } from 'src/app/control-electoral/services/voluntario.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { interval, Subscription } from 'rxjs';
import { WindowRef } from 'src/app/control-electoral/services/utils/window.service';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/control-electoral/services/usuario.service';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { FiltersService } from 'src/app/control-electoral/services/utils/filters.service';
import { TerritorioService } from 'src/app/control-electoral/services/territorio.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-registro-voluntario',
  templateUrl: './registro-voluntario.component.html',
  styleUrls: ['./registro-voluntario.component.scss'],
  providers: [MessageService]
})
export class RegistroVoluntarioComponent {


  items: MenuItem[] | undefined;
  form: FormGroup;
  padronForm: FormGroup;
  otpForm: FormGroup;
  formRedes: FormGroup;
  activeIndex: number = 0;
  padron: boolean = true;
  informacionAdicional: boolean = false;
  redesSociales: boolean = false;
  formulario: boolean = false;
  classBotones: string = 'flex justify-content-end';
  acceptTerms: boolean = false;
  padronElectoral: PadronElectoral;
  eleccionActual: Eleccion;
  visiblePoliticas: boolean = false;
  visibleVerificacion: boolean = false;
  isSubmitted = false;
  confirmVerification = false;
  verificationSuccess = false;
  validCheckbox = '';
  valorCedula: string = '';
  backupCedula: string = '';
  valorTelefono: string = '';
  countries: CountryInfo[] = americaCountries;
  defaultMask: string = '+99 (999) 999-9999';
  currentMask: string;
  disabledCedula = false;
  telefonoBackup = '';
  formatoMask = '(999) 999-9999';
  verificacionCelular = false;
  telefonoConcatValue = '';
  codigoEnviado = '';
  cedulaPadron = false;

  constructor(private fb: FormBuilder, public layoutService: LayoutService, public messageService: MessageService,
    private voluntarioService: VoluntarioService, private usuarioService: UsuarioService, private eleccionesService: EleccionService, private auth: Auth,
    private windowRef: WindowRef, private router: Router, private filterService: FiltersService, 
    private territorioService: TerritorioService, private spinner: NgxSpinnerService) {
    const defaultCountry = this.countries.find(country => country.code === 'EC');
    this.currentMask = defaultCountry.mask;
    this.form = this.fb.group({
      padron_electoral_id: [''],
      selectedCountry: ['', Validators.required],
      telefono: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      red_fb: [''],
      red_tw: [''],
      red_ig: [''],
      red_tk: [''],
      tipo: ['1'],
      estado: ['1'],
      acceptTerms: [false, Validators.requiredTrue]
    }, { validator: (formGroup) => (['red_fb', 'red_tw', 'red_ig', 'red_tk'].some(field => !!formGroup.get(field)?.value)) ? null : { atLeastOneRequired: true } });
    


    this.padronForm = this.fb.group({
      nombre_apellido: [{ value: '', disabled: true }, Validators.required],
      pais: [{ value: '', disabled: true }, Validators.required],
      provincia: [{ value: '', disabled: true }, Validators.required],
      canton: [{ value: '', disabled: true }, Validators.required],
      parroquia: [{ value: '', disabled: true }, Validators.required]
    });

    this.eleccionActual = {
      descripcion: '',
      estado: '',
      eleccion: '',
      fecha: '',
      id: 0,
      nemonico: ''
    }
    this.limpiarRegistro();
    this.obtenerPaises();
    this.obtenerElecciones();
  }

  ngOnInit() {
    const waitTimes = localStorage.getItem('waitTimes');
    if (waitTimes) {
      localStorage.removeItem('waitTimes');
    }

    this.items = [
      {
        label: this.validLogoMobile() ? 'Localidad' : 'Lugar de votación',
        command: (event: any) => this.steps(1)
      },
      {
        label: this.validLogoMobile() ? 'Contacto' : 'Información de contacto',
        command: (event: any) => this.steps(2)
      },
      {
        label: 'Redes sociales',
        command: (event: any) => this.steps(3)
      }
    ];

    this.otpForm = this.fb.group({
      otp1: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
      otp2: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
      otp3: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
      otp4: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
      otp5: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]],
      otp6: ['', [Validators.required, Validators.pattern(/^[0-9]$/)]]
    });
  }

  obtenerElecciones() {
    this.spinner.show();
    this.eleccionesService.obtenerEleccion().subscribe({
      next: data => {
        if (data['code'] === "200") {
          this.eleccionActual = data['result'];
        } else {
          this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error!', detail: 'No existen Elecciones activas', life: 10000 });
        }
        this.spinner.hide();
      }, error: e => {
        console.log(e);
        this.spinner.hide();
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error!', detail: 'Se produjo un error!', life: 10000 });
      }
    });
  }

  limpiarRegistro(): void {
    this.form.reset({
      padron_electoral_id: '',
      telefono: '',
      correo: '',
      red_fb: '',
      red_tw: '',
      red_ig: '',
      red_tk: '',
      tipo: '1',
      estado: '1',
      acceptTerms: false
    });

    this.padronForm.reset({
      nombre_apellido: { value: '', disabled: true },
      pais: { value: '', disabled: true },
      provincia: { value: '', disabled: true },
      canton: { value: '', disabled: true },
      parroquia: { value: '', disabled: true }
    });

    this.crearPadron = '';
    this.acceptTerms = false;
    this.validCheckbox = '';
    this.isSubmitted = false;
    this.steps(1);
  }

  get telefono() {
    return this.form.get('telefono');
  }

  get correo() {
    return this.form.get('correo');
  }

  siguienteInfoAdicional() {
    this.correo.markAsTouched();
    this.telefono.markAsTouched();
    if (this.correo.valid && this.telefono.valid) {
      return true;
    } else {
      return false;
    }
  }

  ingresoNumero(event: any) {
    const valor = event.target.value;
    if (valor.length == 10) {
      if (this.backupCedula != valor) {
        this.backupCedula = valor;
        this.limpiarRegistro();
        this.cargarDatosPardron(valor);
      } else {
        this.formulario = true;
      }
    } else {
      this.formulario = false;
    }
  }

  establecerFormato() {
    const country = this.countries.find(country => country.code === this.form.value['selectedCountry'].code);
    this.currentMask = country.mask;
  }


  cargarDatosPardron(cedula: string) {
    this.spinner.show();
    this.voluntarioService.obtenerPersonaPadron(cedula, this.eleccionActual.id).subscribe({
      next: rest => {
        if (rest['code'] == "204") {
          this.usuarioService.validarCedula(cedula).subscribe({
            next: restCedula => {
              if (restCedula['code'] == "204") {
                this.messageService.add({ key: 'tst', severity: 'info', summary: 'Información', detail: restCedula['result'], life: 10000 });
              } else if (restCedula['code'] == "200") {
                this.cedulaPadron = true;
                this.formulario = true;
                this.padronForm.patchValue({
                  nombre_apellido: restCedula['result']
                });
                this.padronForm.get('pais')?.enable();
              }
            }, error: e => {
              this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error', detail: 'Se produjo un error.', life: 10000 });
            }
          })
        } else if (rest['code'] == "200") {
          this.formulario = true;
          this.padronElectoral = rest['result'];
          this.padronElectoral.nom_pais = this.padronElectoral.nom_pais.trim();
          this.form.get('padron_electoral_id').setValue(this.padronElectoral.padron_electoral_id);
          this.padronForm.patchValue({
            nombre_apellido: this.padronElectoral?.nom_padron,
            pais: this.padronElectoral?.nom_pais,
            provincia: this.padronElectoral?.nom_provincia,
            canton: this.padronElectoral?.nom_canton,
            parroquia: this.padronElectoral?.nom_parroquia
          });
          
        } else if (rest['code'] == "409") {
          this.messageService.add({ key: 'tst', severity: 'info', summary: 'Información', detail: rest['result'], life: 10000 });
          this.backupCedula = "";
        }
        this.spinner.hide();
      }, error: e => {
        this.spinner.hide();
        console.log(e);
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error', detail: 'Se produjo un error.', life: 10000 });
      }
    });
  }

  onActiveIndexChange(event: number) {
    this.activeIndex = event;
  }

  establecerPredeterminado() {
    const defaultCountry = this.countries.find(country => country.code === 'EC');
    if (defaultCountry) {
      this.form.get('selectedCountry')?.setValue(defaultCountry);
      this.form.get('telefono')?.setValue(defaultCountry.numCod);
    }
  }


  steps(step: number) {
    if (step == 1) {
      this.disabledCedula = false;
      this.padron = true;
      this.informacionAdicional = false;
      this.redesSociales = false;
      this.classBotones = 'flex justify-content-end';
    } else if (step == 2 && (this.padronForm.valid || this.cedulaPadron == false)) {
      this.disabledCedula = true;
      this.establecerPredeterminado();
      this.onActiveIndexChange(1);
      this.padron = false;
      this.informacionAdicional = true;
      this.redesSociales = false;
      this.classBotones = 'flex justify-content-between';
      if (this.verificacionCelular) {
        this.form.get('telefono').setValue(this.telefonoBackup);
      }
    } else if (step == 3) {
      if (this.siguienteInfoAdicional()) {
        this.onActiveIndexChange(2);
        this.padron = false;
        this.informacionAdicional = false;
        this.redesSociales = true;
        this.classBotones = 'flex justify-content-between';
      }
    }
  }

  guardarComplementosRegistros(mail: any, padron_id?: any) {
    this.spinner.show();
    if (padron_id != undefined) {
      this.form.patchValue({
        padron_electoral_id: padron_id
      })
    }
    this.voluntarioService.voluntario(this.form.value, mail).subscribe({
      next: rest => {
        if (!rest['error']) {
          if (rest['code'] === "200") {
            this.messageService.add({ key: 'tst', severity: 'success', summary: 'Éxito', detail: rest['result'], life: 10000 });
            this.formulario = false;
            this.backupCedula = "";
            this.valorCedula = "";
            this.confirmacion();
          }
        } else {
          if (rest['error'].correo) {
            this.messageService.add({ key: 'tst', severity: 'info', summary: 'Información', detail: rest['error'].correo, life: 10000 });
          }
          else if (rest['error'].telefono) {
            this.messageService.add({ key: 'tst', severity: 'info', summary: 'Información', detail: rest['error'].telefono, life: 10000 });
          }
          this.steps(2);
        }
        this.spinner.hide();
      }, error: e => {
        this.spinner.hide();
        console.log(e);
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error', detail: 'Se produjo un error.', life: 10000 });
      }
    })
  }

  guardar() {
    this.spinner.show();
    this.isSubmitted = true;
    if (this.form.valid) {
      this.validCheckbox = '';
      this.form.patchValue({
        telefono: this.form.value['selectedCountry'].numCod + ' ' + this.form.value['telefono']
      });
      let mail = {
        eleecion: this.eleccionActual.eleccion,
        nombres: this.padronForm.get('nombre_apellido')?.value
      }

      if (this.cedulaPadron == true) {
        let data = {
          eleccion_id: this.eleccionActual.id,
          cedula: this.valorCedula,
          nom_padron: this.padronForm.get('nombre_apellido')?.value,
          cod_provincia: this.padronForm.get('provincia')?.value,
          cod_canton: this.padronForm.get('canton')?.value,
          cod_parroquia: this.padronForm.get('parroquia')?.value,
          cod_zona: 0,
          nom_recinto: '',
          junta: 0,
          sexo: 'M'
        }

        this.usuarioService.registrarUsuarioPadron(data).subscribe({
          next: rest => {
            if (rest['code'] == '200') {
              let padron_id = rest['id'];
              this.guardarComplementosRegistros(mail, padron_id);
            } else if (rest['code'] == '500') {
              this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error', detail: 'Se produjo un error.', life: 10000 });
            } else if (rest['code'] == '204') {
              this.messageService.add({ key: 'tst', severity: 'info', summary: 'Información', detail: 'Ingrese una cédula valida', life: 10000 });
            }
            this.spinner.hide();
          }, error: e => {
            console.log(e);
            this.spinner.hide();
            this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error', detail: 'Se produjo un error.', life: 10000 });
          }
        })
      } else {
        this.guardarComplementosRegistros(mail);
      }
      this.spinner.hide();

    } else {
      if (this.form.errors?.['atLeastOneRequired']) {
        this.messageService.add({ key: 'tst', severity: 'info', summary: 'Información', detail: 'Debe ingresar al menos una red social.', life: 10000 });

      } else {
        // Mostrar mensajes de error para otros campos
        this.validCheckbox = 'ng-dirty';
      }
    }
    this.spinner.hide();
  }

  confirmacion() {
    this.router.navigate(['registro-voluntario/confirmacion']);
  }

  changeValueTerm(value: boolean) {
    this.acceptTerms = value;
    this.form.get('acceptTerms').setValue(value);
  }

  showDialog() {
    this.visiblePoliticas = true;
    this.changeValueTerm(false);
  }

  aceptaPoliticas() {
    this.validCheckbox = '';
    this.changeValueTerm(true);
    this.visiblePoliticas = false;
  }

  validarTerminos() {
    if (!this.acceptTerms) {
      this.validCheckbox = 'ng-dirty';
      this.isSubmitted = true;
    }
  }

  get otpControls() {
    return this.otpForm.controls;
  }

  moveToNext(event: KeyboardEvent, nextControlName: string) {
    const input = event.target as HTMLInputElement;
    if (nextControlName === "fin" && input.value.length > 1) {
      input.value = input.value.slice(0, 1);
      return;
    }

    if (input.value.length === 1) {
      const nextControl = this.otpForm.get(nextControlName);
      if (nextControl) {
        const nextElement = document.querySelector(`[formControlName="${nextControlName}"]`) as HTMLInputElement;
        if (nextElement) {
          nextElement.focus();
        }
      }
    }
  }

  closeVerification() {
    this.confirmVerification = false;
    this.otpForm.reset();
  }


  concatenarOtp(): string {
    const otp1 = this.otpForm.get('otp1').value;
    const otp2 = this.otpForm.get('otp2').value;
    const otp3 = this.otpForm.get('otp3').value;
    const otp4 = this.otpForm.get('otp4').value;
    const otp5 = this.otpForm.get('otp5').value;
    const otp6 = this.otpForm.get('otp6').value;

    const concatenatedOtp = otp1.toString() + otp2.toString() + otp3.toString() + otp4.toString() + otp5.toString() + otp6.toString();

    return concatenatedOtp;
  }

  chekearSiNumExiste(): boolean {
    const tiempoEspera = JSON.parse(localStorage.getItem('tiempoEspera') || '{}');
    return tiempoEspera[this.telefonoConcatValue] === 120;
  }

  validarCorreoTelefono() {
    this.spinner.show();
    let correo = this.form.value['correo'];
    let telefono = this.form.value['telefono'];
    let telefonoConcat = this.form.value['selectedCountry'].numCod + ' ' + this.form.value['telefono'];
    this.voluntarioService.validarCorreoTelefono(correo, telefonoConcat).subscribe({
      next: rest => {
        if (rest.code == "200") {
          if (telefono == this.telefonoBackup) {
            this.visibleVerificacion = false
            this.steps(3);
          } else {
            this.telefonoConcatValue = this.form.value['selectedCountry'].numCod + " " + this.telefono.value
            this.visibleVerificacion = true;
            let valor = this.chekearSiNumExiste();
            if (!valor) {
              if (this.codigoEnviado == this.telefonoConcatValue) {
                this.confirmVerification = true;
              } else {
                this.confirmVerification = false;
              }
            } else {
              this.confirmVerification = true;
              this.abilitarNumberCodigo(false);
              this.messageService.add({ key: 'tst', severity: 'info', summary: 'Información', detail: 'Ya se envió un codigo, espere unos segundo para volver a enviar!', life: 10000 });
              this.startTimer();
            }
          }
        } else if (rest.code == "400") {
          let mensaje = "";

          if (rest['error'].correo) {
            mensaje = "El correo ya se encuentra registrado"
          }

          if (rest['error'].telefono) {
            mensaje = "El telefono ya se encuentra registrado"
          }

          if (rest['error'].correo && rest['error'].telefono) {
            mensaje = "El correo y el telefono ya se encuentran registrados"
          }
          this.messageService.add({ key: 'tst', severity: 'info', summary: 'Información', detail: mensaje, life: 10000 });
        }
        this.spinner.hide();

      }, error: e => {
        this.spinner.hide();
        console.log(e);
      }
    })
  }

  activarVerificacionCodigo() {
    if (this.siguienteInfoAdicional()) {
      this.validarCorreoTelefono();
    }
  }

  abilitarNumberCodigo(isEnabled: boolean) {
    const otpControls = ['otp1', 'otp2', 'otp3', 'otp4', 'otp5', 'otp6'];
    otpControls.forEach(controlName => {
      const control = this.otpForm.get(controlName);
      if (isEnabled) {
        control.enable();
      } else {
        control.disable();
      }
    });
  }


  recaptchaVerifier: any
  // auth = getAuth();
  recaptchaActivo: boolean = false;

  activarCaptcha() {
    if (!this.recaptchaActivo) {
      this.recaptchaVerifier = new RecaptchaVerifier(this.auth, 'recaptcha-container', {
        size: 'invisible',
        callback: (response) => {
        }
      });

      this.recaptchaVerifier.render().then(() => {
        this.enviarCodigo();
        this.recaptchaActivo = true;
      }).catch(error => {
        console.error('Error al renderizar reCAPTCHA:', error);
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error!', detail: 'Se produjo un error!', life: 10000 });
      });
    } else {
      this.enviarCodigo();
    }

  }

  resultadoValidacion: any;
  codigoVerificacion: any;

  async enviarCodigo() {
    try {
      let telefono = this.telefonoConcatValue
      this.codigoEnviado = telefono;
      const confirmationResult = await signInWithPhoneNumber(this.auth, telefono, this.recaptchaVerifier);
      this.resultadoValidacion = confirmationResult;
      this.abilitarNumberCodigo(true);
      this.startTimer();
    } catch (error) {
      console.error('Error al enviar el SMS:', error);
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error!', detail: 'Se produjo un error!', life: 10000 });
    }
  }


  validarCodigo() {
    let codigo = this.concatenarOtp();

    this.resultadoValidacion.confirm(codigo).then((result) => {
      const user = result.user;
      this.messageService.add({ key: 'tst', severity: 'success', summary: 'Éxito', detail: "Verificación correcta", life: 10000 });
      this.visibleVerificacion = false;
      this.verificacionCelular = true;
      this.telefonoBackup = this.form.get('telefono').value;
      const tiempoEspera = JSON.parse(localStorage.getItem('tiempoEspera') || '{}');
      tiempoEspera[this.telefonoConcatValue] = 0;
      this.timer = undefined;
      this.steps(3);
      // ...
    }).catch((error) => {
      this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error', detail: 'Codigo no valido!', life: 10000 });
    });
  }


  isResendDisabled: boolean;
  timer: number;
  private subscription: Subscription;
  formattedTime;

  startTimer() {
    // Obtener el tiempo de espera acumulado desde localStorage
    const tiempoEspera = JSON.parse(localStorage.getItem('tiempoEspera') || '{}');
    const currentWaitTime = 120;
    tiempoEspera[this.telefonoConcatValue] = currentWaitTime;
    localStorage.setItem('tiempoEspera', JSON.stringify(tiempoEspera));

    // Iniciar el temporizador con el tiempo acumulado
    this.timer = currentWaitTime;
    this.isResendDisabled = true;


    // Verificar si ya hay un temporizador en ejecución y cancelarlo si es necesario
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    this.subscription = interval(1000).subscribe(() => {
      if (this.timer > 0) {
        this.timer--;
        this.formattedTime = this.formatTime(this.timer);
      } else {
        this.isResendDisabled = false;
        this.subscription.unsubscribe();
        tiempoEspera[this.telefonoConcatValue] = 0;
        localStorage.setItem('tiempoEspera', JSON.stringify(tiempoEspera));
      }
    });

    // Mostrar el tiempo formateado inicial
    this.formattedTime = this.formatTime(this.timer);
  }

  // Función para formatear el tiempo en minutos y segundos
  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} min ${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }


  validLogoMobile(): boolean {
    return this.windowRef.isMobile() && (this.padron || this.informacionAdicional || this.redesSociales);
  }

  filtradoPais: any[] | undefined; filtradoProvincias: any[] | undefined; filtradoCantones: any[] |
    undefined; filtradoParroquias: any[] | undefined;
  paises = []; provincias = []; cantones = []; parroquias = [];
  filtroPais(event: AutoCompleteCompleteEvent) {
    this.filtradoPais = this.filterService.filterTextContains(event.query, 'pais', this.paises);
  }

  filtroProvincia(event: AutoCompleteCompleteEvent) {
    this.filtradoProvincias = this.filterService.filterTextContains(event.query, 'provincia', this.provincias);
  }

  filtroCanton(event: AutoCompleteCompleteEvent) {
    this.filtradoCantones = this.filterService.filterTextContains(event.query, 'canton', this.cantones);
  }

  filtroParroquia(event: AutoCompleteCompleteEvent) {
    this.filtradoParroquias = this.filterService.filterTextContains(event.query, 'parroquia', this.parroquias);
  }


  obtenerPaises() {
    this.territorioService.paises().subscribe({
      next: rest => {
        if (rest.code === "200") {
          rest.result = rest.result.map(item => ({
            ...item,
            pais: item.pais.trim()
          }));
          this.paises = rest.result;
        }
      }, error: e => {
        console.log(e);
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error', detail: 'Se produjo un error.', life: 10000 });
      }
    })
  }

  territiroProvincias(id: any) {
    this.territorioService.provincias(id).subscribe({
      next: rest => {
        if (rest.code === "200") {
          this.provincias = rest.result;
        }
      }, error: e => {
        console.log(e);
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error', detail: 'Se produjo un error.', life: 10000 });
      }
    })
  }

  territiroCantones(id: any) {
    this.territorioService.cantones('provincia', id).subscribe({
      next: rest => {
        if (rest.code === "200") {
          this.cantones = rest.result;
        }
      }, error: e => {
        console.log(e);
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error', detail: 'Se produjo un error.', life: 10000 });
      }
    })
  }

  territiroParroquias(id: any) {
    this.territorioService.parroquias(id).subscribe({
      next: rest => {
        if (rest.code === "200") {
          this.parroquias = rest.result;
        }
      }, error: e => {
        console.log(e);
        this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error', detail: 'Se produjo un error.', life: 10000 });
      }
    })
  }

  crearPadron = '';
  obtenerProvincias(event?: AutoCompleteCompleteEvent): void {
    let id = event['id'];
    let territorio = this.padronForm.value.pais.pais;
    if(territorio == 'Ecuador'){
      this.crearPadron = 'Ecuador';
    }else{
      this.crearPadron = 'Extranjero';
    }
    this.padronForm.patchValue({
      provincia: '',
      canton: '',
      parroquia: ''
    });
    
    this.padronForm.get('provincia')?.enable();
    this.padronForm.get('canton')?.disable();
    this.padronForm.get('parroquia')?.disable();
    this.territiroProvincias(id);
  }

  obtenerCantones(event?: AutoCompleteCompleteEvent): void {
    let id = event['id'];
    this.padronForm.patchValue({
      canton:'',
      parroquia: ''
    });
    this.padronForm.get('parroquia')?.disable();
    this.padronForm.get('canton')?.enable();
    this.territiroCantones(id);
  }

  obtenerParroquias(event?: AutoCompleteCompleteEvent): void {
    let id = event['id'];
    this.padronForm.patchValue({
      parroquia: ''
    });
    this.padronForm.get('parroquia')?.enable();
    this.territiroParroquias(id);
  }
}