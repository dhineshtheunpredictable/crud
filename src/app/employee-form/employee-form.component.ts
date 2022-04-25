import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import * as moment from 'moment';
import { environment } from 'src/environments/environment';

import { employeeDetail } from '../home/home.component';

@Component({
  selector: 'app-employee-form',
  templateUrl: './employee-form.component.html',
  styleUrls: ['./employee-form.component.scss']
})
export class EmployeeFormComponent implements OnInit {
  defaultDate = moment(new Date()).format('YYYY-MM-DDTHH:mm');
  maxDate = moment(new Date()).format('YYYY-MM-DDTHH:mm');
  isSuccess = false;
  editMode = false;
  employeeId = null;
  successMessage = '';
  url = environment.apiUrl;

  employeeDetailsForm = new FormGroup({
    dob: new FormControl(this.defaultDate, Validators.required),
    emailAddress: new FormControl('', {validators: [Validators.required, Validators.email], updateOn: 'blur'}),
    phoneNumber: new FormGroup({
      code: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{3}$')]),
      firstPart: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{3}$')]),
      secondPart: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{4}$')]),
    }),
    gender: new FormControl('true', Validators.required),
    company: new FormControl('', Validators.required),
    fullName: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]),
    position: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]*$')])
  });

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.params?.id;
    this.editMode = this.employeeId ? true : false;
    this.getSelectedEmployeeDetail();
  }

  /**
   * @description To get selected employee Details
   */
  getSelectedEmployeeDetail(): void {
    if (this.editMode) {
      this.http.get<employeeDetail>(`${this.url}/${this.employeeId}`).subscribe( employeeDetail => {
        this.employeeDetailsForm.setValue({
          dob: moment(new Date(employeeDetail.dob)).format('YYYY-MM-DDTHH:mm'),
          emailAddress: employeeDetail.email,
          phoneNumber: {
            code: this.extractNumber(employeeDetail.phone, '(', ')'),
            firstPart: this.extractNumber(employeeDetail.phone, ' ', '-'),
            secondPart: this.extractNumber(employeeDetail.phone, '-'),
          },
          gender: employeeDetail.gender.toString(),
          company: employeeDetail.company,
          fullName: employeeDetail.fullName,
          position: employeeDetail.position
        });
      });
    }
  }

  /**
   * @description To extract number from string
   * @param number Full number string
   * @param startString starting string to trim
   * @param endString end string to trim
   */
  extractNumber(number: string, startString: string, endString = null) {
    if (endString === null) {
      return number.substring(number.indexOf(startString) + 1, number.length);
    }
    return number.substring(number.indexOf(startString) + 1, number.indexOf(endString));
  }

  /**
   * @description To Submit form if valid
   */
  onSubmit(): void {
    if (this.employeeDetailsForm.valid) {
      const formData = {
        dob:  moment(this.employeeDetailsForm.get('dob').value).format('lll'),
        email: this.employeeDetailsForm.get('emailAddress').value,
        phone: `(${this.employeeDetailsForm.get('phoneNumber.code').value}) ${this.employeeDetailsForm.get('phoneNumber.firstPart').value}-${this.employeeDetailsForm.get('phoneNumber.secondPart').value}`,
        gender: this.employeeDetailsForm.get('gender').value,
        company: this.employeeDetailsForm.get('company').value,
        fullName: this.employeeDetailsForm.get('fullName').value,
        position: this.employeeDetailsForm.get('position').value,
      };

      const saveMethod = this.editMode ?
        this.http.patch(`${this.url}/${this.employeeId}`, formData) :
        this.http.post(this.url, formData);
      saveMethod.subscribe( () => {
        this.employeeDetailsForm.reset();
        this.showSuccessMessage( this.editMode ? 'Form Updated Successfully' : 'Form Submitted Successfully');
      });
    }
  }

  /**
   * @description Trigger success alert message
   * @param msg success message
   */
  showSuccessMessage(msg: string) {
    this.isSuccess = true;
    this.successMessage = msg;
    setTimeout(() => {
      this.isSuccess = false;
      this.successMessage = '';
      this.router.navigate(['/']);
    }, 3000);
  }
}
