import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface Message {
  role: 'user' | 'model';
  text: string;
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
    MatIconModule
  ],
  templateUrl: './gemini-sidebar.html',
  styleUrl: './gemini-sidebar.scss'
})
export class GeminiSidebar {
  messages: Message[] = [
    { role: 'model', text: 'Hi! I can help you analyze this data. Ask me anything about revenue, trends, or specific products.' }
  ];
  userInput = '';
  isLoading = false;

  async sendMessage() {
    if (!this.userInput.trim()) return;

    const text = this.userInput;
    this.userInput = '';
    this.messages.push({ role: 'user', text });
    this.isLoading = true;

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    let response = "I'm still learning, but that sounds interesting!";
    if (text.toLowerCase().includes('revenue')) {
      response = "Based on the dashboard, revenue has increased by 15% compared to last month, driven largely by the 'Classic Tee' product line.";
    } else if (text.toLowerCase().includes('trend')) {
      response = "The trend shows a steady upward trajectory in user acquisition, though retention rates have dipped slightly in the last week.";
    } else if (text.toLowerCase().includes('product')) {
      response = "The top performing product is 'Vintage Hoodie' with $12,349 in sales this week.";
    }

    this.messages.push({ role: 'model', text: response });
    this.isLoading = false;
  }
}
