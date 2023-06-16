import { Component } from '@angular/core';
import { KpiTrends } from '../services/kpi-trends.service';

@Component({
  selector: 'app-overall-view',
  templateUrl: './overall-view.component.html',
  styleUrls: ['./overall-view.component.scss'],
})
export class OverallViewComponent {
  constructor(public readonly kpiTrends: KpiTrends) {}
}
