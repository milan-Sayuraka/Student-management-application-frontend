import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { StudentService } from '../core/http/student.service';
import { StudentModel } from '../shared/models/student.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
})
export class StudentListComponent implements OnInit {
  students: StudentModel[] = [];
  selectedStudent: StudentModel | null = null;
  dataSource!: MatTableDataSource<StudentModel>;
  displayedColumns: string[] = ['image', 'firstName', 'lastName', 'mobile', 'email', 'nic'];
  image = '../../../../assets/img/color-user.png';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private destroy$ = new Subject<void>();

  constructor(private studentService: StudentService) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<StudentModel>([]);
    this.loadStudents();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadStudents(): void {
    this.studentService
      .getStudents()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (students) => {
          this.students = students;
          this.dataSource = new MatTableDataSource<StudentModel>(this.students);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        (error) => {
          console.error('Error fetching students:', error);
        }
      );
  }


  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }



  selectStudent(student: StudentModel): void {
    console.log('selectStudent called with student:', student);
    this.selectedStudent = this.selectedStudent === student ? null : student;
  }


  onUpdateStudent(updatedStudent: StudentModel): void {
    const index = this.students.findIndex(student => student.id === updatedStudent.id);
    if (index !== -1) {
      this.students[index] = updatedStudent;
      this.loadStudents();
    }
  }

  onDeleteStudent(id: number | undefined): void {
    if (id !== undefined) {
      this.studentService.deleteStudent(id).subscribe(
        response => {
          console.log(response.message);
          const index = this.students.findIndex(student => student.id === id);
          if (index !== -1) {
            this.students.splice(index, 1);
            this.dataSource.data = this.students;
            this.selectedStudent = null;
          }
        },
        error => {
          console.error('Error deleting student:', error);
        }
      );
    }
  }

  closeStudentDetails(): void {
    this.selectedStudent = null;
  }

}
