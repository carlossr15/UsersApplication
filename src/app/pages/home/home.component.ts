import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { IUser } from '../../interfaces/iuser.interface';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  arrUsers: IUser[] = [];

  constructor(private usersService: UsersService) {}

  async ngOnInit(): Promise<void> {
    if (this.usersService.getAllUsers().length === 0) {
      await this.usersService.loadUsers(); // Carga los usuarios solo si no están cargados
    }
    this.arrUsers = this.usersService.getAllUsers();
    this.sortUsersAlphabetically(); // Ordena los usuarios alfabéticamente
    console.log('arrUsers:', this.arrUsers);
  }

  
  confirmDelete(user: IUser): void {
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
          const success = await this.usersService.delete(user.id);
          if (success) {
            this.arrUsers = await this.usersService.getAllUsers(); // Recarga los usuarios
            swalWithBootstrapButtons.fire("Deleted!", "User has been removed.", "success");
          }
        } catch (error) {
          console.error('Error al eliminar el usuario:', error);
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire("Cancelled", "The user is safe :)", "error");
      }
    });
  }

  sortUsersAlphabetically(): void {
    this.arrUsers.sort((a, b) => a.name.localeCompare(b.name)); // Ordena por el nombre
  }

  sortUsersReverseAlphabetically(): void {
    this.arrUsers.sort((a, b) => b.name.localeCompare(a.name)); // Ordena de Z a A
  }
}