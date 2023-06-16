import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { MatCardModule } from '@angular/material/card';
import { ChartContainerComponent } from './chart-container/chart-container.component';
import { MatDividerModule } from '@angular/material/divider';

@NgModule({
  declarations: [ChartContainerComponent],
  imports: [CommonModule, NgChartsModule, MatCardModule, MatDividerModule],
  exports: [ChartContainerComponent],
})
export class ChartModule {}
