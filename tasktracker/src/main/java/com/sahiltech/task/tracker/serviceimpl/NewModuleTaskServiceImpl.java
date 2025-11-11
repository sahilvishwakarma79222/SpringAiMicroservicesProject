package com.sahiltech.task.tracker.serviceimpl;

import com.sahiltech.task.tracker.model.NewModuleTask;
import com.sahiltech.task.tracker.repository.NewModuleTaskRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class NewModuleTaskServiceImpl {

    private final NewModuleTaskRepo repo;

    public NewModuleTaskServiceImpl(NewModuleTaskRepo repo) {
        this.repo = repo;
    }

    public int countTasks() {
        return repo.countAllTasks();
    }

    public NewModuleTask saveTask(NewModuleTask task) {
        return repo.saveTask(task);
    }

    public NewModuleTask getTaskById(Long id) {
        return repo.getById(id);
    }

    public List<NewModuleTask> getAllTasks() {
        return repo.getAllTasks();
    }

    public String updateTask(Long id, NewModuleTask task) {
        return repo.updateTask(id, task);
    }

    public String deleteTask(long id) {
        return repo.deleteTask(id);
    }

    public Map<String, Object> getSmartPaginatedTasks(
            int page,
            int size,
            String sortBy,
            String sortDir,
            String search
    ) {
        return repo.getTasksSmartPagination(page, size, sortBy, sortDir, search);
    }
}
