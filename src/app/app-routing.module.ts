import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotFoundPageComponent, RouteNames, SharedModule } from '../shared';
import { hasDataGuard } from '../analyzation';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: RouteNames.OVERALL,
      },
      {
        path: RouteNames.OVERALL,
        loadChildren: () =>
          import('../overall/overall.module').then((m) => m.OverallModule),
        canActivate: [hasDataGuard],
      },
      {
        path: RouteNames.TRAINING_VIEW,
        loadChildren: () =>
          import('../training/training.module').then((m) => m.TrainingModule),
        canActivate: [hasDataGuard],
      },
      {
        path: RouteNames.DEVELOPMENT_VIEW,
        loadChildren: () =>
          import('../development/development.module').then(
            (m) => m.DevelopmentModule
          ),
        canActivate: [hasDataGuard],
      },
      {
        path: RouteNames.DEPLOYMENT_VIEW,
        loadChildren: () =>
          import('../deployment/deployment.module').then(
            (m) => m.DeploymentModule
          ),
        canActivate: [hasDataGuard],
      },
      {
        path: RouteNames.IMPORT,
        loadChildren: () =>
          import('../import/import.module').then((m) => m.ImportModule),
      },
    ],
  },
  {
    path: '**',
    component: NotFoundPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), SharedModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}
