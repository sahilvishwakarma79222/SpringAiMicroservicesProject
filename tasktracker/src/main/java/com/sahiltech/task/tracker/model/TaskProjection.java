package com.sahiltech.task.tracker.model;

import lombok.*;

import java.time.LocalDate;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class TaskProjection {

    private long id;
    private String title;
    private String status;
    private String name;
    private String projectname;

    private LocalDate assignedDate;
    private LocalDate completedDate;
}
