import { Injectable } from '@angular/core';
import { Task } from '../task';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks: Task[] = [
    { id: 1, title: 'Buy groceries', description: 'Milk, eggs, bread, and fruits', completed: false, priority: 'medium', dueDate: new Date('2025-05-24') },
    { id: 2, title: 'Clean the house', description: 'Vacuum, dust, and mop floors', completed: true, priority: 'low', dueDate: new Date('2025-05-22') },
    { id: 3, title: 'Finish project', description: 'Complete Angular Task Tracker app', completed: false, priority: 'high', dueDate: new Date('2025-05-25') }
  ];

  constructor() { }

  getTasks(): Observable<Task[]> {
    return of(this.tasks);
  }

  addTask(task: Omit<Task, 'id'>): Observable<Task> {
    const newTask: Task = {
      id: this.getNextId(),
      ...task
    };
    this.tasks.push(newTask);
    return of(newTask);
  }

  deleteTask(id: number): Observable<boolean> {
    const initialLength = this.tasks.length;
    this.tasks = this.tasks.filter(task => task.id !== id);
    return of(this.tasks.length !== initialLength);
  }

  toggleComplete(id: number): Observable<Task | undefined> {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      return of(task);
    }
    return of(undefined);
  }

  updateTask(updatedTask: Task): Observable<Task | undefined> {
    const index = this.tasks.findIndex(t => t.id === updatedTask.id);
    if (index !== -1) {
      this.tasks[index] = updatedTask;
      return of(updatedTask);
    }
    return of(undefined);
  }

  private getNextId(): number {
    return Math.max(0, ...this.tasks.map(t => t.id)) + 1;
  }
}