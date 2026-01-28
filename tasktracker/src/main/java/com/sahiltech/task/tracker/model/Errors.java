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
<<<<<<< HEAD
    private long projectId;
=======

    private long projectId;
    private Long moduleId;      // nullable
    private Long reportedBy;    // nullable
    private Long assignedTo;    // nullable
>>>>>>> a8c2907b139d5784acf2886000fb6a6fea40ca46

    private LocalDate errorDate;
    private LocalDate solvedDate;
}
