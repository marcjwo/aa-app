import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-looker-embed',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './looker-embed.html',
  styleUrl: './looker-embed.scss'
})
export class LookerEmbed {
  @Input() viewMode: 'dashboard' | 'report' = 'dashboard';
}
