import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css'],
})
export class TimerComponent implements OnInit, OnDestroy {
  @Input('time') time: string | null = null;
  @Output('updateTime') updateTime = new EventEmitter();
  private timerSubscription: Subscription = new Subscription();
  startTime = 0;
  currentTime = 0;
  running = false;

  ngOnInit(): void {
    this.currentTime = this.parseTimeStringToMilliseconds(this.time!);
  }

  startTimer() {
    console.log(this.currentTime);
    if (!this.running) {
      this.startTime = Date.now() - this.currentTime;
      this.timerSubscription = interval(10).subscribe(() => {
        this.currentTime = Date.now() - this.startTime;
      });
      this.running = true;
    }
  }

  stopTimer() {
    console.log('after', this.currentTime);
    if (this.running) {
      this.timerSubscription.unsubscribe();
      this.updateTime.emit(this.currentTime);
      this.running = false;
    }
  }

  resetTimer() {
    this.currentTime = 0;
    this.startTime = 0;
  }

  parseTimeStringToMilliseconds(durationString: string) {
    const regex = /PT((\d+)H)?((\d+)M)?((\d+)S)?/;
    const matches = durationString.match(regex);

    const hours = parseInt(matches![2] || '0', 10);
    const minutes = parseInt(matches![4] || '0', 10);
    const seconds = parseInt(matches![6] || '0', 10);

    return (hours * 3600 + minutes * 60 + seconds) * 1000;
  }

  ngOnDestroy() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
}
