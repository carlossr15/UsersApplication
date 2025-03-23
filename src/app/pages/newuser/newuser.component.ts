import { Component, inject } from '@angular/core';
import { IUser } from '../../interfaces/iuser.interface';
import { UsersService } from '../../services/users.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-newuser',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './newuser.component.html',
  styleUrl: './newuser.component.css'
})
export class NewuserComponent {
  user: IUser | undefined = { id: 0, name: '', lastname: '', email: '', url: '', img: '' };

  usersServices = inject(UsersService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  async ngOnInit(): Promise<void> {
    const userUrl = this.route.snapshot.paramMap.get('url');
    if (userUrl) {
      try {
        // Espera a que la promesa se resuelva
        const foundUser = await this.usersServices.getByUrl(userUrl);
        if (foundUser) {
          this.user = foundUser; // Asigna el usuario encontrado
        } else {
          // Si no se encuentra el usuario, redirige a la página principal
          this.router.navigate(['/home']);
        }
      } catch (error) {
        console.error('Error al obtener el usuario:', error);
        this.router.navigate(['/home']);
      }
    }
  }

  async getDataForm(updatedUser: IUser): Promise<void> {
    if (this.user && this.checkFormFields(updatedUser)) {
      try {
        // Actualiza los datos del usuario
        let find = this.usersServices.update(this.user.id, updatedUser);
        if(!find){
          let userId = this.usersServices.getLastUserId() + 1;
          updatedUser.id = userId;
          updatedUser.url = userId.toString();
          this.usersServices.insert(updatedUser);
        }
        // Redirige al usuario a la página principal
        this.router.navigate(['/home']);
      } catch (error) {
        console.error('Error al actualizar el usuario:', error);
      }
    }
  }

  checkFormFields(user: IUser): boolean {
    if (user.email !== "" && user.lastname !== "" && user.name !== "" && user.url !== "" && user.img !== "") {
      // Comprueba si la URL de la imagen es válida
      if (!user.img.startsWith("http")) {
        Swal.fire({
          title: 'Error!',
          text: 'Por favor introduzca una URL válida para la imagen',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        return false;
      }
  
      // Comprueba si el email tiene un formato válido
      if (!this.isValidEmail(user.email)) {
        Swal.fire({
          title: 'Error!',
          text: 'Por favor introduzca un email válido',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        return false;
      }
  
      Swal.fire({
        title: '¡Genial!',
        text: '¡Usuario guardado correctamente!',
        icon: 'success',
      });
      return true;
    }
  
    Swal.fire({
      title: 'Error!',
      text: 'Por favor rellene todos los campos',
      icon: 'error',
      confirmButtonText: 'Aceptar'
    });
    return false;
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular para validar el email
    return emailRegex.test(email);
  }
}