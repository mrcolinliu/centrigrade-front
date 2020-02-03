import { Pipe, PipeTransform } from '@angular/core';
import { CourseArea } from './../../../models/courses/courseArea.model';

@Pipe({
  name: 'courseAreaFilter'
})
export class CourseAreaFilterPipe implements PipeTransform {
  transform(courseAreas: CourseArea[], name: string, highlightedOnly: boolean): any {
    if (courseAreas == null) {
      return null;
    }

    var list = courseAreas.filter(
      course =>
        course.highlighted == highlightedOnly &&
        course.title.toLowerCase().includes(name.toLowerCase())
    );

    return list.sort((a, b) => a.ordinal - b.ordinal);
  }
}
