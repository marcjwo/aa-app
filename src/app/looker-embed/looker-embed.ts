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

  @Input() viewMode: 'dashboard' | 'report' = 'dashboard';
  @Input() dashboardUrl: string = 'https://looker.cloud-bi-opm.com/embed/dashboards/349?Agent=%22real_time_agent%22&Date+Range=2025%2F01%2F01+to+2026%2F01%2F14';
  @Input() reportUrl: string = 'https://lookerstudio.google.com:/embed/reporting/636ea626-6981-4043-b738-5657254666f8/page/8YdhF';

  safeDashboardUrl: SafeResourceUrl | undefined;
  safeReportUrl: SafeResourceUrl | undefined;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dashboardUrl']) {
      this.safeDashboardUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.dashboardUrl);
    }
    if (changes['reportUrl']) {
      this.safeReportUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.reportUrl);
    }
  }

  // Initialize on start if inputs are already set
  ngOnInit() {
    if (!this.safeDashboardUrl && this.dashboardUrl) {
      this.safeDashboardUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.dashboardUrl);
    }
    if (!this.safeReportUrl && this.reportUrl) {
      this.safeReportUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.reportUrl);
    }
  }
}
