import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { TokenService } from 'src/app/control-electoral/services/utils/token.service';
import { UsuarioService } from 'src/app/control-electoral/services/usuario.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { EncryptedService } from 'src/app/control-electoral/services/utils/encrypted.service';

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.component.html',
  styleUrls: ['./inicio-sesion.component.scss'],
  providers: [MessageService]
})
export class InicioSesionComponent {

  form: FormGroup;
  constructor(private fb: FormBuilder, private router: Router, private usuarioService: UsuarioService,
    private messageService: MessageService, private tokenService: TokenService, private spinner: NgxSpinnerService,
    private encryptedService: EncryptedService) {
    this.form = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  iniciarSesion() {
    if (this.form.valid) {
      this.spinner.show();
      this.usuarioService.login(this.form.get('correo').value, this.form.get('password').value).subscribe({
        next: data => {
          let datosUsuario = {}
          if (data['code'] === "200") {
            datosUsuario['access_module'] = this.loadAccess(data.result.rol.permisos_rol);
            // this.loadAccess(data.result.rol.permisos_rol);
            datosUsuario['idRol'] = data['result'].rol.id;
            datosUsuario['usuario'] = data['result'].id;
            datosUsuario['correo'] = data['result'].correo;
            datosUsuario['rol'] = data['result'].rol.descripcion;
            let territorio = data.result.territorio;
            if (territorio.length != 0) {
              datosUsuario['localidadEntidad'] = territorio[0].localidad_entidad;
              datosUsuario['localidadValor'] = territorio[0].localidad_valor;
            }
            datosUsuario['nombres'] = data['result'].voluntario ? this.formatearNombre(data['result'].voluntario.padron_electoral.nom_padron) : 'Administrador';
            datosUsuario['identificacion'] = data['result'].voluntario ? data['result'].voluntario.padron_electoral.cedula : '';
            localStorage.setItem('userData', this.encryptedService.encryptData(datosUsuario));
            this.tokenService.handleToken(data['token']);
            this.router.navigate(['/gestion/inicio']);
          } else if (data['code'] === "401") {
            this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error!', detail: 'Usuario Desactivado', life: 10000 });
          } else {
            this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error!', detail: 'Credenciales Incorrectas', life: 10000 });
          }
          this.spinner.hide();
        }, error: e => {
          console.log(e);
          this.spinner.hide();
          this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error!', detail: 'Se produjo un error!', life: 10000 });
        }
      });
    }
  }

  formatearNombre(nombre: string): string {
    const partes = nombre.split(' ');

    if (partes.length < 3) {
      return partes.slice(-2).join(' ');
    }

    const nombreFormateado = `${partes[2]} ${partes[1]}`;
    return nombreFormateado;
  }

  loadAccess(data: any):any {
    let access = "";
    data.forEach(item => {
      access = access.concat(item.permiso, " ");
    });
    // localStorage.setItem('access_module', access);
    return access
  }

}
