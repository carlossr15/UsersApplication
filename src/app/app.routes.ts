import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NewuserComponent } from './pages/newuser/newuser.component';
import { UserViewComponent } from './pages/userView/userView.component';

export const routes: Routes = [
    { path: "", pathMatch: "full", redirectTo: "home" },
    { path: "home", component: HomeComponent },
    { path: "user/:url", component: UserViewComponent },
    { path: "newUser", component: NewuserComponent },
    { path: "updateUser/:url", component: NewuserComponent }
];
