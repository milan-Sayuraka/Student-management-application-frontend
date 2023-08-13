import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { StudentCreateComponent } from './student-create.component';
import { StudentService } from '../core/http/student.service';

describe('StudentCreateComponent', () => {
  let component: StudentCreateComponent;
  let fixture: ComponentFixture<StudentCreateComponent>;
  let studentService: jasmine.SpyObj<StudentService>;
  let router: Router;
  let location: Location;

  beforeEach(() => {
    const studentServiceSpy = jasmine.createSpyObj('StudentService', ['createStudent']);

    TestBed.configureTestingModule({
      declarations: [StudentCreateComponent],
      imports: [FormsModule, ReactiveFormsModule, RouterTestingModule],
      providers: [{ provide: StudentService, useValue: studentServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentCreateComponent);
    component = fixture.componentInstance;
    studentService = TestBed.inject(StudentService) as jasmine.SpyObj<StudentService>;
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty values', () => {
    expect(component.studentForm.value).toEqual({
      firstName: '',
      lastName: '',
      mobile: '',
      email: '',
      nic: '',
      dateOfBirth: '',
      address: '',
    });
  });

  it('should mark form as invalid when required fields are empty', () => {
    component.studentForm.patchValue({
      firstName: '',
      lastName: '',
      mobile: '',
      email: '',
      nic: '',
      dateOfBirth: '',
      address: '',
    });

    expect(component.studentForm.invalid).toBeTrue();
  });


  it('should mark form as valid when all required fields are filled', () => {
    component.studentForm.patchValue({
      firstName: 'John',
      lastName: 'Doe',
      mobile: '1234567890',
      email: 'john@example.com',
      nic: '123456789X',
      dateOfBirth: '1999-04-23',
      address: '123 Main St',
    });

    expect(component.studentForm.valid).toBeTrue();
  });

  it('should call createStudent method and navigate on form submission', fakeAsync(() => {
    const dummyResponse = { success: true, message: 'Student created.' };
    studentService.createStudent.and.returnValue(of(dummyResponse));

    setFormValues({
      firstName: 'John',
      lastName: 'Doe',
      mobile: '1234567890',
      email: 'john@example.com',
      nic: '123456789X',
      dateOfBirth: '1999-04-23',
      address: '123 Main St',
    });

    spyOn(router, 'navigate');

    component.onSubmit();
    tick();
  
    expect(studentService.createStudent).toHaveBeenCalledWith(component.studentForm.value);
    expect(router.navigate).toHaveBeenCalledWith(['/student-list']);
  }));

  function setFormValues(values: any) {
    component.studentForm.patchValue(values);
  }

  it('should reset the form on clearForm method call', () => {
    setFormValues({
      firstName: 'John',
      lastName: 'Doe',
      mobile: '1234567890',
      email: 'john@example.com',
      nic: '123456789X',
      dateOfBirth: '1999-04-23',
      address: '123 Main Street',
    });

    component.clearForm();

    const formValues = component.studentForm.value;
    expect(formValues).toEqual({
      firstName: null,
      lastName: null,
      mobile: null,
      email: null,
      nic: null,
      dateOfBirth: null,
      address: null,
    });
  });

});
