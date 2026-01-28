"use client";
import React, { useEffect, useState } from "react";
import API from "@/services/api";
import {
  Card,
  Table,
  Button,
  Form,
  InputGroup,
  Spinner,
  Dropdown,
  Badge,
  Row,
  Col
} from "react-bootstrap";
import {
  FaEdit,
  FaEye,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaSearch,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
  FaEllipsisH,
  FaTasks,
  FaUser,
  FaCalendarAlt,
  FaClock,
  FaProjectDiagram,
  FaUsers
} from "react-icons/fa";

export default function ProjectTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]); // All projects for dropdown
  const [selectedProject, setSelectedProject] = useState(null); // Selected project from dropdown
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [projectsLoading, setProjectsLoading] = useState(false);
  // Sorting State
  const [sortBy, setSortBy] = useState("id");
  const [sortDir, setSortDir] = useState("asc");

  // Page size options
  const pageSizeOptions = [5, 10, 20, 50];

  // Status color mapping
  const getStatusBadge = (status) => {
    const normalizedStatus = status?.toUpperCase();
    switch (normalizedStatus) {
      case 'COMPLETED':
      case 'DONE':
        return 'success';
      case 'IN_PROGRESS':
      case 'IN PROGRESS':
      case 'ONGOING':
        return 'warning';
      case 'PENDING':
        return 'secondary';
      case 'CANCELLED':
        return 'danger';
      default:
        return 'primary';
    }
  };

  // 🔍 Fetch All Projects for Dropdown
  const fetchProjects = async () => {
    setProjectsLoading(true);
    try {
      const res = await API.get("/project/smart?page=1&size=100");
      setProjects(res.data.results || res.data || []);
      
      // Auto-select first project by default
      if (res.data.results && res.data.results.length > 0 && !selectedProject) {
        setSelectedProject(res.data.results[0]);
      } else if (res.data && res.data.length > 0 && !selectedProject) {
        setSelectedProject(res.data[0]);
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
    } finally {
      setProjectsLoading(false);
    }
  };

  // 🔍 Fetch Project's Tasks based on selected project
  const fetchProjectTasks = async () => {
    if (!selectedProject) return;
    
    setLoading(true);
    try {
      const res = await API.get(
        `/task/project/${selectedProject.id}/smart?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}&search=${search}`
      );
      
      // Handle different response structures
      const tasksData = res.data?.results || res.data || [];
      setTasks(tasksData);
      setTotalPages(res.data?.totalPages || 1);
      setTotalRecords(res.data?.totalRecords || tasksData.length);
      
    } catch (error) {
      console.error("Error fetching project tasks:", error);
      // Fallback to all tasks with client-side filtering
      try {
        const allTasksRes = await API.get("/task/all");
        const allTasks = allTasksRes.data?.results || allTasksRes.data || [];
        const projectTasks = allTasks.filter(task => 
          task.projectId === selectedProject.id || 
          task.projectName === selectedProject.name ||
          task.projectname === selectedProject.name
        );
        setTasks(projectTasks);
        setTotalPages(1);
        setTotalRecords(projectTasks.length);
      } catch (fallbackError) {
        console.error("Fallback also failed:", fallbackError);
        setTasks([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetchProjectTasks();
    }
  }, [selectedProject, page, size, search, sortBy, sortDir]);

  // Handle project selection from dropdown
  const handleProjectChange = (project) => {
    setSelectedProject(project);
    setPage(1); // Reset to first page when project changes
  };

  // 🔄 Sort Handling
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDir("asc");
    }
    setPage(1);
  };

  // Get Sort Icon
  const getSortIcon = (column) => {
    if (sortBy !== column) return <FaSort className="ms-1 opacity-50" size={12} />;
    return sortDir === "asc" ? <FaSortUp className="ms-1" size={12} /> : <FaSortDown className="ms-1" size={12} />;
  };

  // Format Date
  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString();
  };

  // Quick Status Update
  const handleQuickStatusUpdate = async (taskId, newStatus) => {
    try {
      await API.patch(`/task/updateStatus/${taskId}`, { status: newStatus });
      fetchProjectTasks(); // Refresh the list
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  // Pagination Functions
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handlePrevious = () => {
    setPage(prev => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setPage(prev => Math.min(totalPages, prev + 1));
  };

  const handleSizeChange = (e) => {
    setSize(parseInt(e.target.value));
    setPage(1);
  };

  // Render Pagination Numbers
  const renderPaginationNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (startPage > 1) {
      pages.push(
        <button key={1} className="btn btn-outline-secondary btn-sm mx-1" onClick={() => handlePageChange(1)} style={{ fontSize: '0.8rem' }}>
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(<span key="dots1" className="mx-1 text-muted" style={{ fontSize: '0.8rem' }}>•••</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button key={i} className={`btn btn-sm mx-1 ${page === i ? 'btn-primary' : 'btn-outline-secondary'}`}
          onClick={() => handlePageChange(i)} style={{ fontSize: '0.8rem' }}>
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="dots2" className="mx-1 text-muted" style={{ fontSize: '0.8rem' }}>•••</span>);
      }
      pages.push(
        <button key={totalPages} className="btn btn-outline-secondary btn-sm mx-1" 
          onClick={() => handlePageChange(totalPages)} style={{ fontSize: '0.8rem' }}>
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  // Stats Calculation
  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => {
      const status = t.status?.toUpperCase();
      return status === 'PENDING';
    }).length,
    inProgress: tasks.filter(t => {
      const status = t.status?.toUpperCase();
      return status === 'IN_PROGRESS' || status === 'ONGOING' || status === 'IN PROGRESS';
    }).length,
    completed: tasks.filter(t => {
      const status = t.status?.toUpperCase();
      return status === 'COMPLETED' || status === 'DONE';
    }).length,
    overdue: tasks.filter(t => {
      if (!t.dueDate && !t.assignedDate) return false;
      const dueDate = t.dueDate || t.assignedDate;
      return new Date(dueDate) < new Date() && 
             !(t.status?.toUpperCase() === 'COMPLETED' || t.status?.toUpperCase() === 'DONE');
    }).length
  };

  return (
    <div className="container-fluid py-3" style={{ minHeight: 'calc(100vh - 56px)' }}>
      {/* Header Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h3 className="text-dark fw-bold mb-1" style={{ fontSize: '1.4rem' }}>
                <FaProjectDiagram className="text-primary me-2" />
                Project Tasks
              </h3>
              <p className="text-muted mb-0" style={{ fontSize: '0.875rem' }}>
                View tasks assigned to different projects
              </p>
            </div>
            
            {/* Project Selection Dropdown */}
            <div className="d-flex align-items-center gap-3">
              <div className="d-flex align-items-center gap-2">
                <FaProjectDiagram className="text-muted" />
                <span className="text-muted" style={{ fontSize: '0.875rem' }}>Select Project:</span>
              </div>
              <Dropdown>
                <Dropdown.Toggle 
                  variant="outline-primary" 
                  className="d-flex align-items-center gap-2"
                  disabled={projectsLoading}
                  style={{ fontSize: '0.8rem' }}
                >
                  {projectsLoading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      Loading...
                    </>
                  ) : selectedProject ? (
                    <>
                      <FaProjectDiagram className="me-1" />
                      {selectedProject.name} 
                      {selectedProject.client && ` - ${selectedProject.client}`}
                    </>
                  ) : (
                    "Select Project"
                  )}
                </Dropdown.Toggle>
                <Dropdown.Menu style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {projects.map((project) => (
                    <Dropdown.Item 
                      key={project.id}
                      onClick={() => handleProjectChange(project)}
                      className={selectedProject?.id === project.id ? 'bg-light' : ''}
                    >
                      <div className="d-flex align-items-center">
                        <div className="bg-info rounded-circle d-flex align-items-center justify-content-center text-white me-2"
                             style={{ width: '24px', height: '24px', fontSize: '0.7rem' }}>
                          {project.name ? project.name.charAt(0).toUpperCase() : 'P'}
                        </div>
                        <div>
                          <div className="fw-medium" style={{ fontSize: '0.85rem' }}>{project.name}</div>
                          <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                            {project.client || 'No Client'} • ID: {project.id}
                          </small>
                        </div>
                      </div>
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>

      {/* Selected Project Info */}
      {selectedProject && (
        <Row className="g-3 mb-4">
          <Col xl={3} lg={3} md={6}>
            <Card className="shadow-sm border-0 h-100">
              <Card.Body className="p-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-2" style={{ fontSize: '0.8rem' }}>Selected Project</h6>
                    <h5 className="fw-bold text-primary mb-0" style={{ fontSize: '1.2rem' }}>{selectedProject.name}</h5>
                    <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                      {selectedProject.client || 'No Client'}
                    </small>
                  </div>
                  <div className="bg-primary bg-opacity-10 rounded p-2">
                    <FaProjectDiagram className="text-primary" size={20} />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col xl={3} lg={3} md={6}>
            <Card className="shadow-sm border-0 h-100">
              <Card.Body className="p-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-2" style={{ fontSize: '0.8rem' }}>Total Tasks</h6>
                    <h3 className="fw-bold text-primary mb-0" style={{ fontSize: '1.8rem' }}>{stats.total}</h3>
                  </div>
                  <div className="bg-primary bg-opacity-10 rounded p-2">
                    <FaTasks className="text-primary" size={20} />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col xl={3} lg={3} md={6}>
            <Card className="shadow-sm border-0 h-100">
              <Card.Body className="p-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-2" style={{ fontSize: '0.8rem' }}>In Progress</h6>
                    <h3 className="fw-bold text-warning mb-0" style={{ fontSize: '1.8rem' }}>{stats.inProgress}</h3>
                  </div>
                  <div className="bg-warning bg-opacity-10 rounded p-2">
                    <FaClock className="text-warning" size={20} />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col xl={3} lg={3} md={6}>
            <Card className="shadow-sm border-0 h-100">
              <Card.Body className="p-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="text-muted mb-2" style={{ fontSize: '0.8rem' }}>Completed</h6>
                    <h3 className="fw-bold text-success mb-0" style={{ fontSize: '1.8rem' }}>{stats.completed}</h3>
                  </div>
                  <div className="bg-success bg-opacity-10 rounded p-2">
                    <FaCalendarAlt className="text-success" size={20} />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Main Tasks Table */}
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-white border-0 py-3">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-0 text-dark fw-bold" style={{ fontSize: '1rem' }}>
                {selectedProject ? `${selectedProject.name} - Project Tasks` : 'Select a Project'}
              </h5>
              <small className="text-muted" style={{ fontSize: '0.875rem' }}>
                {selectedProject ? `Managing tasks for ${selectedProject.name} project` : 'Please select a project to view its tasks'}
              </small>
            </div>
            {selectedProject && (
              <div className="d-flex align-items-center gap-2">
                <span className="text-muted" style={{ fontSize: '0.75rem' }}>Showing {tasks.length} tasks</span>
              </div>
            )}
          </div>
        </Card.Header>

        <Card.Body className="p-0">
          {selectedProject ? (
            <>
              {/* Controls Section */}
              <div className="p-3 border-bottom bg-light">
                <div className="row g-3 align-items-center">
                  <div className="col-md-6">
                    <InputGroup>
                      <Form.Control
                        placeholder="Search tasks by title, description, or status..."
                        value={search}
                        onChange={(e) => {
                          setSearch(e.target.value);
                          setPage(1);
                        }}
                        style={{ fontSize: '0.8rem' }}
                      />
                      <InputGroup.Text className="bg-white">
                        <FaSearch className="text-muted" />
                      </InputGroup.Text>
                    </InputGroup>
                  </div>
                  <div className="col-md-6 d-flex justify-content-end gap-3">
                    <div className="d-flex align-items-center gap-2">
                      <span className="text-muted" style={{ fontSize: '0.8rem' }}>Show:</span>
                      <Form.Select value={size} onChange={handleSizeChange} style={{ width: '70px', fontSize: '0.8rem' }}>
                        {pageSizeOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </Form.Select>
                    </div>
                    <Dropdown>
                      <Dropdown.Toggle variant="outline-secondary" size="sm" className="d-flex align-items-center gap-2" style={{ fontSize: '0.8rem' }}>
                        <FaFilter />
                        Filter
                      </Dropdown.Toggle>
                      <Dropdown.Menu style={{ fontSize: '0.8rem' }}>
                        <Dropdown.Item>Pending Only</Dropdown.Item>
                        <Dropdown.Item>In Progress</Dropdown.Item>
                        <Dropdown.Item>Completed</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item>Overdue Tasks</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>
              </div>

              {/* Table Section */}
              <div className="table-responsive" style={{ position: 'relative' }}>
                <Table hover className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th style={{ cursor: "pointer", width: "70px" }} onClick={() => handleSort("id")}>
                        <div className="d-flex align-items-center justify-content-between">
                          <span className="fw-semibold text-muted" style={{ fontSize: '0.8rem' }}>ID</span>
                          {getSortIcon("id")}
                        </div>
                      </th>
                      <th style={{ cursor: "pointer", minWidth: "200px" }} onClick={() => handleSort("title")}>
                        <div className="d-flex align-items-center justify-content-between">
                          <span className="fw-semibold text-muted" style={{ fontSize: '0.8rem' }}>Task Details</span>
                          {getSortIcon("title")}
                        </div>
                      </th>
                      <th style={{ cursor: "pointer", minWidth: "120px" }} onClick={() => handleSort("status")}>
                        <div className="d-flex align-items-center justify-content-between">
                          <span className="fw-semibold text-muted" style={{ fontSize: '0.8rem' }}>Status</span>
                          {getSortIcon("status")}
                        </div>
                      </th>
                      <th style={{ cursor: "pointer", minWidth: "150px" }} onClick={() => handleSort("employeeName")}>
                        <div className="d-flex align-items-center justify-content-between">
                          <span className="fw-semibold text-muted" style={{ fontSize: '0.8rem' }}>Assigned To</span>
                          {getSortIcon("employeeName")}
                        </div>
                      </th>
                      <th style={{ cursor: "pointer", minWidth: "120px" }} onClick={() => handleSort("assignedDate")}>
                        <div className="d-flex align-items-center justify-content-between">
                          <span className="fw-semibold text-muted" style={{ fontSize: '0.8rem' }}>Assigned Date</span>
                          {getSortIcon("assignedDate")}
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="5" className="text-center py-4">
                          <div className="d-flex justify-content-center align-items-center">
                            <Spinner animation="border" variant="primary" size="sm" className="me-2" />
                            <span className="text-muted" style={{ fontSize: '0.875rem' }}>Loading project tasks...</span>
                          </div>
                        </td>
                      </tr>
                    ) : tasks.length > 0 ? (
                      tasks.map((task) => (
                        <tr key={task.id} className="border-bottom">
                          <td>
                            <span className="text-muted fw-medium" style={{ fontSize: '0.8rem' }}>#{task.id}</span>
                          </td>
                          <td>
                            <div className="fw-semibold text-dark" style={{ fontSize: '0.85rem' }}>{task.title}</div>
                            {task.description && (
                              <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                                {task.description && task.description.length > 80 
                                  ? `${task.description.substring(0, 80)}...` 
                                  : task.description
                                }
                              </small>
                            )}
                          </td>
                          <td>
                            {/* Fixed Status Dropdown */}
                            <div className="position-relative">
                              <Dropdown>
                                <Dropdown.Toggle 
                                  variant="outline-secondary" 
                                  size="sm" 
                                  className={`border-0 bg-${getStatusBadge(task.status)} text-white d-flex align-items-center`}
                                  style={{ 
                                    fontSize: '0.75rem',
                                    minWidth: '120px',
                                    zIndex: 1
                                  }}
                                >
                                  {task.status}
                                </Dropdown.Toggle>
                                <Dropdown.Menu 
                                  style={{ 
                                    fontSize: '0.8rem',
                                    zIndex: 1060, // Higher z-index to ensure it appears above other elements
                                    position: 'absolute'
                                  }}
                                >
                                  <Dropdown.Item 
                                    eventKey="PENDING"
                                    onClick={() => handleQuickStatusUpdate(task.id, "PENDING")}
                                  >
                                    Pending
                                  </Dropdown.Item>
                                  <Dropdown.Item 
                                    eventKey="IN_PROGRESS"
                                    onClick={() => handleQuickStatusUpdate(task.id, "IN_PROGRESS")}
                                  >
                                    In Progress
                                  </Dropdown.Item>
                                  <Dropdown.Item 
                                    eventKey="COMPLETED"
                                    onClick={() => handleQuickStatusUpdate(task.id, "COMPLETED")}
                                  >
                                    Completed
                                  </Dropdown.Item>
                                  <Dropdown.Item 
                                    eventKey="ON_HOLD"
                                    onClick={() => handleQuickStatusUpdate(task.id, "ON_HOLD")}
                                  >
                                    On Hold
                                  </Dropdown.Item>
                                </Dropdown.Menu>
                              </Dropdown>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <FaUser className="text-info me-2" size={14} />
                              <span style={{ fontSize: '0.85rem' }}>{task.employeeName || 'Unassigned'}</span>
                            </div>
                          </td>
                          <td>
                            <div className={`fw-medium ${
                              new Date(task.assignedDate) < new Date() && 
                              !(task.status?.toUpperCase() === 'COMPLETED' || task.status?.toUpperCase() === 'DONE') 
                                ? 'text-danger' 
                                : 'text-dark'
                            }`} style={{ fontSize: '0.85rem' }}>
                              {formatDate(task.assignedDate)}
                            </div>
                            {new Date(task.assignedDate) < new Date() && 
                             !(task.status?.toUpperCase() === 'COMPLETED' || task.status?.toUpperCase() === 'DONE') && (
                              <small className="text-danger" style={{ fontSize: '0.75rem' }}>Overdue</small>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center py-4">
                          <div className="text-muted">
                            <FaTasks size={32} className="mb-2 opacity-25" />
                            <h6 className="mb-2" style={{ fontSize: '1rem' }}>No tasks found</h6>
                            <p className="mb-0" style={{ fontSize: '0.875rem' }}>
                              {search ? 'No tasks match your search criteria' : `No tasks assigned to ${selectedProject.name} project yet`}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>

              {/* Pagination Section */}
              {tasks.length > 0 && (
                <div className="p-3 border-top bg-light">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                        Showing <strong>{((page - 1) * size) + 1}-{Math.min(page * size, totalRecords)}</strong> of <strong>{totalRecords}</strong> tasks
                      </span>
                    </div>
                    
                    <div className="d-flex align-items-center gap-1">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={handlePrevious}
                        disabled={page <= 1}
                        className="d-flex align-items-center"
                        style={{ fontSize: '0.8rem' }}
                      >
                        <FaChevronLeft className="me-1" />
                        Prev
                      </Button>

                      <div className="d-flex gap-1 mx-1">
                        {renderPaginationNumbers()}
                      </div>

                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={handleNext}
                        disabled={page >= totalPages}
                        className="d-flex align-items-center"
                        style={{ fontSize: '0.8rem' }}
                      >
                        Next
                        <FaChevronRight className="ms-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* No Project Selected State */
            <div className="text-center py-5">
              <FaProjectDiagram size={48} className="text-muted mb-3 opacity-25" />
              <h5 className="text-muted" style={{ fontSize: '1rem' }}>No Project Selected</h5>
              <p className="text-muted mb-0" style={{ fontSize: '0.875rem' }}>Please select a project from the dropdown to view its tasks</p>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}