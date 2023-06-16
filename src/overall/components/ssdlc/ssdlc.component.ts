import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouteNames } from '../../../shared';
import { ChartColor } from '../../../chart';

@Component({
  selector: 'app-ssdlc',
  templateUrl: './ssdlc.component.html',
  styleUrls: ['./ssdlc.component.scss'],
})
export class SsdlcComponent {
  readonly TITLE_BACKGROUND_COLOR = ChartColor.HILTI_RED;
  readonly DESCRIPTION_BACKGROUND_COLOR = ChartColor.WARM_CONCRETE;
  readonly SSDLC_BACKGROUND_COLOR = ChartColor.BURGUNDY;

  readonly TITLE_DIVIDER_COLOR = 'lightgrey';
  readonly DESCRIPTION_DIVIDER_COLOR = 'black';

  readonly ARROW_COLOR = ChartColor.BURGUNDY;

  readonly OVERLAY_COLOR = 'lightgrey';

  readonly TITLE_FONT_COLOR = 'white';
  readonly DESCRIPTION_FONT_COLOR = 'black';
  readonly SSDLC_FONT_COLOR = 'lightgrey';
  readonly OUTER_FONT_COLOR = 'black';

  routeNames = RouteNames;

  constructor(private router: Router) {}

  navigateTo(route: RouteNames) {
    this.router.navigate([route]);
  }

  startAnimation(selector: string) {
    const animateMe = document.querySelector(selector);
    animateMe?.classList.add('animate');
  }

  resetAnimation(selector: string) {
    const animateMe = document.querySelector(selector);
    animateMe?.classList.remove('animate');
  }
}
