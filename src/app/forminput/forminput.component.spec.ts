import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { ForminputComponent } from './forminput.component';


describe('ForminputComponent', () => {
  let component: ForminputComponent;
  let fixture: ComponentFixture<ForminputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForminputComponent ],
      imports: [
        FormsModule,
        MDBBootstrapModule.forRoot()
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForminputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(' input = 17,500 should return false or invalid input', () => {
    const validate = component.checkForInvalidInput('17,500');
    expect(validate.passed).toBeFalsy();
  });

  it(' input = 2 500 should return false or invalid input', () => {
    const validate = component.checkForInvalidInput('2 500');
    expect(validate.passed).toBeFalsy();
  });

  it(' input = 3000 Rp should return false or invalid input', () => {
    const validate = component.checkForInvalidInput('3000 Rp');
    expect(validate.passed).toBeFalsy();
  });

  it(' input = Rp should return false or invalid input', () => {
    const validate = component.checkForInvalidInput('Rp');
    expect(validate.passed).toBeFalsy();
  });

  it(' input = Rp 50000,00 should return true or valid input', () => {
    const validate = component.checkForInvalidInput('Rp 50000,00');
    expect(validate.passed).toBeTruthy();
  });

  it('input = Rp 125015 | Valid input should convert into number data type', () => {
    const converted = component.convertValidInput('Rp 125015');
    expect(converted).toEqual(125015);
  });

  it('number input given should converted into shredded based on rupiahs (pecahan rupiah) in the requirement', () => {
    let converted = component.calculateInputIntoShreddedRupiah(25015);
    expect(converted).toEqual([20000, 5000, 15]);
    converted = component.calculateInputIntoShreddedRupiah(125015);
    expect(converted).toEqual([100000, 20000, 5000, 15]);
  });

  it('should convert given number into desired result , for example from Rp 125015 to 1x100000, 1x20000, 1x5000, 1x15 ', (done) => {
    component.convertNumberIntoDesiredResult([100000, 20000, 5000, 15])
    .then((result)=>{
      expect(result[0]).toEqual(`1 x Rp100000`);
      expect(result[1]).toEqual(`1 x Rp20000`);
      expect(result[2]).toEqual(`1 x Rp5000`);
      expect(result[3]).toEqual(`left Rp15`);
      done();
    })
  });

  it('should get desired result ', fakeAsync(() => {
    component.getResult('Rp125000')
    .then(
      result => {
        tick(5000);
        fixture.detectChanges();
        expect(result.passed).toBeTruthy();
        expect(result.message).toEqual('Success');
        expect(result.result).toEqual([ '1 x Rp100000', '1 x Rp20000', '1 x Rp5000' ])
      }
    )
  }))

  it('should get error result ', fakeAsync(() => {
    component.getResult('Rp125,000')
    .then(
      result => {
        tick(5000);
        fixture.detectChanges();
        expect(result.passed).toBeFalsy();
        expect(result.result).toEqual([])
      }
    )
  }))


});
