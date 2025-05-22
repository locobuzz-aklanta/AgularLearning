import { Component } from '@angular/core';
import { NgFor, NgIf, NgClass, DatePipe } from '@angular/common';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [NgFor, NgIf, NgClass, DatePipe],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  name: string = 'Aklanta Niraz Bhuyan';
  showBio: boolean = false;
  currentDate = new Date();
  
  // Use these with ngFor
  skills: string[] = [
    'HTML & CSS',
    'JavaScript',
    'TypeScript', 
    'Angular',
    'React',
    'Node.js',
    'Express',
    'MongoDB'
  ];
  
  // Use with ngIf and ngFor
  projects: {name: string; description: string; completed: boolean}[] = [
    { 
      name: 'Task Tracker', 
      description: 'An Angular app to track daily tasks and improve productivity', 
      completed: true
    },
    { 
      name: 'Weather Dashboard', 
      description: 'Web app showing weather forecasts using weather API', 
      completed: false
    },
    { 
      name: 'E-commerce Platform', 
      description: 'Online store with product catalog and shopping cart', 
      completed: false
    }
  ];

  toggleBio() {
    this.showBio = !this.showBio;
  }
}