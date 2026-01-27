import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LookerEmbed } from './looker-embed/looker-embed';
import { GeminiSidebar } from './gemini-sidebar/gemini-sidebar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    LookerEmbed,
    GeminiSidebar
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  isSidebarOpen = false;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
