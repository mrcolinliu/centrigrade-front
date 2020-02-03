import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'parseFormattedText'
})
export class ParseFormattedTextPipe implements PipeTransform {
  private regex: IRegexMatch[] = [
    { name: 'bullet', expression: /\n- /g, replacement: '<br /> &bull; ' },
    { name: 'nestedBullet', expression: /\n - /g, replacement: '<br /> &emsp; &#0183; ' },
    { name: 'newLine', expression: /\n/g, replacement: '<br />' },
    { name: 'bold', expression: /\*\*(.+?)\*\*/g, replacement: '<b>$1</b>' },
    { name: 'italic', expression: /__(.+?)__/g, replacement: '<i>$1</i>' },
    { name: 'h4', expression: /####(.+?)####/g, replacement: '<h4>$1</h4>' },
    { name: 'h3', expression: /###(.+?)###/g, replacement: '<h3>$1</h3>' },
    { name: 'h2', expression: /##(.+?)##/g, replacement: '<h2>$1</h2>' },
    { name: 'h1', expression: /#([^#\[\]\(\);]+?)#/g, replacement: '<h1>$1</h1>' },
    {
      name: 'link',
      expression: /\[(.+?)\]\((www\..+?|http:\/\/.+?|https:\/\/.+?|mailto:\/\/.+?)\)/g,
      replacement: '<a href="$2" target="_blank">$1</a>'
    }
    // { name: 'link', expression: /\[(.+?)\]\((www\..+?|http:\/\/.+?|https:\/\/.+?)\)/g, replacement: '<p class="normal">$1<br/><a href="$2">$2</a><p>' }
  ];

  transform(value: string, args?: any): string {
    let result: string = value;

    if (!result) {
      return '';
    }

    this.regex.forEach(style => {
      result = result.replace(style.expression, style.replacement);
    });

    return result;
  }
}

interface IRegexMatch {
  name: string;
  expression: RegExp;
  replacement: string;
}
