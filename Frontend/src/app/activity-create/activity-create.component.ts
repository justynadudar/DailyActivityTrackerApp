import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivitiesService } from '../activities.service';

@Component({
  selector: 'app-activity-create',
  templateUrl: './activity-create.component.html',
  styleUrls: ['./activity-create.component.css'],
})
export class ActivityCreateComponent {
  constructor(
    private fb: FormBuilder,
    private activitiesService: ActivitiesService
  ) {}

  showProjectInput = false;

  activityForm = this.fb.group({
    description: ['', Validators.required],
    project: [''],
  });

  submit() {
    this.activitiesService.createActivity(
      this.activityForm.get('description')?.value!,
      this.activityForm.get('project')?.value!
    );
    this.showProjectInput = false;
    this.activityForm.reset();
  }
}
