package com.sahiltech.task.tracker.serviceimpl;

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

    public int countErrors() {
        return errorRepo.countAllErrors();
    }

    public Errors saveError(Errors error) {
        return errorRepo.saveError(error);
    }

    public Errors getErrorById(Long id) {
        return errorRepo.getById(id);
    }

    public List<Errors> getAllErrors() {
        return errorRepo.getAllErrors();
    }

    public String updateError(Long id, Errors error) {
        return errorRepo.updateError(id, error);
    }

    public String deleteError(long id) {
        return errorRepo.deleteError(id);
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
