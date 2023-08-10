package com.example.demo.activity;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/activities")
public class ActivityController {

    ActivityService activityService;

    @Autowired
    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    @PostMapping
    public void createActivity(@RequestBody @Valid Activity activity) {
        activityService.createActivity(activity);
    }

    @GetMapping
    public List<Activity> getActivities(@RequestParam(required = false) String project,
                                        @RequestParam(required = false) String date) {
        return activityService.getActivities(project, date);
    }
    @GetMapping("/projects/{date}")
    public List<String> getProjectsByDate(@PathVariable String date) {
        return activityService.getProjects(date);
    }

    @GetMapping("/{id}")
    public Activity getActivityById(@PathVariable Long id) {
        return activityService.getActivityById(id);
    }

    @PutMapping("/{id}")
    public Activity assignProjectOrTimeToActivity(@PathVariable Long id,
                                                  @RequestParam(required = false) String project,
                                                  @RequestParam(required = false) String time) {
        if (project != null)
            return activityService.assignActivityToProject(id, project);
        else if (time != null)
            return activityService.addTimeToActivity(id, time);

        return null;
    }

    @PutMapping("/edit/{id}")
    public Activity editActivity(@PathVariable Long id, @RequestBody Activity activity) {
        return activityService.editActivity(id, activity);
    }

    @DeleteMapping("/{id}")
    public void removeActivity(@PathVariable Long id) {
        activityService.removeActivity(id);
    }
}
