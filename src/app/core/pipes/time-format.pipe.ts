import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFormat'
})
export class TimeFormatPipe implements PipeTransform {
  transform(timeMs: number): string {
    if (!timeMs && timeMs !== 0) return '00:00:000';

    const minutes = Math.floor(timeMs / 60000);
    const seconds = Math.floor((timeMs % 60000) / 1000);
    const milliseconds = timeMs % 1000;

    const mm = this.pad(minutes, 2);
    const ss = this.pad(seconds, 2);
    const ms = this.pad(milliseconds, 3);

    return `${mm}:${ss}:${ms}`;
  }

  private pad(num: number, size: number): string {
    return num.toString().padStart(size, '0');
  }
}
