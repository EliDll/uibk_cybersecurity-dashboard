import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ImportViewComponent } from './import-view/import-view.component';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ImportCardComponent } from './import-card/import-card.component';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  imports: [
    MatCardModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    CommonModule,
    MatTooltipModule,
    RouterModule.forChild([
      {
        path: '',
        component: ImportViewComponent,
      },
    ]),
  ],
  declarations: [ImportViewComponent, ImportCardComponent],
})
export class ImportModule {}
