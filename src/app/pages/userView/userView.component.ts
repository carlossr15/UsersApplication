import { Component, inject } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IUser } from '../../interfaces/iuser.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './userView.component.html',
  styleUrl: './userView.component.css'
})
export class UserViewComponent {
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  usersServices = inject(UsersService);
  user: IUser = { id: 0, name: '', lastname: '', email: '', url: '', img: '' };

  async ngOnInit(): Promise<void> {
    this.activatedRoute.params.subscribe(async (params: any) => {
      const url = params.url;

      try {
        // Espera a que la promesa se resuelva
        const response = this.usersServices.getByUrl(url);
        if (response) {
          // Si se encuentra el usuario, lo asigna
          this.user = response;
        } else {
          // Si no se encuentra el usuario, redirige a la página de error
          this.router.navigate(['/error']);
        }
      } catch (error) {
        console.error('Error al obtener el usuario:', error);
        this.router.navigate(['/error']);
      }
    });
  }

  confirmDelete(): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          this.usersServices.delete(this.user.id); // Borra el usuario
          this.router.navigate(['/home']);
          swalWithBootstrapButtons.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success"
          });
        } catch (error) {
          console.error('Error al eliminar el usuario:', error);
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire({
          title: "Cancelled",
          text: "Your imaginary file is safe :)",
          icon: "error"
        });
      }
    });
  }
}