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
    private String employeeName;
    private String projectName;
    private LocalDate assignedDate;
    private LocalDate completedDate;
}
