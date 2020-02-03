import { Pipe, PipeTransform } from '@angular/core';
import { QuestionOption } from './../../../models/questionnaire/questionOption.model';

@Pipe({
  name: 'options'
})
export class OptionsPipe implements PipeTransform {
  transform(options: QuestionOption[], name: string): any {
    if (options == null) {
      return null;
    }

    return options.filter(
      opt => !opt.notApplicableField && opt.title.toLowerCase().includes(name.toLowerCase())
    );
  }
}
