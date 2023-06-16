import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'security-dashboard';
  showFilter$: Observable<boolean>;

  constructor(router: Router, location: Location) {
    this.showFilter$ = router.events.pipe(map(() => location.path() !== ''));
  }
}
