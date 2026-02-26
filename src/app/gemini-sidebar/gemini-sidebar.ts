import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { VegaChartComponent } from './vega-chart.component';
import { ConversationalAnalyticsService } from '../services/conversational-analytics.service';
import { AuthService } from '../services/auth.service';
import { MarkdownModule } from 'ngx-markdown';

interface Message {
  role: 'user' | 'model';
  type?: 'text' | 'schema' | 'chart';
  text?: string;
  content?: any;
}

@Component({
  selector: 'app-gemini-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    VegaChartComponent,
    MarkdownModule
  ],
  templateUrl: './gemini-sidebar.html',
  styleUrl: './gemini-sidebar.scss'
})
export class GeminiSidebar {
  private analyticsService = inject(ConversationalAnalyticsService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  messages: Message[] = [
    { role: 'model', type: 'text', text: 'Hi! I can help you analyze your ADK agent logs. Ask me anything about prompt usage, user interactions, or specific events.' }
  ];
  userInput = '';
  isLoading = false;

  // Use Observable for auth state to ensure UI updates immediately
  isAuthenticated$ = this.authService.accessToken$;

  suggestedQuestions = ['What is the total token usage for each tool?', 'What is the average latency for each tool?'];

  login() {
    this.authService.login();
  }

  sendSuggestedQuestion(question: string) {
    this.userInput = question;
    this.sendMessage();
  }

  sendMessage() {
    if (!this.userInput.trim()) return;

    const text = this.userInput;
    this.userInput = '';
    this.messages = [...this.messages, { role: 'user', type: 'text', text }];
    this.isLoading = true;

    this.analyticsService.sendMessage(text).subscribe({
      next: (responseMessages) => {
        console.log('Sidebar Received Response Messages:', responseMessages);
        this.messages = [...this.messages, ...responseMessages];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Sidebar Subscription Error:', err);
        this.messages = [...this.messages, { role: 'model', type: 'text', text: 'Sorry, I encountered an error connecting to the agent.' }];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      complete: () => {
        console.log('Sidebar Subscription Complete');
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
