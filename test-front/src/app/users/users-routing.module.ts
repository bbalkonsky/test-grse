import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {UsersComponent} from './pages/users/users.component';
import {UserComponent} from './components/user/user.component';

const routes: Routes = [
  {path: '', component: UsersComponent, children: [
      {path: ':user', pathMatch: 'full', component: UserComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
