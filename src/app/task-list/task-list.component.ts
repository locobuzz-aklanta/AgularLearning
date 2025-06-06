import { Component, OnInit } from '@angular/core';
import { Task } from '../interfaces/task.interface';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { TaskItemComponent } from '../task-item/task-item.component';
import { TaskService } from '../services/task.service';
import { AddTaskComponent } from '../add-task/add-task.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [NgFor, NgIf, TaskItemComponent, AddTaskComponent, FormsModule, DatePipe],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  filterStatus: 'all' | 'active' | 'completed' = 'all';
  selectedTask: Task | null = null;
  today = new Date();

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.loadTasks();
    // Update today's date at midnight
    this.setDateRefresh();
  }

  setDateRefresh() {
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();
    
    setTimeout(() => {
      this.today = new Date();
      this.setDateRefresh();
    }, timeUntilMidnight);
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  addTask(task: Omit<Task, 'id'>): void {
    this.taskService.addTask(task).subscribe(() => {
      this.loadTasks();
    });
  }

  updateTask(task: Task): void {
    this.taskService.updateTask(task).subscribe(() => {
      this.loadTasks();
      this.selectedTask = null;
    });
  }

  deleteTask(id: number): void {
    this.taskService.deleteTask(id).subscribe(() => {
      this.loadTasks();
      // If the task we're editing is deleted, cancel the edit
      if (this.selectedTask && this.selectedTask.id === id) {
        this.selectedTask = null;
      }
    });
  }

  toggleComplete(id: number): void {
    this.taskService.toggleComplete(id).subscribe(() => {
      this.loadTasks();
    });
  }

  editTask(task: Task): void {
    this.selectedTask = { ...task };
  }

  cancelEdit(): void {
    this.selectedTask = null;
  }

  getFilteredTasks(): Task[] {
    switch (this.filterStatus) {
      case 'active':
        return this.tasks.filter(task => !task.completed);
      case 'completed':
        return this.tasks.filter(task => task.completed);
      default:
        return this.tasks;
    }
  }

  getDueSoonTasks(): Task[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const threeDaysFromNow = new Date(today);
    threeDaysFromNow.setDate(today.getDate() + 3);
    
    return this.tasks.filter(task => {
      if (!task.dueDate || task.completed) return false;
      
      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      
      return dueDate >= today && dueDate <= threeDaysFromNow;
    });
  }

  getTaskCountByStatus(status: 'all' | 'active' | 'completed'): number {
    switch (status) {
      case 'active':
        return this.tasks.filter(task => !task.completed).length;
      case 'completed':
        return this.tasks.filter(task => task.completed).length;
      default:
        return this.tasks.length;
    }
  }
}