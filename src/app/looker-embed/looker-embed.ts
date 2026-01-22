import { Component, Input, inject, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-looker-embed',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './looker-embed.html',
  styleUrl: './looker-embed.scss'
})
export class LookerEmbed implements OnChanges {
  private sanitizer = inject(DomSanitizer);

  @Input() dashboardUrl: string = 'https://looker.cloud-bi-opm.com/embed/dashboards/358?allow_login_screen=true';

  safeDashboardUrl: SafeResourceUrl | undefined;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dashboardUrl']) {
      this.safeDashboardUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.dashboardUrl);
    }
  }

  // Initialize on start if inputs are already set
  ngOnInit() {
    if (!this.safeDashboardUrl && this.dashboardUrl) {
      this.safeDashboardUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.dashboardUrl);
    }
  }
}
