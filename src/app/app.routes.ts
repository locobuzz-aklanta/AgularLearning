import { Routes } from '@angular/router';
import { TaskListComponent } from './task-list/task-list.component';
import { AboutComponent } from './about/about.component';

export const routes: Routes = [
  { path: '', component: AboutComponent },
  { path: 'tasks', component: TaskListComponent },
  { path: '**', redirectTo: '' } // Redirect any unknown routes to home
];