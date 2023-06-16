import { Component, Input } from '@angular/core';
import { KpiTrend } from 'src/overall/services/kpi-trends.service';

@Component({
  selector: 'app-kpi-card',
  templateUrl: './kpi-card.component.html',
  styleUrls: ['./kpi-card.component.scss'],
})
export class KpiCardComponent {
  @Input() kpiTrend: KpiTrend;
  @Input() invert = false;
  @Input() title: string;
  @Input() suffix = '';
}
