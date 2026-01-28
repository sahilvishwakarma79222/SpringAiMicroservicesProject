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
<<<<<<< HEAD
    private String priority;       //  NEW
    private Long projectId;
    private Long moduleId;         //  NEW
    private Long employeeId;
=======
    private String priority;
    private long projectId;
    private Long moduleId;
    private long employeeId;
>>>>>>> a8c2907b139d5784acf2886000fb6a6fea40ca46
    private Long errorId;       // ✅ Link to Errors (can be null)
    private LocalDate assignedDate;
    private LocalDate completedDate;

}
