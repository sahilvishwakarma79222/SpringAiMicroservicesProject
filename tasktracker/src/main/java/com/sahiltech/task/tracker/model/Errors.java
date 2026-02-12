package com.sahiltech.task.tracker.model;

import lombok.*;

import java.time.LocalDate;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Errors {

    private long id;
    private String title;
    private String description;
    private String status;
    private String priority;
    private String clientName;
     private long projectId;
 
     private Long moduleId;      // nullable
    private Long reportedBy;    // nullable
    private Long assignedTo;    // nullable
 
    private LocalDate errorDate;
    private LocalDate solvedDate;
}
