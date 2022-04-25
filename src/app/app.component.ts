import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  constructor( private router: Router ) {
    this.router.navigate(['/home'], { queryParams: {
      _page : 1,
      _limit : 10
    }});
  }
}
