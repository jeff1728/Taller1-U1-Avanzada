import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './filters.component.html'
})
export class FiltersComponent {
  @Input() currentFilter: 'all' | 'active' | 'completed' = 'all';
  @Output() filterChange = new EventEmitter<'all' | 'active' | 'completed'>();
}
