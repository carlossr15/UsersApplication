import { IUser } from "./iuser.interface";

export interface IResponse {
  items: IUser[];
  meta: IMeta;
  links: ILink
}

export interface IMeta {
  "totalItems": number;
  "itemCount": number;
  "itemsPerPage": number;
  "totalPages": number;
  "currentPage": number;
}

export interface ILink {
  "first": string;
  "previous": string;
  "next": string;
  "last": string;
}
