import { Component, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-forminput',
  templateUrl: './forminput.component.html',
  styleUrls: ['./forminput.component.scss']
})
export class ForminputComponent {
  @Output() result = new EventEmitter();
  money = [];

  constructor() {
    this.money = [100000, 50000, 20000, 10000, 5000, 1000, 500, 100, 50];
  }

  onSubmit(f: NgForm): void {
    const inputValue = f.value.input;

    this.getResult(inputValue)
    .then(
      result=>{
        this.result.emit(result);
        if(!result.passed) {
          // swal alert
          this.swalCustomType('warning', result.message, 'Convertion Failed')
          .then(
            ()=>{
              f.reset();
            }
          )
        }
      }
    )
  }

  /*

  step 1 check for invalid input (checkForInvalidInput)
  step 2 if input not invalid, check for valid input and if valid convert into number only (convertValidInput)
  step 3 calculate number into 'uang pecahan' (calculateInputIntoShreddedRupiah)
  step 4 convert 'uang pecahan' into desired UI (convertNumberIntoDesiredResult)
  step 5 get the result (getResult)

  */

  async getResult(input): Promise<Result> {
    const isValidate = await this.checkForInvalidInput(input);
    let result = isValidate;
    if (!isValidate.passed) {
      return isValidate;
    }
    const convertedInput = this.convertValidInput(input);
    const shreddedRupiah = await this.calculateInputIntoShreddedRupiah(
      convertedInput
    );
    this.convertNumberIntoDesiredResult(shreddedRupiah)
    .then(
      res => {
        result['result'] = res;
      }
    )
    await result;
    return result;
  }

  // validation input from requirement
  convertValidInput(inp): number {
    let input = inp.toString();

    // 1st convert condition = 17.500,00
    if (
      input[input.length - 1] == 0 &&
      input[input.length - 2] == 0 &&
      input[input.length - 3] == ','
    ) {
      input = input.substring(0, input.length - 3);
    }
    // 2nd convert condition = 005.000 && 001000
    while (input.charAt(0) === '0') {
      input = input.substr(1);
    }

    //3nd convert into number only
    input = this.convertInputIntoNumberOnly(input);

    return parseInt(input);
  }

  // to convert valid number into 'uang pecahan'
  calculateInputIntoShreddedRupiah(input): any[] {
    let result = [];
    let inputNumber = parseInt(input);
    let smallestMoneyGiven = this.money[this.money.length - 1];
    while (inputNumber > smallestMoneyGiven && inputNumber != 0) {
      for (let i = 0; i < this.money.length; i++) {
        if (inputNumber >= this.money[i]) {
          inputNumber = inputNumber - this.money[i];
          result.push(this.money[i]);
          break;
        }
      }
      if (inputNumber < smallestMoneyGiven && inputNumber != 0) {
        result.push(inputNumber);
      }
    }
    return result;
  }

  //method for check invalidation input from requirement
  checkForInvalidInput(inp): Result {
    // let passed = true;
    let passed = { passed: true, message: 'Success', result: [] };
    let input = inp.toString();

    for (let i = 0; i < input.length; i++) {
      // 1st condition = 17,500 (invalid separator)
      if (input[i] == ',') {
        if (!this.isInputWithDoubleZerosAfterComma(input)) {
          passed['passed'] = false;
          passed['message'] = 'Invalid Separator';
          break;
        }
      }

      // 2nd condition = 2 500(invalid separator)
      if (input[i] == ' ') {
        if (!isNaN(parseInt(input[i - 1])) && !isNaN(parseInt(input[i + 1]))) {
          passed['passed'] = false;
          passed['message'] = 'Invalid Separator';
          break;
        }
      }

      // 3rd condition = 3000 Rp(valid character in wrong position)
      if (input[i].toLowerCase() == 'r' && input[i + 1].toLowerCase() == 'p') {
        if (input[i - 1]) {
          passed['passed'] = false;
          passed['message'] = 'Valid character in wrong position';
          break;
        }
      }

      // 4th condition = Rp (missing value)
      if (input[i].toLowerCase() == 'r' && input[i + 1].toLowerCase() == 'p') {
        if (!input[i + 2] || (input[i+2] == ' ' && !input[i+3])) {
          passed['passed'] = false;
          passed['message'] = 'Missing Value';
          break;
        }
      }
      // 5th condition (additional) = except Rp
    }
    return passed;
  }

  // utils

  // for make sure that ,00 is valid
  isInputWithDoubleZerosAfterComma(input): boolean {
    let passed = false;
    let inputLength = input.length;

    if (
      input[inputLength - 1] == 0 &&
      input[inputLength - 2] == 0 &&
      input[inputLength - 3] == ','
    ) {
      passed = true;
    }

    return passed;
  }

  convertInputIntoNumberOnly(input): number {
    return input.replace(/\D/g, '');
  }

  // from number convert into desired UI , example from 5000 to 1 x Rp5000
  async convertNumberIntoDesiredResult(arr): Promise<any> {
    let convertedResult = [];
    let tempMultiple = 1;
    let smallestMoneyGiven = this.money[this.money.length - 1];

    arr.forEach((element, index)=>{
      if(element == arr[index+1] ){
        tempMultiple++
      } else {
        if(element < smallestMoneyGiven ) {
          // if no available fraction
          convertedResult.push(`left Rp${element}`);
        } else {
          // if available fraction
          convertedResult.push(`${tempMultiple} x Rp${element}`);
          tempMultiple = 1;
        }
      }
    });
    const result = await Promise.all(convertedResult);
    return result
  }

  swalCustomType(type?, text?, title? ): Promise<any> {
    return Swal.fire({
       title,
       text,
       type,
       showCancelButton: false,
       allowOutsideClick: true,
       timer: 10000
    });
 }

}

interface Result {
  passed:boolean;
  message:string;
  result?:any[];
}
