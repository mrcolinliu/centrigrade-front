import { Breadcrumb } from '../../../models/_base/breadcrumb.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseShortlistComponent } from '../shortlist/course-shortlist.component';
import { Footer } from '../../../services/footer.service';
import { RouteBreadcrumbs } from '../../../services/routeBreadcrumbs.service';
import { ResearchService } from 'app/services/research.service';
import { CourseComparisonDetails } from '../../../models/research/research.models';
import { ComparePullDown } from '../../../models/research/research.models';

import { LocalisationService } from '../../../services/localisation.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-compare-courses',
  templateUrl: './compare-courses.component.html',
  styleUrls: ['./compare-courses.component.scss']
})
export class CompareCoursesComponent implements OnInit {
  static route: string = 'shortlist/compare';

  locale: any = {};

  courses: CourseComparisonDetails[] = [];
  compares: CourseComparisonDetails[] = [];

  mainRows: TableRow[] = [];
  otherRows: TableRow[] = [];

  informationHeaders: string[] = [];
  pulldownSelected: ComparePullDown[] = [];

  newInformation: object = null;

  informationString: string;
  columnData: any[] = [];
  informationData2: any[] = [];

  informationData: any[] = [];

  // Looping for ngFor - CL
  columnsToShow = Array(5)
    .fill(0)
    .map((x, i) => i); // [0,1,2,3,4]

  constructor(
    private route: ActivatedRoute,
    private localisation: LocalisationService,
    private routeBreadcrumbs: RouteBreadcrumbs,
    private footer: Footer,
    private researchService: ResearchService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    console.log(this.informationData);

    this.locale = this.localisation.getTranslationsForComponent('CompareCoursesComponent');

    let parentLocale = this.localisation.getTranslationsForComponent(
      'CourseShortlistComponent'
    ) as any;

    this.routeBreadcrumbs.breadcrumbs.next([
      new Breadcrumb(parentLocale.titleText, CourseShortlistComponent.route),
      new Breadcrumb(this.locale.titleText, null)
    ]);

    this.footer.update({
      title: this.locale.footerText,
      action: CourseShortlistComponent.route
    });

    this.route.params.subscribe(params => {
      let courseIds = (params.courseIds as string).split(',');
      this.setSelectMenu(courseIds);

      this.researchService.getShortlistComparison(courseIds).subscribe(result => {
        this.courses = result;
        console.log(this.courses);

        this.addSafeImage(this.courses); //sanitizer for bg image XSS

        // console.log('pulldownSelected');
        // console.log(this.pulldownSelected);
        // Create our comparison list
        this.courses.forEach((course, index) => {
          var id = course.courseId.toString(); // Needed for indexOf
          // Populate Information Section Headers
          course.information.forEach(info => {
            if (!this.informationHeaders.some(e => e == info.header)) {
              this.informationHeaders.push(info.header);
            }
          });
          // Not in comparison array so remove course
          // if (courseIds.indexOf(id) < 0) {
          //   this.compares = this.courses.filter(item => item !== this.courses[index]); // *ngIf will refresh and updates courses
          // }
        });

        console.log(this.informationHeaders);
        console.log('Shortlisted #' + this.courses.length);

        this.informationData2 = [
          [{ entryRequirements: 'Entry Requirements 1' }, { courseLength: 'Data 2 info' }],
          [{ entryRequirements: 'Entry Requirements 2' }],
          [{ entryRequirements: 'Entry Requirements 3' }]
        ];

        console.log(this.informationData2);
        // So for each course shortlisted
        this.courses.forEach(course => {
          // Decide whether if we have information data
          console.log('THE COURSE->' + course.institution);
          this.informationString = '';

          // Look at ALL information headers
          for (var i = 0; i < this.informationHeaders.length; i++) {
            console.log('comparingHeader->' + this.informationHeaders[i]);
            var comparingHeader = this.informationHeaders[i];
            var propertyName = 'entryRequirements' + i;
            // Does course information exist in this information headers
            for (var a = 0; a < course.information.length; a++) {
              //console.log('For course->' + course.information[a].header);
              //console.log('text->' + course.information[a].text);

              if (comparingHeader == course.information[a].header) {
                var match = true;
                // console.log('MATCH this course has the header->' + comparingHeader);
                // Add this to the information Data
                this.informationString +=
                  '{' + propertyName + ':' + '"' + course.information[a].text + '"' + '},';
                break; // We found a match compare next header
              }
            }
            // After searching through the course information no matches within informationHeaders put empty value
            if (match != true) {
              this.informationString += '{' + propertyName + ': "empty"},';
            } else {
              //console.log('We have matches');
            }
          }
          this.informationString = this.informationString.substring(
            0,
            this.informationString.length - 1
          );
          // JSONstring now setup we add to the informationData
        }); // END this.courses forEach()

        console.log('this.informationString');
        console.log(this.informationString);

        this.columnData.push(this.informationString);
        this.informationData.push(this.columnData);
        console.log('this.informationData');
        console.log(this.informationData);
      });
    });
  }

  setSelectMenu(courseIds: string[]) {
    // For the columns select the predefine the column
    for (var i = 0; i < this.columnsToShow.length; i++) {
      var id = '0'; // maybe we have empty column
      // typeof returns string
      if (typeof courseIds[i] != 'undefined') {
        id = courseIds[i];
      }
      var newData = { selected: id };
      this.pulldownSelected.push(newData);
    }
  }

  addSafeImage(cards) {
    for (var i = 0, len = cards.length; i < len; i++) {
      cards[i].safeImage = this.sanitizer.bypassSecurityTrustStyle(`url(${cards[i].image})`);
    }
  }

  selectComparison(courseIdSelected: string, column: string) {
    this.pulldownSelected[column].selected = courseIdSelected;

    let selectedComparisons = JSON.parse(
      sessionStorage.getItem('shortlistSelectedCourses') || '[]'
    );

    selectedComparisons.forEach(function(value, i) {
      if (column == i) {
        // replace with courseIdSelected
        selectedComparisons[i] = parseInt(courseIdSelected); // string was passed $event.target.value
      }
    });

    // console.log(selected);

    // Update the sessionStorage
    sessionStorage.setItem('shortlistSelectedCourses', JSON.stringify(selectedComparisons));
  }
}

class TableRow {
  header: string;
  data: TableData[] = [];

  constructor(header: string) {
    this.header = header;
  }
}

class TableData {
  text: string;
  rating: number;

  constructor(text: string, rating?: number) {
    this.text = text;
    this.rating = rating;
  }
}
