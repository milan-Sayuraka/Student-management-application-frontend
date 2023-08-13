// student-details.component.ts
import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentModel } from '../../models/student.model';
import { StudentService } from 'src/app/core/http/student.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationDialogComponent } from '../delete-confirmation-dialog/delete-confirmation-dialog.component';

@Component({
  selector: 'app-student-details',
  templateUrl: './student-details.component.html',
  styleUrls: ['./student-details.component.css']
})
export class StudentDetailsComponent implements OnInit {
  @Input() student: StudentModel | null = null;
  @Output() updateStudent = new EventEmitter<StudentModel>();
  @Output() deleteStudentEvent = new EventEmitter<number>();
  @Output() closeDetails = new EventEmitter<void>();
  isEditMode = false;
  studentForm!: FormGroup;
  initialDateOfBirth: Date | null = null;
  temporaryStudent: StudentModel | null = null;
  image = '../../../../assets/img/color-user.png';

  constructor(
    private studentService: StudentService,
    private formBuilder: FormBuilder,
    private dialog: MatDialog
  ) {
    this.studentForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      mobile: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      nic: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      address: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadStudentDetails();
  }

  ngOnChanges() {
    this.loadStudentDetails();
  }

  private loadStudentDetails(): void {
    if (this.student) {
      this.studentService.getStudent(this.student.id)
        .subscribe(
          fetchedStudent => {
            this.student = fetchedStudent;
            this.initializeFormValues();
            this.temporaryStudent = { ...this.student, id: this.student.id };
          },
          error => {
            console.error('Error fetching student details:', error);
          }
        );
    }
  }

  private initializeFormValues(): void {
    if (this.student) {
      const formValues = {
        firstName: this.student.firstName,
        lastName: this.student.lastName,
        mobile: this.student.mobile,
        email: this.student.email,
        nic: this.student.nic,
        dateOfBirth: this.student.dateOfBirth,
        address: this.student.address,
      };

      this.studentForm.patchValue(formValues);
      this.initialDateOfBirth = this.student.dateOfBirth || null;
    }
  }

  onUpdateStudent(): void {
    if (this.studentForm.valid && this.student) {
      console.log('update...', this.studentForm);
      const updatedStudent: StudentModel = {
        id: this.student.id,
        firstName: this.studentForm.value.firstName,
        lastName: this.studentForm.value.lastName,
        mobile: this.studentForm.value.mobile,
        email: this.studentForm.value.email,
        nic: this.studentForm.value.nic,
        dateOfBirth: this.studentForm.value.dateOfBirth,
        address: this.studentForm.value.address,
      };
      this.studentService
        .updateStudent(updatedStudent)
        .subscribe(
          response => {
            console.log(response.message);
            this.isEditMode = false;
            this.student = updatedStudent;
            this.updateStudent.emit(updatedStudent);
          },
          error => {
            console.error('Error updating student:', error);
          }
        );
    }
  }

  onDeleteStudent(): void {
    if (this.student) {
      const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent);
  
      dialogRef.afterClosed().subscribe(result => {
        if (result === true) {
          this.studentService
            .deleteStudent(this.student!.id)
            .subscribe(
              response => {
                console.log(response.message);
                this.deleteStudentEvent.emit(this.student!.id); // Emit the student's id
              },
              error => {
                console.error('Error deleting student:', error);
              }
            );
        }
      });
    }
  }
  

  enableEdit(): void {
    if (this.student) {
      this.isEditMode = true;
      this.initializeFormValues();
      this.initialDateOfBirth = this.student.dateOfBirth || null;
    }
  }

  cancelEdit(): void {
    this.isEditMode = false;
  }

  cancelView(): void {
    this.closeDetails.emit();
  }

  onCancelEdit(): void {
    this.isEditMode = false;
    if (this.student) {
      this.temporaryStudent = { ...this.student, id: this.student.id };
    }
    this.initializeFormValues();
  }
}
