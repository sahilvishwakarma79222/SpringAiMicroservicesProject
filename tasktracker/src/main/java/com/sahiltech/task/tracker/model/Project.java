package com.sahiltech.task.tracker.model;

import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Project {
    private long id;
    private String name;
    private String description;
    private String status;
}
