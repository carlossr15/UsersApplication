import { Injectable } from '@angular/core';
import { IUser } from '../interfaces/iuser.interface';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private baseUrl: string = 'https://peticiones.online/api/users';
  private users: IUser[] = []; // Array local para almacenar los usuarios

  constructor() {}

  // Cargar todos los usuarios desde la API y almacenarlos en el array local
  async loadUsers(): Promise<void> {
    try {
      const response = await fetch(this.baseUrl);
      if (!response.ok) {
        throw new Error(`Error al obtener los usuarios: ${response.statusText}`);
      }

      const data: any = await response.json();

      // Mapea los usuarios y los almacena en el array local
      if (data.results && Array.isArray(data.results)) {
        this.users = data.results.map((user: any) => ({
          id: user.id,
          name: user.first_name,
          lastname: user.last_name,
          email: user.email,
          img: user.image,
          url: user.id.toString()
        }));
      } else {
        throw new Error('Estructura de respuesta inesperada');
      }
    } catch (error) {
      console.error(error);
      this.users = []; // Si ocurre un error, inicializa el array vacío
    }
  }

  // Obtener todos los usuarios desde el array local
  getAllUsers(): IUser[] {
    return this.users;
  }

  // Obtener un usuario por su URL desde el array local
  getByUrl(url: string): IUser | undefined {
    return this.users.find(user => user.url === url);
  }

  // Insertar un nuevo usuario en el array local
  insert(newUser: IUser): void {
    this.users.push(newUser);
  }

// Actualizar un usuario en el array local
update(id: number, updatedUser: IUser): boolean {
  const index = this.users.findIndex(user => user.id === id); // Busca el índice del usuario por su ID
  if (index !== -1) {
    // Actualiza solo las propiedades del usuario encontrado
    this.users[index] = { ...this.users[index], ...updatedUser };
    return true; // Indica que la actualización fue exitosa
  }
  return false; // Indica que no se encontró el usuario
}

  // Eliminar un usuario del array local
  delete(id: number): boolean {
    const index = this.users.findIndex(user => user.id === id);
    if (index !== -1) {
      this.users.splice(index, 1);
      return true;
    }
    return false;
  }

  sortUsersAlphabetically(): IUser[] {
    return this.users.sort((a, b) => a.name.localeCompare(b.name)); // Ordena por el nombre
  }

  getLastUserId(): number {
    return this.users[this.users.length - 1].id;
  }
}