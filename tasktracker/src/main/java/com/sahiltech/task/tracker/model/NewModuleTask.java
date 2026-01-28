package com.sahiltech.task.tracker.model;

import lombok.*;

import java.time.LocalDate;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class NewModuleTask {
// not needed
    private long id;
    private String title;
    private String description;
    private String status;
    private long projectid;
    private long employeeid;
    private LocalDate assigneddate;
    private LocalDate completeddate;

}
