import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ActivityComponent } from './activity/activity.component';
import { ActivityListComponent } from './activity-list/activity-list.component';
import { ActivityCreateComponent } from './activity-create/activity-create.component';
import { TimerComponent } from './timer/timer.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { DateNavigationComponent } from './date-navigation/date-navigation.component';

@NgModule({
  declarations: [
    AppComponent,
    ActivityComponent,
    ActivityListComponent,
    ActivityCreateComponent,
    TimerComponent,
    DateNavigationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
