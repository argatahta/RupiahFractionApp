import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent {
  @Input() result: Result = {
    passed: false,
    message:null,
    result: []
  }

  constructor() { }


}

interface Result {
  passed:boolean;
  message:string;
  result?:any[];
}
