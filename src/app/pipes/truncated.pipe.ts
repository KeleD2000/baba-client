import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncated'
})
export class TruncatedPipe implements PipeTransform {
  
  transform(value: string, lines: number): string {
    const textLines = value.split('\n', lines);
    return textLines.join('\n');
  }

}
