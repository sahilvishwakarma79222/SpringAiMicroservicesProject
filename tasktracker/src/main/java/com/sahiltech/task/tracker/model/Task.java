package com.sahiltech.task.tracker.model;

import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Task {
    private long id;
    private String title;
    private String description;
    private String status;
    private Long projectId;
    private Long employeeId;

}
