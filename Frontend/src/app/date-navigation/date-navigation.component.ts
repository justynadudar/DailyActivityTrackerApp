import { Component, Input, OnInit } from '@angular/core';
import { ActivitiesService } from '../activities.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-date-navigation',
  templateUrl: './date-navigation.component.html',
  styleUrls: ['./date-navigation.component.css'],
})
export class DateNavigationComponent implements OnInit {
  currentDate: string | null;
  constructor(
    private activitiesService: ActivitiesService,
    private datePipe: DatePipe
  ) {
    this.currentDate = this.datePipe.transform(Date.now(), 'yyyy-MM-dd');
  }

  hasNextDay = false;

  ngOnInit(): void {
    this.activitiesService.date$.subscribe((date) => {
      this.currentDate = date;
    });
  }

  goToPrevious() {
    this.activitiesService.goToPrevious();
    this.hasNextDay = true;
  }

  goToNext() {
    this.activitiesService.goToNext();
    if (this.currentDate == this.datePipe.transform(Date.now(), 'yyyy-MM-dd'))
      this.hasNextDay = false;
  }
}
