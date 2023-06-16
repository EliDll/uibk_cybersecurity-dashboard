import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DeploymentViewComponent } from './deployment-view/deployment-view.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: DeploymentViewComponent,
      },
    ]),
  ],
  declarations: [DeploymentViewComponent],
})
export class DeploymentModule {}
