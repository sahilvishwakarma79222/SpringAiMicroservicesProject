package com.sahiltech.task.tracker.model;

import lombok.*;

import java.time.LocalDate;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Module {

    private long id;
    private String name;               //  renamed
    private String description;
    private String status;
    private String priority;
    private String clientName;
    private long projectId;            //  camelCase (project_id → projectId.
    private LocalDate startDate;       //  new field
    private LocalDate completedDate;   //  new field
}
