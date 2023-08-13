import { ComponentFixture, TestBed, flush, flushMicrotasks } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StudentListComponent } from './student-list.component';
import { StudentService } from '../core/http/student.service';
import { of } from 'rxjs';
import { StudentModel } from '../shared/models/student.model';
import { ResponseModel } from '../shared/models/response.model';
import { fakeAsync, tick } from '@angular/core/testing';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatInputModule } from '@angular/material/input';

describe('StudentListComponent', () => {
  let component: StudentListComponent;
  let fixture: ComponentFixture<StudentListComponent>;
  let studentService: StudentService;

  beforeEach(async () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    await TestBed.configureTestingModule({
      declarations: [StudentListComponent],
      imports: [
        HttpClientTestingModule,
        MatTableModule,
        MatPaginatorModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatSortModule
      ],
      providers: [StudentService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(StudentListComponent);
    component = fixture.componentInstance;
    studentService = TestBed.inject(StudentService);
    spyOn(component, 'loadStudents');
    spyOn(studentService, 'getStudents').and.returnValue(
      of([
        {
          id: 1,
          firstName: 'John',
          lastName: 'Doe',
          mobile: '1234567890',
          email: 'john@example.com',
          nic: '123456789X',
          dateOfBirth: new Date('1999-04-23T09:00:00.000Z'),
          address: '901 Ivy Avenue, Harborview'
        },
      ])
    );

    spyOn(studentService, 'updateStudent').and.returnValue(of({ success: true, message: 'Student updated.' }));
    spyOn(studentService, 'deleteStudent').and.returnValue(of({ success: true, message: 'Student deleted.' }));

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load students on initialization', fakeAsync(() => {
    const dummyStudents: StudentModel[] = [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        mobile: '1234567890',
        email: 'john@example.com',
        nic: '123456789X',
        dateOfBirth: new Date('1999-04-23T09:00:00.000Z'),
        address: '901 Ivy Avenue, Harborview'
      },
      {
        id: 2,
        firstName: 'Sarah',
        lastName: 'Miller',
        mobile: '777-888-9999',
        email: 'sarah.miller@example.com',
        nic: 'D98765',
        dateOfBirth: new Date('2000-01-15T09:00:00.000Z'),
        address: '456 Oak Lane, Countryside'
      },
    ];

    component.ngOnInit();
    fixture.detectChanges();

    tick();
    fixture.detectChanges();

    flushMicrotasks();
    flush();
  }));


  it('should filter table rows based on user input', fakeAsync(() => {
    const inputElement = fixture.nativeElement.querySelector('input');
    inputElement.value = 'John';
    inputElement.dispatchEvent(new Event('input'));

    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    flushMicrotasks();
    flush();
  }));

  it('should select a student', () => {
    const dummyStudent: StudentModel = {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      mobile: '1234567890',
      email: 'john@example.com',
      nic: '123456789X',
      dateOfBirth: new Date('1999-04-23T09:00:00.000Z'),
      address: '901 Ivy Avenue, Harborview'
    };
    component.selectStudent(dummyStudent);

    expect(component.selectedStudent).toBe(dummyStudent);
  });


  it('should update a student', () => {
    const updatedStudent: StudentModel = {
      id: 2,
      firstName: 'Sarah',
      lastName: 'Miller',
      mobile: '777-888-9999',
      email: 'sarah.miller@example.com',
      nic: 'D98765',
      dateOfBirth: new Date('2000-01-15T09:00:00.000Z'),
      address: '456 Oak Lane, Countryside'
    };

  });


  it('should delete a student', () => {
    const dummyStudentId = 123;
    component.onDeleteStudent(dummyStudentId);
    expect(component.loadStudents).toHaveBeenCalled();
  });

  it('should not have a selected student initially', () => {
    expect(component.selectedStudent).toBeNull();
  });
});
