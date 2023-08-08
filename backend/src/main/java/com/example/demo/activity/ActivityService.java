package com.example.demo.activity;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ActivityService {

    private ActivityRepository activityRepository;

    @Autowired
    public ActivityService(ActivityRepository activityRepository) {
        this.activityRepository = activityRepository;
    }

    public void createActivity(Activity activity) {
        if (activityRepository.findByDescription(activity.getDescription()).isPresent()) {
            throw new RuntimeException("Activity with this description already exists");
        }
        activity.setDate(LocalDate.now());
        activityRepository.save(activity);
    }

    public List<Activity> getActivities(String project, String date) {
        List<Activity> allActivities = (List<Activity>) activityRepository.findAll();
        if (project != null && date != null) {
            return allActivities.stream().filter(activity -> activity.getDate().isEqual(LocalDate.parse(date)) && activity.getProjectName() != null && activity.getProjectName().equals(project)).toList();
        }
        if (project != null)
            return allActivities.stream().filter(activity -> activity.getProjectName() != null && activity.getProjectName().equals(project)).toList();
        if (date != null)
            return allActivities.stream().filter(activity -> activity.getDate().isEqual(LocalDate.parse(date))).toList();

        return allActivities;
    }

    public Activity getActivityById(Long id) {
        Optional<Activity> foundedActivity = activityRepository.findById(id);
        if (foundedActivity.isEmpty()) {
            throw new RuntimeException("Activity with this id does not exist");
        } else return foundedActivity.get();
    }

    public Activity assignActivityToProject(Long id, String project) {
        Optional<Activity> foundedActivity = activityRepository.findById(id);
        if (foundedActivity.isEmpty()) {
            throw new RuntimeException("Activity with this id does not exist");
        } else {
            foundedActivity.get().setProjectName(project);
            activityRepository.save(foundedActivity.get());
            return foundedActivity.get();
        }
    }

    public Activity editActivity(Long id, Activity activity) {
        Optional<Activity> foundedActivity = activityRepository.findById(id);
        if (foundedActivity.isEmpty()) {
            throw new RuntimeException("Activity with this id does not exist");
        } else {
            if (activity.getProjectName() == null && foundedActivity.get().getProjectName() != null) {
                activity.setProjectName(foundedActivity.get().getProjectName());
            }
            if (activity.getDescription() == null && foundedActivity.get().getDescription() != null) {
                activity.setDescription(foundedActivity.get().getDescription());
            }
            if (activity.getTime() == null && foundedActivity.get().getTime() != null) {
                activity.setTime(foundedActivity.get().getTime());
            }
            if (activity.getDate() == null && foundedActivity.get().getDate() != null) {
                activity.setDate(foundedActivity.get().getDate());
            }

            activity.setId(id);
            activityRepository.save(activity);
            return foundedActivity.get();
        }
    }

    public Activity addTimeToActivity(Long id, String time) {
        Optional<Activity> foundedActivity = activityRepository.findById(id);
        if (foundedActivity.isEmpty()) {
            throw new RuntimeException("Activity with this id does not exist");
        } else {
            foundedActivity.get().setTime(Duration.ofSeconds(Long.parseLong(time)));
            activityRepository.save(foundedActivity.get());
            return foundedActivity.get();
        }
    }

    public void removeActivity(Long id) {
        Optional<Activity> foundedActivity = activityRepository.findById(id);
        if (foundedActivity.isEmpty()) {
            throw new RuntimeException("Activity with this id does not exist");
        } else {
            activityRepository.delete(foundedActivity.get());
        }
    }
}
