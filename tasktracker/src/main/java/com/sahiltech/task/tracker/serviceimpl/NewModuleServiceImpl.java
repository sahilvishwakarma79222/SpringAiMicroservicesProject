package com.sahiltech.task.tracker.serviceimpl;

import com.sahiltech.task.tracker.model.NewModule;
import com.sahiltech.task.tracker.repository.NewModuleRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class NewModuleServiceImpl {
    private final NewModuleRepo moduleRepo;

    public NewModuleServiceImpl(NewModuleRepo moduleRepo) {
        this.moduleRepo = moduleRepo;
    }

    public int countModules() {
        return moduleRepo.countAllModules();
    }

    public NewModule saveModule(NewModule module) {
        return moduleRepo.saveModule(module);
    }

    public NewModule getModuleById(Long id) {
        return moduleRepo.getById(id);
    }

    public List<NewModule> getAllModules() {
        return moduleRepo.getAllModules();
    }

    public List<NewModule> getAllModulesByProjectId(Long projectid) {
        return moduleRepo.getModuleByProjectId(projectid);
    }

    public String updateModule(Long id, NewModule module) {
        return moduleRepo.updateModule(id, module);
    }

    public String deleteModule(long id) {
        return moduleRepo.deleteModule(id);
    }

    public Map<String, Object> getSmartPaginatedModules(
            int page,
            int size,
            String sortBy,
            String sortDir,
            String search
    ) {
        return moduleRepo.getModulesSmartPagination(page, size, sortBy, sortDir, search);
    }

}
