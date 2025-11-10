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
    private LocalDate errordate;
    private LocalDate solved;
    private long projectId;
    private String priority;
    private String clientName;
}
