import { NgModule } from '@angular/core';
import { OverallViewComponent } from './overall-view/overall-view.component';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SsdlcComponent } from './components/ssdlc/ssdlc.component';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { KpiCardComponent } from './components/kpi-card/kpi-card.component';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    RouterModule.forChild([
      {
        path: '',
        component: OverallViewComponent,
      },
    ]),
  ],
  declarations: [OverallViewComponent, SsdlcComponent, KpiCardComponent],
})
export class OverallModule {}
