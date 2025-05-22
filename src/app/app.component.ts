import { Component } from '@angular/core';
import { TaskListComponent } from './task-list/task-list.component';
import { AboutComponent } from './about/about.component';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TaskListComponent, AboutComponent, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Task Tracker';
}
