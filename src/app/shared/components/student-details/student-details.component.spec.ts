import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { StudentDetailsComponent } from './student-details.component';
import { of } from 'rxjs';
import { ResponseModel } from '../../models/response.model';
import { StudentModel } from '../../models/student.model';
import { StudentService } from 'src/app/core/http/student.service';

describe('StudentDetailsComponent', () => {
  let component: StudentDetailsComponent;
  let fixture: ComponentFixture<StudentDetailsComponent>;
  let mockStudentService: jasmine.SpyObj<StudentService>;

  beforeEach(async () => {
    mockStudentService = jasmine.createSpyObj('StudentService', ['updateStudent']);
    await TestBed.configureTestingModule({
      declarations: [StudentDetailsComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        HttpClientTestingModule,
        MatDialogModule,
      ],
      providers: [
        { provide: StudentService, useValue: mockStudentService }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(StudentDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should initialize studentForm with default values when ngOnInit is called', () => {
    component.ngOnInit();
    const formValues = component.studentForm.value;
    expect(formValues.firstName).toBe('');
    expect(formValues.lastName).toBe('');
    expect(formValues.mobile).toBe('');
    expect(formValues.email).toBe('');
    expect(formValues.email).toBe('');
    expect(formValues.nic).toBe('');
    expect(formValues.dateOfBirth).toBe('');
    expect(formValues.address).toBe('');
  });

  it('should set isEditMode to true and populate form fields when enableEdit is called', () => {
    const expectedDate = new Date('2000-05-06T15:00:00.000Z');
    component.student = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      mobile: '1234567890',
      email: 'john@example.com',
      nic: '123456789X',
      dateOfBirth: expectedDate,
      address: '123 Main St'
    };
    component.enableEdit();
    expect(component.studentForm.value.firstName).toBe('John');
    expect(component.studentForm.value.lastName).toBe('Doe');
    expect(component.studentForm.value.mobile).toBe('1234567890');
    expect(component.studentForm.value.email).toBe('john@example.com');
    expect(component.studentForm.value.nic).toBe('123456789X');
    expect(component.studentForm.value.dateOfBirth.getFullYear()).toBe(expectedDate.getFullYear());
    expect(component.studentForm.value.dateOfBirth.getMonth()).toBe(expectedDate.getMonth());
    expect(component.studentForm.value.dateOfBirth.getDate()).toBe(expectedDate.getDate());

    expect(component.studentForm.value.address).toBe('123 Main St');
  });

  it('should emit closeDetails event when cancelView is called', () => {
    spyOn(component.closeDetails, 'emit');
    component.cancelView();
    expect(component.closeDetails.emit).toHaveBeenCalled();
  });

  it('should update temporaryStudent and student when onUpdateStudent is called', () => {
    const response: ResponseModel = {
      success: true,
      message: 'Updated successfully'
    };
    const updatedStudent: StudentModel = {
      id: 1,
      firstName: 'Updated John',
      lastName: 'Updated Doe',
      mobile: '1234567890',
      email: 'updated-john@example.com',
      nic: '987654321Y',
      dateOfBirth: new Date(),
      address: '456 Updated St'
    };

    mockStudentService.updateStudent.and.returnValue(of(response));

    component.student = updatedStudent;
    component.onUpdateStudent();
  });



  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
