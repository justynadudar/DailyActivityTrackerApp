import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  firstValueFrom,
  map,
  switchMap,
} from 'rxjs';
import { Activity } from './models/activity';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ActivitiesService {
  private activitiesSubject = new BehaviorSubject<Activity[]>([]);
  activities$ = this.activitiesSubject.asObservable();
  private dateSubject = new BehaviorSubject<string>('');
  date$ = this.dateSubject.asObservable();
  private projectsSubject = new BehaviorSubject<string[]>([]);
  projects$ = this.projectsSubject.asObservable();

  constructor(private readonly http: HttpClient, private datePipe: DatePipe) {
    this.dateSubject.next(
      this.datePipe.transform(Date.now().toString(), 'yyyy-MM-dd')!
    );
    this.getProjectsByDate().subscribe((projects: string[]) => {
      this.projectsSubject.next(projects);
    });
    this.getAllActivities().subscribe((activities: Activity[]) => {
      this.activitiesSubject.next(
        activities.filter(
          (activity) => activity.date === this.dateSubject.getValue()
        )
      );
    });
  }

  getAllActivities() {
    return this.http.get<Activity[]>(`http://localhost:8080/activities`);
  }

  createActivity(description: string, project: string) {
    let activity: ActivityRequest = {
      description: description,
      projectName: project,
      date: '',
      time: 0,
    };
    this.http.post('http://localhost:8080/activities', activity).subscribe(
      (response) => {
        this.getAllActivities().subscribe((activities: Activity[]) => {
          this.activitiesSubject.next(
            activities.filter(
              (activity) => activity.date === this.dateSubject.getValue()
            )
          );
        });
      },
      (error) => {
        alert('Activity with this description exists');
      }
    );
  }

  updateTime(id: number, time: number) {
    let activity: ActivityRequest = {
      description: null,
      projectName: null,
      date: null,
      time: parseInt((time / 1000).toFixed(0)),
    };

    this.http
      .put(`http://localhost:8080/activities/edit/${id}`, activity)
      .subscribe(
        (response) => {
          this.getAllActivities().subscribe((activities: Activity[]) => {
            this.activitiesSubject.next(
              activities.filter(
                (activity) => activity.date === this.dateSubject.getValue()
              )
            );
          });
        },
        (error) => {
          alert('Activity with this id does not exist');
        }
      );
  }

  removeActivity(id: number) {
    this.http.delete(`http://localhost:8080/activities/${id}`).subscribe(
      (response) => {
        this.getAllActivities().subscribe((activities: Activity[]) => {
          this.activitiesSubject.next(
            activities.filter(
              (activity) => activity.date === this.dateSubject.getValue()
            )
          );
        });
      },
      (error) => {
        alert('Activity with this id does not exist');
      }
    );
  }

  goToPrevious() {
    const dateObject = new Date(this.dateSubject.getValue());
    const newDate = new Date();
    newDate.setDate(dateObject.getDate() - 1);

    this.dateSubject.next(this.datePipe.transform(newDate, 'yyyy-MM-dd')!);
    this.getAllActivities().subscribe((activities: Activity[]) => {
      this.activitiesSubject.next(
        activities.filter(
          (activity) => activity.date === this.dateSubject.getValue()
        )
      );
    });
  }

  goToNext() {
    const dateObject = new Date(this.dateSubject.getValue());
    const newDate = new Date();
    newDate.setDate(dateObject.getDate() + 1);

    this.dateSubject.next(this.datePipe.transform(newDate, 'yyyy-MM-dd')!);
    this.getAllActivities().subscribe((activities: Activity[]) => {
      this.activitiesSubject.next(
        activities.filter(
          (activity) => activity.date === this.dateSubject.getValue()
        )
      );
    });
  }

  assignProjectToActivity(id: number, project: string) {
    this.http
      .put(`http://localhost:8080/activities/${id}?project=${project}`, null)
      .subscribe(
        (response) => {
          this.getAllActivities().subscribe((activities: Activity[]) => {
            this.activitiesSubject.next(
              activities.filter(
                (activity) => activity.date === this.dateSubject.getValue()
              )
            );
          });
        },
        (error) => {
          alert('Activity with this id does not exist');
        }
      );
  }

  getProjectsByDate() {
    return this.http.get<string[]>(
      `http://localhost:8080/activities/projects/${this.dateSubject.getValue()}`
    );
  }

  editProject(id: number, project: string) {
    let activity: ActivityRequest = {
      description: null,
      projectName: project,
      date: null,
      time: null,
    };

    this.http
      .put(`http://localhost:8080/activities/edit/${id}`, activity)
      .subscribe(
        (response) => {
          this.getAllActivities().subscribe((activities: Activity[]) => {
            this.activitiesSubject.next(
              activities.filter(
                (activity) => activity.date === this.dateSubject.getValue()
              )
            );
          });
        },
        (error) => {
          alert('Activity with this id does not exist');
        }
      );
  }

  editDescription(id: number, description: string) {
    let activity: ActivityRequest = {
      description: description,
      projectName: null,
      date: null,
      time: null,
    };

    this.http
      .put(`http://localhost:8080/activities/edit/${id}`, activity)
      .subscribe(
        (response) => {
          this.getAllActivities().subscribe((activities: Activity[]) => {
            this.activitiesSubject.next(
              activities.filter(
                (activity) => activity.date === this.dateSubject.getValue()
              )
            );
          });
        },
        (error) => {
          alert('Activity with this id does not exist');
        }
      );
  }
}

export interface ActivityRequest {
  description: string | null;
  date: string | null;
  time: number | null;
  projectName: string | null;
}
