import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    FormsModule
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  @Input() viewMode: 'dashboard' | 'report' = 'dashboard';
  @Output() viewModeChange = new EventEmitter<'dashboard' | 'report'>();
  @Output() toggleSidebar = new EventEmitter<void>();

  onViewModeChange(mode: 'dashboard' | 'report') {
    this.viewMode = mode;
    this.viewModeChange.emit(mode);
  }
}
