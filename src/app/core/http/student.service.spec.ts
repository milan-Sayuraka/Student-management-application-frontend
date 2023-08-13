import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { StudentService } from './student.service';
import { StudentModel } from 'src/app/shared/models/student.model';
import { ResponseModel } from 'src/app/shared/models/response.model';

describe('StudentService', () => {
  let service: StudentService;
  let httpMock: HttpTestingController;

  const mockBaseUrl = 'https://localhost:7160';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        StudentService, // Include the service to be tested
        { provide: 'BASE_URL', useValue: mockBaseUrl } // Provide a mock BASE_URL
      ]
    });

    service = TestBed.inject(StudentService);
    httpMock = TestBed.inject(HttpTestingController);
  });


  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve students', fakeAsync(() => {
    const mockStudents: StudentModel[] = [
      {      
        id: 1,
        firstName: 'Updated John',
        lastName: 'Updated Doe',
        mobile: '1234567890',
        email: 'updated-john@example.com',
        nic: '987654321Y',
        dateOfBirth: new Date(),
        address: '456 Updated St'
      },
      {      
        id: 2,
        firstName: 'John',
        lastName: 'Doe',
        mobile: '1234567890',
        email: 'john@example.com',
        nic: '123456789X',
        dateOfBirth: new Date(),
        address: '123 Main St'
      },
    ];

    let studentsResult: StudentModel[] | undefined;
    
    service.getStudents().subscribe(students => {
      studentsResult = students;
    });

    const req = httpMock.expectOne(`${mockBaseUrl}/api/Student`);
    expect(req.request.method).toBe('GET');
    req.flush(mockStudents);

    tick(); // Simulate passage of time
    expect(studentsResult).toEqual(mockStudents);
  }));

  it('should retrieve a student by ID', () => {
    const mockStudent: StudentModel = {      
      id: 2,
      firstName: 'John',
      lastName: 'Doe',
      mobile: '1234567890',
      email: 'john@example.com',
      nic: '123456789X',
      dateOfBirth: new Date(),
      address: '123 Main St'
    }
    const studentId = 1;
    
    service.getStudent(studentId).subscribe(student => {
      expect(student).toEqual(mockStudent);
    });

    const req = httpMock.expectOne(`${mockBaseUrl}/api/Student/${studentId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockStudent);
  });

  it('should create a student', () => {
    const mockStudent: StudentModel = {      
      id: 2,
      firstName: 'John',
      lastName: 'Doe',
      mobile: '1234567890',
      email: 'john@example.com',
      nic: '123456789X',
      dateOfBirth: new Date(),
      address: '123 Main St'
    }
    const mockResponse: ResponseModel = { success: true, message: 'Created successfully' };
    
    service.createStudent(mockStudent).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${mockBaseUrl}/api/Student`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should update a student', () => {
    const mockStudent: StudentModel = {      
      id: 2,
      firstName: 'John',
      lastName: 'Doe',
      mobile: '1234567890',
      email: 'john@example.com',
      nic: '123456789X',
      dateOfBirth: new Date(),
      address: '123 Main St'
    }
    const mockResponse: ResponseModel = { success: true, message: 'Updated successfully' };
    
    service.updateStudent(mockStudent).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${mockBaseUrl}/api/Student`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockResponse);
  });

  it('should delete a student', () => {
    const studentId = 1;
    const mockResponse: ResponseModel = { success: true, message: 'Deleted successfully' };
    
    service.deleteStudent(studentId).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${mockBaseUrl}/api/Student/${studentId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });
});
