package com.sahiltech.task.tracker.dto;

import lombok.*;
import java.time.LocalDateTime;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ErrorHistory {
	 private long id;
	    private long errorId;
	    private String action;
	    private String description;
	    private Long changedBy;
	    private LocalDateTime changedAt;
	    private String oldStatus;
	    private String newStatus;
}