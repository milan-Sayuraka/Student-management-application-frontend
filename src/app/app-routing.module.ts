import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentDetailsComponent } from './shared/components/student-details/student-details.component';
import { StudentListComponent } from './student-list/student-list.component';
import { StudentCreateComponent } from './student-create/student-create.component';

const routes: Routes = [
  { path: 'student-list', component: StudentListComponent },
  { path: 'student-create', component: StudentCreateComponent },
  { path: '', redirectTo: '/student-list', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
