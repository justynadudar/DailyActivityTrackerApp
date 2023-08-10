import { Component, Input, OnInit } from '@angular/core';
import { Activity } from '../models/activity';
import { ActivitiesService } from '../activities.service';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css'],
})
export class ActivityComponent implements OnInit {
  @Input('activity') activity: Activity | null = null;

  isProject = false;
  showProjectInput = false;
  editDescOn = false;
  editProjectOn = false;
  project: string | null = null;
  description: string | null = null;

  constructor(private activitiesService: ActivitiesService) {}

  ngOnInit(): void {
    if (this.activity?.projectName != null) {
      this.isProject = true;
      this.project = this.activity?.projectName;
    }
    this.description = this.activity!.description;
  }

  addProject() {
    this.activitiesService.assignProjectToActivity(
      this.activity!.id,
      this.project!
    );
  }

  updateTime(time: number) {
    this.activitiesService.updateTime(this.activity!.id, time);
  }

  removeActivity() {
    this.activitiesService.removeActivity(this.activity!.id);
  }

  editDescriptionOn() {
    this.editDescOn = true;
  }

  editDescription() {
    this.activitiesService.editDescription(
      this.activity!.id,
      this.description!
    );
  }
  editProject() {
    this.activitiesService.editProject(this.activity!.id, this.project!);
  }

  editOn() {
    this.editProjectOn = true;
  }
}
