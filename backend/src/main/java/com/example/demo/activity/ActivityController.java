package com.example.demo.activity;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
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
    public String createActivity(@RequestBody @Valid Activity activity) {
        try {
            activityService.createActivity(activity);
            return "Activity added";
        } catch (RuntimeException e) {
            return e.getMessage();
        }
    }

    @GetMapping
    public List<Activity> getActivities(@RequestParam(required = false) String project,
                                        @RequestParam(required = false) String date) {
        return activityService.getActivities(project, date);
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
    public String removeActivity(@PathVariable Long id) {
        try {
            activityService.removeActivity(id);
            return "Activity deleted";
        } catch (RuntimeException e) {
            return e.getMessage();
        }
    }
}
