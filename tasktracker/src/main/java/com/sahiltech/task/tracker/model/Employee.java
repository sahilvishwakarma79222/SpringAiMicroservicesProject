package com.sahiltech.task.tracker.model;

import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Employee {

    private long id;
    private String name;
    private String email;
    private String department;

}
