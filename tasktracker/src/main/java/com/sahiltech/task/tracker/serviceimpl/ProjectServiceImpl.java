package com.sahiltech.task.tracker.serviceimpl;

import com.sahiltech.task.tracker.model.Project;
import com.sahiltech.task.tracker.repository.ProjectRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class ProjectServiceImpl {

    private final ProjectRepo projectRepo;

    public ProjectServiceImpl(ProjectRepo projectRepo){
        this.projectRepo=projectRepo;
    }

    public int countProject(){
        int projectCount = projectRepo.countAllProjects();
        return projectCount;
    }
    public Project saveProject(Project project){
        return projectRepo.saveProject(project);
    }

    public Project getProjectById(Long id){
        return projectRepo.getById(id);
    }

    public List<Project> getAllProjects(){
        List<Project> projects = projectRepo.getAllProjects();
        return projects;
    }

    public String updateProject(Long id,Project project){
        String msg = projectRepo.updateProject(id, project);
        return msg;
    }
    public String deleteProject(long id){
        return projectRepo.deleteProject(id);
    }
    public Map<String, Object> getProjectsPage(int pageNumber, int pageSize){
        Map<String, Object> pagination = projectRepo.getProjectsPage(pageNumber, pageSize);
        return pagination;
    }

    public Map<String, Object> getSmartPaginatedProjects(
            int page,
            int size,
            String sortBy,
            String sortDir,
            String search
    ) {
        return projectRepo.getProjectsSmartPagination(page, size, sortBy, sortDir, search);
    }
}
