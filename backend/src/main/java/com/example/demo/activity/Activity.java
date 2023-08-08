package com.example.demo.activity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Duration;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "activities")
public class Activity {

    @Id
    @GeneratedValue
    private long id;

    @Column
    private String description;

    @Column
    private LocalDate date;

    @Column
    private Duration time;

    @Column
    private String projectName;

}
