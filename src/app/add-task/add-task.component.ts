import { Component, Output, EventEmitter, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Task } from '../task';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.css'
})
export class AddTaskComponent implements OnChanges {
  @Input() taskToEdit: Task | null = null;
  @Output() onAddTask = new EventEmitter<Omit<Task, 'id'>>();
  @Output() onUpdateTask = new EventEmitter<Task>();
  @Output() onCancelEdit = new EventEmitter<void>();
  
  id?: number;
  title: string = '';
  description: string = '';
  dueDate?: string;
  priority: 'low' | 'medium' | 'high' = 'medium';
  completed: boolean = false;
  showForm: boolean = false;
  isEditing: boolean = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['taskToEdit'] && this.taskToEdit) {
      this.id = this.taskToEdit.id;
      this.title = this.taskToEdit.title;
      this.description = this.taskToEdit.description || '';
      this.priority = this.taskToEdit.priority || 'medium';
      this.completed = this.taskToEdit.completed;
      
      if (this.taskToEdit.dueDate) {
        // Format date for input element
        const date = new Date(this.taskToEdit.dueDate);
        this.dueDate = date.toISOString().split('T')[0];
      } else {
        this.dueDate = undefined;
      }
      
      this.showForm = true;
      this.isEditing = true;
    }
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm && this.isEditing) {
      this.resetForm();
      this.onCancelEdit.emit();
    }
  }

  resetForm(): void {
    this.id = undefined;
    this.title = '';
    this.description = '';
    this.dueDate = undefined;
    this.priority = 'medium';
    this.completed = false;
    this.isEditing = false;
  }

  onSubmit(): void {
    if (!this.title.trim()) {
      alert('Please add a task title');
      return;
    }

    if (this.isEditing && this.id !== undefined) {
      // Updating existing task
      const updatedTask: Task = {
        id: this.id,
        title: this.title,
        description: this.description || undefined,
        completed: this.completed,
        priority: this.priority,
        dueDate: this.dueDate ? new Date(this.dueDate) : undefined
      };
      
      this.onUpdateTask.emit(updatedTask);
    } else {
      // Creating new task
      const newTask: Omit<Task, 'id'> = {
        title: this.title,
        description: this.description || undefined,
        completed: false,
        priority: this.priority,
        dueDate: this.dueDate ? new Date(this.dueDate) : undefined
      };
      
      this.onAddTask.emit(newTask);
    }

    // Reset form
    this.resetForm();
    this.showForm = false;
  }

  cancelEdit(): void {
    this.resetForm();
    this.showForm = false;
    this.onCancelEdit.emit();
  }
}
