"use client";
import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  InputGroup,
  Spinner,
  Dropdown,
  Badge,
  Toast,
  ToastContainer
} from "react-bootstrap";
import {
  FaEdit,
  FaEye,
  FaTrash,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaPlus,
  FaSearch,
  FaChevronLeft,
  FaChevronRight,
  FaCheckCircle,
  FaTimesCircle,
  FaProjectDiagram,
  FaUserAlt,
  FaCalendarAlt,
  FaFlag,
  FaClipboardList,
  FaUserCheck,
  FaHourglassHalf,
  FaClock  
} from "react-icons/fa";
import API from "@/services/api";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [allModules, setAllModules] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [modulesLoading, setModulesLoading] = useState(false);

  // Sorting State
  const [sortBy, setSortBy] = useState("id");
  const [sortDir, setSortDir] = useState("asc");

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Assigned",
    priority: "Medium",
    projectId: "",
    moduleId: "",
    employeeId: "",
    assignedDate: "",
    completedDate: ""
  });
  const [editId, setEditId] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // Toast States
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success"
  });

  // Status Options
  const statusOptions = ["Assigned", "In Progress", "Completed", "Pending", "Cancelled"];

  // Priority Options
  const priorityOptions = ["High", "Medium", "Low"];

  // Page size options
  const pageSizeOptions = [5, 10, 20, 50];

  // Status colors
  const statusColors = {
    "Completed": "success",
    "In Progress": "warning",
    "Assigned": "primary",
    "Pending": "secondary",
    "Cancelled": "danger"
  };

  // Priority colors
  const priorityColors = {
    "High": "danger",
    "Medium": "warning",
    "Low": "info"
  };

  const statusIcons = {
    "Completed": <FaCheckCircle className="me-1" size={10} />,
    "In Progress": <FaHourglassHalf className="me-1" size={10} />,
    "Assigned": <FaUserCheck className="me-1" size={10} />,
    "Pending": <FaClock className="me-1" size={10} />,
    "Cancelled": <FaTimesCircle className="me-1" size={10} />
  };

  // Professional Avatar Colors (Gradient)
  const avatarColors = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
  ];

  const getAvatarColor = (index) => {
    return avatarColors[index % avatarColors.length];
  };

  const getInitials = (title) => {
    if (!title) return 'T';
    return title.charAt(0).toUpperCase();
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = "Task title is required";
    if (!formData.projectId) errors.projectId = "Project is required";
    if (!formData.employeeId) errors.employeeId = "Employee is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Fetch all modules for module name lookup
  const fetchAllModules = async () => {
    try {
      const res = await API.get("/modules/smart?page=1&size=1000");
      setAllModules(res.data.results || res.data || []);
    } catch (err) {
      console.error("Error fetching all modules:", err);
    }
  };

  // Get module name by ID from allModules
  const getModuleName = (moduleId) => {
    if (!moduleId) return 'N/A';
    const module = allModules.find(m => m.id === moduleId);
    return module ? module.name : `Module #${moduleId}`;
  };

  // 🔍 Fetch Tasks
  const fetchTasks = async () => {
    setLoading(true);
    try {
      let url = `/task/smart?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`;
      if (search) url += `&search=${search}`;
      
      const res = await API.get(url);
      let allTasks = res.data.results || [];
      
      // Apply project filter by NAME
      if (selectedProject) {
        allTasks = allTasks.filter(task => task.projectName === selectedProject);
      }
      
      setTasks(allTasks);
      setTotalRecords(allTasks.length);
      setTotalPages(Math.ceil(allTasks.length / size));
    } catch (err) {
      console.error("Error fetching tasks:", err);
      showToast("Failed to fetch tasks", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const res = await API.get("/project/smart?page=1&size=100");
      setProjects(res.data.results || res.data || []);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await API.get("/employee/smart?page=1&size=100");
      setEmployees(res.data.results || res.data || []);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchProjects();
    fetchEmployees();
    fetchAllModules();
  }, [page, size, search, sortBy, sortDir, selectedProject]);

  const handleClose = () => {
    setShowModal(false);
    setFormData({
      title: "",
      description: "",
      status: "Assigned",
      priority: "Medium",
      projectId: "",
      moduleId: "",
      employeeId: "",
      assignedDate: "",
      completedDate: ""
    });
    setFormErrors({});
    setEditId(null);
    setSelectedTask(null);
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        projectId: parseInt(formData.projectId),
        moduleId: formData.moduleId ? parseInt(formData.moduleId) : null,
        employeeId: parseInt(formData.employeeId),
        assignedDate: formData.assignedDate,
        completedDate: formData.completedDate || null
      };

      if (editId) {
        await API.put(`/task/update/${editId}`, payload);
        showToast("Task updated successfully!", "success");
      } else {
        await API.post("/task/save", payload);
        showToast("Task added successfully!", "success");
      }
      fetchTasks();
      handleClose();
    } catch (err) {
      console.error("Error saving task:", err);
      showToast("Failed to save task", "error");
    }
  };

  const handleEdit = async (task) => {
    try {
      // Fetch complete task data by ID to get all fields
      const res = await API.get(`/task/getById/${task.id}`);
      const fullTask = res.data;
      
      // Fetch modules for the project if projectId exists
      if (fullTask.projectId) {
        const modulesRes = await API.get(`/modules/getByProjectId/${fullTask.projectId}`);
        const projectModules = modulesRes.data.results || modulesRes.data || [];
        setAllModules(prev => [...prev, ...projectModules]);
      }
      
      setFormData({
        title: fullTask.title || "",
        description: fullTask.description || "",
        status: fullTask.status || "Assigned",
        priority: fullTask.priority || "Medium",
        projectId: fullTask.projectId || "",
        moduleId: fullTask.moduleId || "",
        employeeId: fullTask.employeeId || "",
        assignedDate: fullTask.assignedDate ? fullTask.assignedDate.split('T')[0] : "",
        completedDate: fullTask.completedDate ? fullTask.completedDate.split('T')[0] : ""
      });
      
      setEditId(task.id);
      setSelectedTask(task);
      setShowModal(true);
    } catch (err) {
      console.error("Error preparing edit form:", err);
      // Fallback: use task data directly
      setFormData({
        title: task.title || "",
        description: task.description || "",
        status: task.status || "Assigned",
        priority: task.priority || "Medium",
        projectId: task.projectId || "",
        moduleId: task.moduleId || "",
        employeeId: task.employeeId || "",
        assignedDate: task.assignedDate ? task.assignedDate.split('T')[0] : "",
        completedDate: task.completedDate ? task.completedDate.split('T')[0] : ""
      });
      setEditId(task.id);
      setSelectedTask(task);
      setShowModal(true);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/task/delete/${id}`);
      fetchTasks();
      setShowDeleteModal(false);
      setSelectedTask(null);
      showToast("Task deleted successfully!", "success");
    } catch (err) {
      console.error("Error deleting task:", err);
      showToast("Failed to delete task", "error");
    }
  };

  const handleView = async (task) => {
    try {
      const res = await API.get(`/task/getById/${task.id}`);
      setSelectedTask(res.data);
      setShowViewModal(true);
    } catch (err) {
      console.error("Error fetching task details:", err);
      setSelectedTask(task);
      setShowViewModal(true);
    }
  };

  const handleConfirmDelete = (task) => {
    setSelectedTask(task);
    setShowDeleteModal(true);
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDir("asc");
    }
    setPage(1);
  };

  const getSortIcon = (column) => {
    if (sortBy !== column) return <FaSort className="ms-1 opacity-50" size={11} />;
    return sortDir === "asc" ? <FaSortUp className="ms-1" size={11} /> : <FaSortDown className="ms-1" size={11} />;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getProjectName = (projectId) => {
    if (!projectId) return 'N/A';
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : `Project #${projectId}`;
  };

  const getEmployeeName = (employeeId) => {
    if (!employeeId) return 'N/A';
    const employee = employees.find(e => e.id === employeeId);
    return employee ? employee.name : `Employee #${employeeId}`;
  };

  const clearProjectFilter = () => {
    setSelectedProject("");
    setPage(1);
  };

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

  const renderPaginationNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    const startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          className="btn btn-outline-secondary btn-sm mx-1"
          onClick={() => handlePageChange(1)}
          style={{ fontSize: '0.75rem', minWidth: '35px', borderRadius: '6px' }}
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(<span key="dots1" className="mx-1 text-muted">•••</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`btn btn-sm mx-1 ${page === i ? 'btn-primary' : 'btn-outline-secondary'}`}
          onClick={() => handlePageChange(i)}
          style={{ fontSize: '0.75rem', minWidth: '35px', borderRadius: '6px' }}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="dots2" className="mx-1 text-muted">•••</span>);
      }
      pages.push(
        <button
          key={totalPages}
          className="btn btn-outline-secondary btn-sm mx-1"
          onClick={() => handlePageChange(totalPages)}
          style={{ fontSize: '0.75rem', minWidth: '35px', borderRadius: '6px' }}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="container-fluid py-3 px-3" style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      
      {/* Toast Container */}
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
        <Toast 
          show={toast.show} 
          onClose={() => setToast({ ...toast, show: false })}
          delay={3000}
          autohide
          className="shadow-sm border-0"
        >
          <Toast.Header className={`${toast.type === 'success' ? 'bg-success' : 'bg-danger'} text-white border-0`}>
            {toast.type === 'success' ? <FaCheckCircle className="me-2" /> : <FaTimesCircle className="me-2" />}
            <strong className="me-auto">{toast.type === 'success' ? 'Success!' : 'Error!'}</strong>
            <small>just now</small>
          </Toast.Header>
          <Toast.Body className="py-2">{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>

      {/* Page Header */}
      <div className="mb-3">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <h5 className="mb-0 fw-bold text-dark" style={{ fontSize: '1.1rem' }}>
              <FaClipboardList className="me-2 text-primary" size={18} />
              Tasks Management
            </h5>
            <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>Manage and track all your tasks</p>
          </div>
          <Button 
            variant="primary" 
            className="d-flex align-items-center gap-2 px-3 py-1"
            onClick={() => setShowModal(true)}
            style={{ fontSize: '0.8rem' }}
          >
            <FaPlus size={12} />
            Add Task
          </Button>
        </div>
      </div>

      {/* Main Card */}
      <Card className="shadow-sm border-0" style={{ borderRadius: '10px' }}>
        
        {/* Search Section */}
        <Card.Body className="p-2 border-bottom bg-white">
          <div className="row g-2 align-items-center">
            <div className="col-md-5">
              <InputGroup size="sm" style={{ borderRadius: '6px' }}>
                <Form.Control
                  placeholder="Search tasks by title, employee, project..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  style={{ fontSize: '0.75rem' }}
                />
                <InputGroup.Text className="bg-white" style={{ fontSize: '0.75rem' }}>
                  <FaSearch className="text-muted" size={12} />
                </InputGroup.Text>
              </InputGroup>
            </div>
            <div className="col-md-4">
              <Dropdown>
                <Dropdown.Toggle 
                  variant="outline-secondary" 
                  size="sm"
                  className="d-flex align-items-center justify-content-between w-100"
                  style={{ fontSize: '0.75rem' }}
                >
                  <span className="d-flex align-items-center gap-2">
                    <FaProjectDiagram size={12} />
                    {selectedProject || 'All Projects'}
                  </span>
                </Dropdown.Toggle>
                <Dropdown.Menu style={{ fontSize: '0.75rem', width: '100%', maxHeight: '300px', overflowY: 'auto' }}>
                  <Dropdown.Item onClick={() => { setSelectedProject(""); setPage(1); }}>
                    <FaProjectDiagram className="me-2" size={12} />
                    All Projects
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  {projects.map((project) => (
                    <Dropdown.Item 
                      key={project.id} 
                      onClick={() => {
                        setSelectedProject(project.name);
                        setPage(1);
                      }}
                      active={selectedProject === project.name}
                    >
                      {project.name}
                    </Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="col-md-3 d-flex justify-content-end gap-2">
              <div className="d-flex align-items-center gap-1">
                <span className="text-muted" style={{ fontSize: '0.7rem' }}>Show:</span>
                <Form.Select 
                  value={size} 
                  onChange={handleSizeChange}
                  size="sm"
                  style={{ width: '65px', fontSize: '0.7rem' }}
                >
                  {pageSizeOptions.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </Form.Select>
              </div>
              {selectedProject && (
                <Button 
                  variant="link" 
                  size="sm" 
                  className="text-danger p-0"
                  onClick={clearProjectFilter}
                  style={{ fontSize: '0.7rem', textDecoration: 'none' }}
                >
                  Clear
                </Button>
              )}
            </div>
          </div>
        </Card.Body>

        {/* Table Section */}
        <div className="table-responsive">
          <Table hover className="mb-0" size="sm">
            <thead className="table-light">
              <tr>
                <th 
                  style={{ cursor: "pointer", width: "70px", fontSize: '0.75rem' }} 
                  onClick={() => handleSort("id")}
                  className="py-2"
                >
                  <div className="d-flex align-items-center gap-1">
                    <span className="fw-semibold text-muted">ID</span>
                    {getSortIcon("id")}
                  </div>
                </th>
                <th 
                  style={{ cursor: "pointer", minWidth: "220px", fontSize: '0.75rem' }} 
                  onClick={() => handleSort("title")}
                  className="py-2"
                >
                  <div className="d-flex align-items-center gap-1">
                    <span className="fw-semibold text-muted">Task Details</span>
                    {getSortIcon("title")}
                  </div>
                </th>
                <th 
                  style={{ cursor: "pointer", minWidth: "100px", fontSize: '0.75rem' }} 
                  onClick={() => handleSort("priority")}
                  className="py-2"
                >
                  <div className="d-flex align-items-center gap-1">
                    <span className="fw-semibold text-muted">Priority</span>
                    {getSortIcon("priority")}
                  </div>
                </th>
                <th 
                  style={{ cursor: "pointer", minWidth: "120px", fontSize: '0.75rem' }} 
                  onClick={() => handleSort("status")}
                  className="py-2"
                >
                  <div className="d-flex align-items-center gap-1">
                    <span className="fw-semibold text-muted">Status</span>
                    {getSortIcon("status")}
                  </div>
                </th>
                <th 
                  style={{ cursor: "pointer", minWidth: "130px", fontSize: '0.75rem' }} 
                  onClick={() => handleSort("employeeName")}
                  className="py-2"
                >
                  <div className="d-flex align-items-center gap-1">
                    <span className="fw-semibold text-muted">Assigned To</span>
                    {getSortIcon("employeeName")}
                  </div>
                </th>
                <th 
                  style={{ cursor: "pointer", minWidth: "130px", fontSize: '0.75rem' }} 
                  onClick={() => handleSort("projectName")}
                  className="py-2"
                >
                  <div className="d-flex align-items-center gap-1">
                    <span className="fw-semibold text-muted">Project</span>
                    {getSortIcon("projectName")}
                  </div>
                </th>
                <th 
                  style={{ cursor: "pointer", minWidth: "100px", fontSize: '0.75rem' }} 
                  onClick={() => handleSort("assignedDate")}
                  className="py-2"
                >
                  <div className="d-flex align-items-center gap-1">
                    <span className="fw-semibold text-muted">Due Date</span>
                    {getSortIcon("assignedDate")}
                  </div>
                </th>
                <th style={{ width: "180px", fontSize: '0.75rem' }} className="text-center py-2">
                  <span className="fw-semibold text-muted">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-4">
                    <Spinner animation="border" variant="primary" size="sm" className="me-2" />
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>Loading tasks...</span>
                  </td>
                </tr>
              ) : tasks.length > 0 ? (
                tasks.map((task, index) => (
                  <tr key={task.id}>
                    <td className="py-2" style={{ fontSize: '0.75rem' }}>
                      <span className="text-muted">#{task.id}</span>
                    </td>
                    <td className="py-2">
                      <div className="d-flex align-items-start gap-2">
                        <div className="rounded-circle d-flex align-items-center justify-content-center text-white shadow-sm flex-shrink-0"
                             style={{ 
                               width: '36px', 
                               height: '36px', 
                               background: getAvatarColor(index),
                               fontSize: '0.8rem', 
                               fontWeight: '600',
                               boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                             }}>
                          <FaClipboardList size={16} />
                        </div>
                        <div>
                          <div className="fw-semibold" style={{ fontSize: '0.85rem' }}>{task.title}</div>
                          <small className="text-muted" style={{ fontSize: '0.65rem' }}>
                            {task.description && task.description.length > 50 
                              ? `${task.description.substring(0, 50)}...` 
                              : task.description || 'No description'}
                          </small>
                        </div>
                      </div>
                    </td>
                    <td className="py-2 align-middle">
                      <Badge 
                        bg={priorityColors[task.priority] || "secondary"}
                        className="px-2 py-1"
                        style={{ fontWeight: '500', fontSize: '0.7rem', borderRadius: '6px' }}
                      >
                        <FaFlag size={10} className="me-1" />
                        {task.priority || 'Medium'}
                      </Badge>
                    </td>
                    <td className="py-2 align-middle">
                      <Badge 
                        bg={statusColors[task.status] || "secondary"}
                        className="d-inline-flex align-items-center px-2 py-1"
                        style={{ fontWeight: '500', fontSize: '0.7rem', borderRadius: '6px' }}
                      >
                        {statusIcons[task.status]}
                        {task.status || 'Assigned'}
                      </Badge>
                    </td>
                    <td className="py-2 align-middle">
                      <div className="d-flex align-items-center gap-2">
                        <FaUserAlt size={12} className="text-muted" />
                        <span style={{ fontSize: '0.8rem' }}>{task.employeeName || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="py-2 align-middle">
                      <div className="d-flex align-items-center gap-2">
                        <FaProjectDiagram size={12} className="text-muted" />
                        <span style={{ fontSize: '0.8rem' }}>{task.projectName || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="py-2 align-middle">
                      <div className="d-flex align-items-center gap-2">
                        <FaCalendarAlt size={12} className="text-muted" />
                        <span style={{ fontSize: '0.8rem' }}>{formatDate(task.assignedDate)}</span>
                      </div>
                    </td>
                    <td className="py-2 align-middle">
                      <div className="d-flex justify-content-center gap-2">
                        <Button
                          variant="outline-info"
                          size="sm"
                          className="d-flex align-items-center gap-1 px-2 py-1"
                          onClick={() => handleView(task)}
                          title="View Details"
                          style={{ fontSize: '0.7rem', borderRadius: '6px' }}
                        >
                          <FaEye size={11} />
                          <span>View</span>
                        </Button>
                        <Button
                          variant="outline-warning"
                          size="sm"
                          className="d-flex align-items-center gap-1 px-2 py-1"
                          onClick={() => handleEdit(task)}
                          title="Edit Task"
                          style={{ fontSize: '0.7rem', borderRadius: '6px' }}
                        >
                          <FaEdit size={11} />
                          <span>Edit</span>
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="d-flex align-items-center gap-1 px-2 py-1"
                          onClick={() => handleConfirmDelete(task)}
                          title="Delete Task"
                          style={{ fontSize: '0.7rem', borderRadius: '6px' }}
                        >
                          <FaTrash size={11} />
                          <span>Delete</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-4">
                    <div className="text-muted">
                      <FaClipboardList size={40} className="mb-2 opacity-25" />
                      <p className="mb-0" style={{ fontSize: '0.75rem' }}>No tasks found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        {/* Pagination Section */}
        {tasks.length > 0 && (
          <div className="p-2 border-top bg-light">
            <div className="d-flex justify-content-between align-items-center">
              <span className="text-muted" style={{ fontSize: '0.65rem' }}>
                Showing {((page - 1) * size) + 1} to {Math.min(page * size, totalRecords)} of {totalRecords}
              </span>
              
              <div className="d-flex align-items-center gap-1">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={handlePrevious}
                  disabled={page <= 1}
                  className="px-2"
                  style={{ fontSize: '0.65rem' }}
                >
                  <FaChevronLeft size={8} className="me-1" />
                  Prev
                </Button>

                <div className="d-flex gap-1">
                  {renderPaginationNumbers()}
                </div>

                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={handleNext}
                  disabled={page >= totalPages}
                  className="px-2"
                  style={{ fontSize: '0.65rem' }}
                >
                  Next
                  <FaChevronRight size={8} className="ms-1" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Add/Edit Task Modal */}
      <Modal show={showModal} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton className="border-0 pb-0 pt-3 px-4">
          <div className="d-flex align-items-center gap-2">
            <div className="rounded-circle p-2" style={{ background: editId ? '#ffc10720' : '#0d6efd20' }}>
              {editId ? <FaEdit size={20} className="text-warning" /> : <FaPlus size={20} className="text-primary" />}
            </div>
            <Modal.Title className="fw-semibold" style={{ fontSize: '1.1rem' }}>
              {editId ? "Edit Task" : "Add New Task"}
            </Modal.Title>
          </div>
        </Modal.Header>
        
        <Modal.Body className="px-4 py-3">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-semibold text-secondary mb-1">Task Title <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter task title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                style={{ fontSize: '0.85rem', borderRadius: '8px' }}
                isInvalid={!!formErrors.title}
              />
              <Form.Control.Feedback type="invalid" style={{ fontSize: '0.75rem' }}>
                {formErrors.title}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-semibold text-secondary mb-1">Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter task description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                style={{ fontSize: '0.85rem', borderRadius: '8px' }}
              />
            </Form.Group>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold text-secondary mb-1">Status</Form.Label>
                  <Form.Select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    style={{ fontSize: '0.85rem', borderRadius: '8px' }}
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold text-secondary mb-1">Priority</Form.Label>
                  <Form.Select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    style={{ fontSize: '0.85rem', borderRadius: '8px' }}
                  >
                    {priorityOptions.map(priority => (
                      <option key={priority} value={priority}>{priority}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold text-secondary mb-1">Project <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    value={formData.projectId}
                    onChange={(e) => setFormData({ ...formData, projectId: e.target.value, moduleId: "" })}
                    style={{ fontSize: '0.85rem', borderRadius: '8px' }}
                    isInvalid={!!formErrors.projectId}
                  >
                    <option value="">Select Project</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid" style={{ fontSize: '0.75rem' }}>
                    {formErrors.projectId}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold text-secondary mb-1">Module</Form.Label>
                  <Form.Select
                    value={formData.moduleId}
                    onChange={(e) => setFormData({ ...formData, moduleId: e.target.value })}
                    style={{ fontSize: '0.85rem', borderRadius: '8px' }}
                  >
                    <option value="">Select Module (Optional)</option>
                    {allModules.filter(m => m.projectId === parseInt(formData.projectId)).map(module => (
                      <option key={module.id} value={module.id}>
                        {module.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold text-secondary mb-1">Assign To <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    value={formData.employeeId}
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    style={{ fontSize: '0.85rem', borderRadius: '8px' }}
                    isInvalid={!!formErrors.employeeId}
                  >
                    <option value="">Select Employee</option>
                    {employees.map(employee => (
                      <option key={employee.id} value={employee.id}>
                        {employee.name}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid" style={{ fontSize: '0.75rem' }}>
                    {formErrors.employeeId}
                  </Form.Control.Feedback>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold text-secondary mb-1">Due Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.assignedDate}
                    onChange={(e) => setFormData({ ...formData, assignedDate: e.target.value })}
                    style={{ fontSize: '0.85rem', borderRadius: '8px' }}
                  />
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-2">
              <Form.Label className="small fw-semibold text-secondary mb-1">Completed Date</Form.Label>
              <Form.Control
                type="date"
                value={formData.completedDate}
                onChange={(e) => setFormData({ ...formData, completedDate: e.target.value })}
                style={{ fontSize: '0.85rem', borderRadius: '8px' }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        
        <Modal.Footer className="border-0 pt-0 pb-3 px-4">
          <Button 
            variant="light" 
            onClick={handleClose} 
            size="sm"
            className="px-3"
            style={{ fontSize: '0.8rem' }}
          >
            Cancel
          </Button>
          <Button 
            variant={editId ? "warning" : "primary"} 
            onClick={handleSave}
            size="sm"
            className="px-3"
            style={{ fontSize: '0.8rem' }}
          >
            {editId ? "Update Task" : "Create Task"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* View Task Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered size="lg">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-semibold" style={{ fontSize: '1rem' }}>
            <FaClipboardList className="me-2 text-primary" size={16} />
            Task Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-0">
          {selectedTask && (
            <div>
              <div className="text-center mb-4">
                <div className="rounded-circle d-flex align-items-center justify-content-center text-white mx-auto mb-2 shadow-sm"
                     style={{ width: '70px', height: '70px', background: getAvatarColor(0), fontSize: '1.5rem', fontWeight: '600' }}>
                  <FaClipboardList size={30} />
                </div>
                <h5 className="mb-1 fw-bold" style={{ fontSize: '1rem' }}>{selectedTask.title}</h5>
                <div className="d-flex gap-2 justify-content-center mt-2">
                  <Badge bg={priorityColors[selectedTask.priority] || "secondary"} style={{ fontSize: '0.7rem', borderRadius: '6px' }}>
                    <FaFlag size={10} className="me-1" />
                    {selectedTask.priority || 'Medium'} Priority
                  </Badge>
                  <Badge bg={statusColors[selectedTask.status] || "secondary"} style={{ fontSize: '0.7rem', borderRadius: '6px' }}>
                    {statusIcons[selectedTask.status]}
                    {selectedTask.status || 'Assigned'}
                  </Badge>
                </div>
                <p className="text-muted mt-2 mb-0" style={{ fontSize: '0.75rem' }}>Task ID: {selectedTask.id}</p>
              </div>
              
              <div className="row mb-3">
                <div className="col-md-6">
                  <div className="bg-light p-3 rounded" style={{ borderRadius: '10px' }}>
                    <div className="d-flex align-items-center mb-2">
                      <FaUserAlt size={14} className="text-primary me-2" />
                      <strong style={{ fontSize: '0.8rem' }}>Assigned To</strong>
                    </div>
                    <p className="mb-0" style={{ fontSize: '0.85rem' }}>
                      {selectedTask.employeeName || getEmployeeName(selectedTask.employeeId) || 'Not assigned'}
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="bg-light p-3 rounded" style={{ borderRadius: '10px' }}>
                    <div className="d-flex align-items-center mb-2">
                      <FaProjectDiagram size={14} className="text-success me-2" />
                      <strong style={{ fontSize: '0.8rem' }}>Project</strong>
                    </div>
                    <p className="mb-0" style={{ fontSize: '0.85rem' }}>
                      {selectedTask.projectName || getProjectName(selectedTask.projectId) || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <div className="bg-light p-3 rounded" style={{ borderRadius: '10px' }}>
                  <strong style={{ fontSize: '0.8rem' }}>Description</strong>
                  <p className="mt-2 mb-0" style={{ fontSize: '0.85rem' }}>
                    {selectedTask.description || 'No description available'}
                  </p>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="bg-light p-3 rounded" style={{ borderRadius: '10px' }}>
                    <strong style={{ fontSize: '0.8rem' }}>Dates</strong>
                    <div className="mt-2">
                      <div className="d-flex align-items-center mb-2">
                        <FaCalendarAlt className="me-2 text-muted" size={12} />
                        <span style={{ fontSize: '0.8rem' }}>Due Date: {formatDate(selectedTask.assignedDate)}</span>
                      </div>
                      <div className="d-flex align-items-center">
                        <FaCalendarAlt className="me-2 text-muted" size={12} />
                        <span style={{ fontSize: '0.8rem' }}>Completed: {formatDate(selectedTask.completedDate)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="bg-light p-3 rounded" style={{ borderRadius: '10px' }}>
                    <strong style={{ fontSize: '0.8rem' }}>Additional Info</strong>
                    <div className="mt-2">
                      {selectedTask.moduleId && (
                        <div className="mb-2">
                          <small className="text-muted d-block">Module</small>
                          <span style={{ fontSize: '0.8rem' }}>{getModuleName(selectedTask.moduleId)}</span>
                        </div>
                      )}
                      <div>
                        <small className="text-muted d-block">Priority</small>
                        <Badge bg={priorityColors[selectedTask.priority] || "secondary"} style={{ fontSize: '0.7rem' }}>
                          {selectedTask.priority || 'Medium'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="secondary" size="sm" onClick={() => setShowViewModal(false)} style={{ fontSize: '0.8rem' }}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Task Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <div className="d-flex align-items-center gap-2">
            <div className="rounded-circle p-2 bg-danger bg-opacity-10">
              <FaTrash size={20} className="text-danger" />
            </div>
            <Modal.Title className="fw-semibold" style={{ fontSize: '1rem' }}>Delete Task</Modal.Title>
          </div>
        </Modal.Header>
        <Modal.Body className="text-center pt-3">
          {selectedTask && (
            <>
              <div className="rounded-circle d-flex align-items-center justify-content-center text-white mx-auto mb-2 shadow-sm"
                   style={{ width: '50px', height: '50px', background: getAvatarColor(0), fontSize: '1rem' }}>
                <FaClipboardList size={20} />
              </div>
              <h6 className="mb-1 fw-bold" style={{ fontSize: '0.9rem' }}>{selectedTask.title}</h6>
              <div className="d-flex gap-2 justify-content-center mb-3">
                <Badge bg={priorityColors[selectedTask.priority] || "secondary"} style={{ fontSize: '0.65rem' }}>
                  {selectedTask.priority || 'Medium'}
                </Badge>
                <Badge bg={statusColors[selectedTask.status] || "secondary"} style={{ fontSize: '0.65rem' }}>
                  {selectedTask.status || 'Assigned'}
                </Badge>
              </div>
              <p className="mb-0" style={{ fontSize: '0.8rem' }}>
                Are you sure you want to delete this task?
              </p>
              <small className="text-muted">This action cannot be undone.</small>
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0 justify-content-center">
          <Button variant="light" size="sm" onClick={() => setShowDeleteModal(false)} style={{ fontSize: '0.8rem' }}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={() => handleDelete(selectedTask?.id)} style={{ fontSize: '0.8rem' }}>
            Yes, Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}