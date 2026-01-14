import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import embed from 'vega-embed';

@Component({
  selector: 'app-vega-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div #chartContainer class="vega-chart-container"></div>
  `,
  styles: [`
    .vega-chart-container {
      width: 100%;
      overflow-x: auto;
    }
  `]
})
export class VegaChartComponent implements OnChanges, AfterViewInit {
  @Input() spec: any;
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;

  ngAfterViewInit() {
    this.renderChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['spec'] && !changes['spec'].firstChange) {
      this.renderChart();
    }
  }

  private async renderChart() {
    if (!this.spec || !this.chartContainer) return;

    try {
      await embed(this.chartContainer.nativeElement, this.spec, {
        actions: false, // Hide the "Export" actions menu for cleaner UI
        mode: 'vega-lite' // Default mode, autosurfaced if $schema provided
      });
    } catch (error) {
      console.error('Error rendering Vega chart:', error);
      // Fallback or error handling could go here
    }
  }
}
