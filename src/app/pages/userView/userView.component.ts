import { Component, inject, Input } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IUser } from '../../interfaces/iuser.interface';
import Swal from 'sweetalert2'

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
  servicio! : IUser;

  ngOnInit() {

    this.activatedRoute.params.subscribe((params: any) => {
      let url = params.url
      //con esta url llamar al servicio y preguntar si en el array de datos BBDD tenemos algo con esa ruta.
      let response = this.usersServices.getByUrl(url)
      if (response != undefined) {
        //tengo lo que quiero
        this.servicio = response;
        console.log(this.servicio)
      } else {
        //redirijo a la pagina 404
        this.router.navigate(['/error'])
      }

    })
  }

  // confirmDelete(): void {
  //   const confirmed = confirm('¿Estás seguro de que deseas eliminar este usuario?');
  //   if (confirmed) {
  //     // Lógica para eliminar el usuario
  //     this.usersServices.delete(this.servicio); 
  //     alert('Usuario eliminado correctamente.');
  //     this.router.navigate(['/home']); 
  //   }
  // }

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
    }).then((result) => {
      if (result.isConfirmed) {        
        this.usersServices.delete(this.servicio); 
        this.router.navigate(['/home']);

        swalWithBootstrapButtons.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire({
          title: "Cancelled",
          text: "Your imaginary file is safe :)",
          icon: "error"
        });
      }
    }); 

  }

}