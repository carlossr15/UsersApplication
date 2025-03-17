import { Injectable } from '@angular/core';
import { IUser } from '../interfaces/iuser.interface';
import { USUARIOS } from '../db/users.db';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private arrUsers: IUser[] = USUARIOS;

  getAll(): IUser[] {
    return this.arrUsers;
  }

  getByUrl(url: string) : IUser | undefined {
    debugger
    return this.arrUsers.find(user => user.url === url);
  }

  insert(user: IUser): void {
    const lastId = this.arrUsers[this.arrUsers.length - 1].id;
    user.id = lastId + 1;
    this.arrUsers.push(user);
  }

  delete(user: IUser): void {
    this.arrUsers = this.arrUsers.filter(u => u.id !== user.id);
  }

}
