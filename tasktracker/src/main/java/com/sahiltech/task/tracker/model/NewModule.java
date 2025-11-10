package com.sahiltech.task.tracker.model;

import lombok.*;

import java.time.LocalDate;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class NewModule {

    private long id;
    private String modulename;
    private String description;
    private String status;
    private String priority;
    private String clientName;
    private long project_id;
    private LocalDate moduledate;
}
