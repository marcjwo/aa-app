import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Header } from './header/header';
import { LookerEmbed } from './looker-embed/looker-embed';
import { GeminiSidebar } from './gemini-sidebar/gemini-sidebar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    Header,
    LookerEmbed,
    GeminiSidebar
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  viewMode: 'dashboard' | 'report' = 'dashboard';
  isSidebarOpen = false;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
