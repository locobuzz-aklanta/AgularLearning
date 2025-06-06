import { Routes } from '@angular/router';
import { TaskListComponent } from './task-list/task-list.component';
import { AboutComponent } from './about/about.component';
import { WeatherComponent } from './weather/weather.component';

export const routes: Routes = [
  { path: '', component: AboutComponent },
  { path: 'tasks', component: TaskListComponent },
  { path: 'weather', component: WeatherComponent },
  { path: '**', redirectTo: '' } // Redirect any unknown routes to home
];