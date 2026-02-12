package com.sahiltech.task.tracker.model;

import lombok.*;

import java.time.LocalDate;

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
     private String priority;       //  NEW
      private long projectId;
    private Long moduleId;
    private long employeeId;
     private Long errorId;       //  Link to Errors (can be null)
    private LocalDate assignedDate;
    private LocalDate completedDate;

}
