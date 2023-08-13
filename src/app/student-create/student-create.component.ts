import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentService } from '../core/http/student.service';
import { StudentModel } from '../shared/models/student.model';

const CONTROL_NAMES = {
  firstName: 'firstName',
  lastName: 'lastName',
  mobile: 'mobile',
  email: 'email',
  nic: 'nic',
  dateOfBirth: 'dateOfBirth',
  address: 'address',
};

@Component({
  selector: 'app-student-create',
  templateUrl: './student-create.component.html',
  styleUrls: ['./student-create.component.css']
})
export class StudentCreateComponent implements OnInit {
  studentForm: FormGroup;
  image = '../../../../assets/img/color-user.png';

  constructor(
    private formBuilder: FormBuilder,
    private studentService: StudentService,
    private router: Router
  ) {
    this.studentForm = this.initializeForm();
  }

  ngOnInit(): void {
  }

  private initializeForm(): FormGroup {
    return this.formBuilder.group({
      [CONTROL_NAMES.firstName]: ['', Validators.required],
      [CONTROL_NAMES.lastName]: ['', Validators.required],
      [CONTROL_NAMES.mobile]: ['', Validators.required],
      [CONTROL_NAMES.email]: ['', [Validators.required, Validators.email]],
      [CONTROL_NAMES.nic]: ['', Validators.required],
      [CONTROL_NAMES.dateOfBirth]: ['', Validators.required],
      [CONTROL_NAMES.address]: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.studentForm.valid) {
      this.createStudent();
    }
  }

  private createStudent(): void {
    const newStudent: StudentModel = this.studentForm.value;
    this.studentService.createStudent(newStudent).subscribe(
      (response: any) => {
        console.log(response.message);
        this.router.navigate(['/student-list']);
      },
      (error: any) => {
        console.error('Error creating student:', error);
      }
    );
  }

  clearForm(): void {
    this.studentForm.reset();
  }
}
