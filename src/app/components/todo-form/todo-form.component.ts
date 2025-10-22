import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './todo-form.component.html',
})
export class TodoFormComponent {
  @Output() newTodo = new EventEmitter<string>();
  title = '';
  error = '';

  add() {
    if (!this.title.trim()) {
      this.error = 'La tarea no puede estar vacía.';
      return;
    }
    this.newTodo.emit(this.title.trim());
    this.title = '';
    this.error = '';
  }
}
