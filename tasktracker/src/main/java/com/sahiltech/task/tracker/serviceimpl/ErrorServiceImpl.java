package com.sahiltech.task.tracker.serviceimpl;

import com.sahiltech.task.tracker.dto.ErrorHistory;
import com.sahiltech.task.tracker.model.Errors;
 import com.sahiltech.task.tracker.repository.ErrorRepo;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;

@Service
public class ErrorServiceImpl {

    private final ErrorRepo errorRepo;

    public ErrorServiceImpl(ErrorRepo errorRepo) {
        this.errorRepo = errorRepo;
    }

    public Errors saveError(Errors error) {
        if (error.getReopenCount() == null) error.setReopenCount(0);
        return errorRepo.saveError(error);
    }
    
    public Errors getErrorById(Long id) {
        return errorRepo.getById(id);
    }
    
    public List<ErrorHistory> getErrorHistory(Long id) {
        return errorRepo.getHistoryByErrorId(id);
    }
    
    public String updateStatus(Long id, String status, Long resolvedBy) {
        errorRepo.updateStatus(id, status, resolvedBy);
        errorRepo.addHistory(id, status.toUpperCase(), "Status updated to " + status, resolvedBy, null, status);
        return "Status updated successfully";
    }
    
    public String reopenError(Long id, Long assignedTo, String reason) {
        errorRepo.reopenError(id, assignedTo);
        errorRepo.addHistory(id, "REOPENED", reason, assignedTo, "Resolved/Closed", "Open");
        return "Error reopened successfully";
    }

    public String updateError(Long id, Errors error) {
        int updated = errorRepo.updateError(id, error);
        return updated > 0 ? "Error updated successfully" : "Error not found";
    }

    public String deleteError(long id) {
        int deleted = errorRepo.deleteError(id);
        return deleted > 0 ? "Error deleted successfully" : "Error not found";
    }

    public Map<String, Object> getSmartPaginatedErrors(
            int page,
            int size,
            String sortBy,
            String sortDir,
            String search
    ) {
        return errorRepo.getErrorsSmartPagination(page, size, sortBy, sortDir, search);
    }
}