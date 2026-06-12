package com.sahiltech.task.tracker.model;


import java.util.Date;
import java.util.List;

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
    private String projecthead;
    private String projectmanager;
    private String status;
    private Date startDate;  
    private Date endDate;   
}
