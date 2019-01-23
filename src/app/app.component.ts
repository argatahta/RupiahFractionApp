import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'tokped-exercise';
  resultValue = {};

  result(event): void {
    this.resultValue = event;
  }

}
