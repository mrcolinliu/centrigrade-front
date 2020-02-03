import { Course } from './../../models/courses/course.model';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'courseListFilter'
})
export class CourseListFilterPipe implements PipeTransform {
  transform(courses: Course[], searchTerm?: string): any {
    if (!courses || !courses.length) return null;

    return courses.filter(
      course =>
        course.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.institutionName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
}
