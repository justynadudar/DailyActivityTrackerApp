import { Component, OnInit } from '@angular/core';
import { ActivitiesService } from '../activities.service';
import { Activity } from '../models/activity';
import { DatePipe } from '@angular/common';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.css'],
})
export class ActivityListComponent implements OnInit {
  constructor(
    private activitiesService: ActivitiesService,
    private dataPipe: DatePipe
  ) {}

  activities: Activity[] = [];
  projects: String[] = [];
  date: string | null = null;
  selectedFilterOption = '';

  ngOnInit() {
    this.activitiesService.date$.subscribe((value) => {
      this.date = value;
    });
    this.activitiesService.activities$.subscribe((activities) => {
      this.activities = activities;

      activities.filter((activity) => activity.date === this.date);
      this.activities.sort(
        (activity1, activity2) => activity1.id - activity2.id
      );
    });
    this.activitiesService.projects$.subscribe((projects) => {
      this.projects = projects;
      console.log(this.projects);
    });
  }

  getActivities(): Activity[] {
    if (
      this.selectedFilterOption != 'all' &&
      this.selectedFilterOption != '' &&
      this.selectedFilterOption != 'withoutProject'
    ) {
      return this.activities.filter(
        (activity) => activity.projectName == this.selectedFilterOption
      );
    }
    if (this.selectedFilterOption == 'withoutProject') {
      return this.activities.filter((activity) => activity.projectName == null);
    }
    return this.activities;
  }

  generatePDF() {
    const doc = new jsPDF();

    const autotableData = this.activities.map((activity) => [
      activity.description,
      activity.projectName,
      this.parseTime(activity.time),
    ]);

    autoTable(doc, {
      head: [['description', 'project', 'time']],
      body: autotableData.reverse(),
    });

    doc.save(`${this.date}.pdf`);
  }

  parseTime(durationString: string) {
    const regex = /PT((\d+)H)?((\d+)M)?((\d+)S)?/;
    const matches = durationString.match(regex);

    const hours = matches![2] || '0';
    const minutes = matches![4] || '0';
    const seconds = matches![6] || '0';

    const formattedTime = `${hours.padStart(2, '0')}:${minutes.padStart(
      2,
      '0'
    )}:${seconds.padStart(2, '0')}`;
    return formattedTime;
  }
}
