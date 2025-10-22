import { Component, signal, computed, effect } from '@angular/core';
import { TodoFormComponent } from './components/todo-form/todo-form.component';
import { FiltersComponent } from './components/filters/filters.component';
import { TodoListComponent } from './components/todo-list/todo-list.component';
import { Todo } from './models/todo.model';

@Component({
  selector: 'app-root',
  imports: [TodoFormComponent, FiltersComponent, TodoListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Taller1U1';
  private readonly STORAGE_KEY = 'todos-app-data';
  
  // Signals para manejar el estado
  todos = signal<Todo[]>([]);
  filter = signal<'all' | 'active' | 'completed'>('all');
  nextId = signal(1);

  constructor() {
    // Cargar datos del localStorage al iniciar
    this.loadFromLocalStorage();
    
    // Effect para guardar automáticamente en localStorage cuando cambien los todos
    effect(() => {
      const currentTodos = this.todos();
      const currentNextId = this.nextId();
      this.saveToLocalStorage(currentTodos, currentNextId);
    });
  }

  // Computed signal para filtrar tareas
  filteredTodos = computed(() => {
    const currentFilter = this.filter();
    const allTodos = this.todos();
    
    switch (currentFilter) {
      case 'active':
        return allTodos.filter(todo => !todo.completed);
      case 'completed':
        return allTodos.filter(todo => todo.completed);
      default:
        return allTodos;
    }
  });

  // Agregar nueva tarea
  addTodo(title: string) {
    const newTodo: Todo = {
      id: this.nextId(),
      title,
      completed: false
    };
    this.todos.update(todos => [...todos, newTodo]);
    this.nextId.update(id => id + 1);
  }

  // Cambiar estado de completado
  toggleTodo(id: number) {
    this.todos.update(todos =>
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  // Eliminar tarea
  deleteTodo(id: number) {
    this.todos.update(todos => todos.filter(todo => todo.id !== id));
  }

  // Cambiar filtro
  setFilter(filter: 'all' | 'active' | 'completed') {
    this.filter.set(filter);
  }

  // Guardar en localStorage
  private saveToLocalStorage(todos: Todo[], nextId: number): void {
    const data = {
      todos,
      nextId
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  // Cargar desde localStorage
  private loadFromLocalStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        if (data.todos && Array.isArray(data.todos)) {
          this.todos.set(data.todos);
          this.nextId.set(data.nextId || 1);
        }
      }
    } catch (error) {
      console.error('Error al cargar datos del localStorage:', error);
    }
  }
}
