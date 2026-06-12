package com.sahiltech.task.tracker.model;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.sahiltech.task.tracker.dto.ErrorHistory;

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
	    private long projectId;
	    private Long moduleId;
	    private Long reportedBy;
	    private Long assignedTo;
	    private Long resolvedBy;  // ✅ New field - last resolver
	    private LocalDate errorDate;
	    private LocalDate solvedDate;
	    private Integer reopenCount;
	    private String resolutionNotes;  // ✅ New field
	    private LocalDateTime createdAt;
	    private LocalDateTime updatedAt;
	    private List<ErrorHistory> history;  // ✅ For timeline
}
