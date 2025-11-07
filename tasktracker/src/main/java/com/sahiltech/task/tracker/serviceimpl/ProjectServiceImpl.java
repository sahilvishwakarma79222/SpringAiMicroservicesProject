package com.sahiltech.task.tracker.serviceimpl;

import com.sahiltech.task.tracker.model.Project;
import com.sahiltech.task.tracker.repository.ProjectRepo;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjectServiceImpl {

    private final ProjectRepo projectRepo;

    public ProjectServiceImpl(ProjectRepo projectRepo){
        this.projectRepo=projectRepo;
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



}
