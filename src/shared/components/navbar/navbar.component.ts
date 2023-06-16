import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouteNames } from '../../util/routes';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  routeNames = RouteNames;

  constructor(private readonly router: Router) {}

  navigateTo(to: string): void {
    this.router.navigate(['/' + to]);
  }
}
