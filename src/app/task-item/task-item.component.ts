import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Task } from '../task';
import { NgIf, NgClass, DatePipe, TitleCasePipe } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [NgIf, NgClass, DatePipe, TitleCasePipe],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.css',
  animations: [
    trigger('taskComplete', [
      state('complete', style({
        opacity: 0.7,
        background: '#f0f0f0'
      })),
      state('incomplete', style({
        opacity: 1,
        background: '#f9f9f9'
      })),
      transition('incomplete => complete', [
        animate('0.3s ease-in')
      ]),
      transition('complete => incomplete', [
        animate('0.2s ease-out')
      ])
    ])
  ]
})
export class TaskItemComponent implements OnInit {
  @Input() task!: Task;
  @Output() onDelete = new EventEmitter<void>();
  @Output() onToggle = new EventEmitter<void>();
  @Output() onEdit = new EventEmitter<Task>();
  today = new Date();

  ngOnInit(): void {
    // Set today's date to midnight for accurate comparisons
    this.today.setHours(0, 0, 0, 0);
  }

  deleteTask(): void {
    this.onDelete.emit();
  }

  toggleComplete(): void {
    this.onToggle.emit();
  }

  editTask(): void {
    this.onEdit.emit(this.task);
  }

  getPriorityClass(): string {
    if (!this.task.priority) return '';
    return `priority-${this.task.priority}`;
  }

  getCompletionState(): string {
    return this.task.completed ? 'complete' : 'incomplete';
  }
}