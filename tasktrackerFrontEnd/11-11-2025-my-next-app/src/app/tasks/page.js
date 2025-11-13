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
  Badge
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
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
  FaEllipsisH
} from "react-icons/fa";
import API from "@/services/api";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [modules, setModules] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [modulesLoading, setModulesLoading] = useState(false);
  const [taskLoading, setTaskLoading] = useState(false);

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
    "Assigned": "info",
    "Pending": "secondary",
    "Cancelled": "danger"
  };

  // Priority colors
  const priorityColors = {
    "High": "danger",
    "Medium": "warning",
    "Low": "info"
  };

  // 🔍 Fetch All Data
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await API.get(
        `/task/smart?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}&search=${search}`
      );
      setTasks(res.data.results || []);
      setTotalPages(res.data.totalPages || 1);
      setTotalRecords(res.data.totalRecords || 0);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔍 Fetch Single Task by ID for Edit/View
  const fetchTaskById = async (id) => {
    setTaskLoading(true);
    try {
      const res = await API.get(`/task/getById/${id}`);
      return res.data;
    } catch (err) {
      console.error("Error fetching task by ID:", err);
      return null;
    } finally {
      setTaskLoading(false);
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

  const fetchModules = async () => {
    setModulesLoading(true);
    try {
      const res = await API.get("/modules/smart?page=1&size=100");
      setModules(res.data.results || res.data || []);
    } catch (err) {
      console.error("Error fetching modules:", err);
    } finally {
      setModulesLoading(false);
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
    fetchModules();
    fetchEmployees();
  }, [page, size, search, sortBy, sortDir]);

  const handleShow = () => setShowModal(true);
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
    setEditId(null);
    setSelectedTask(null);
  };

  const handleSave = async () => {
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
      } else {
        await API.post("/task/save", payload);
      }
      fetchTasks();
      handleClose();
    } catch (err) {
      console.error("Error saving task:", err);
      alert("Error saving task. Please check all fields.");
    }
  };

  const handleEdit = async (task) => {
    try {
      // Fetch complete task data by ID for editing
      const fullTaskData = await fetchTaskById(task.id);
      
      if (fullTaskData) {
        setFormData({
          title: fullTaskData.title || "",
          description: fullTaskData.description || "",
          status: fullTaskData.status || "Assigned",
          priority: fullTaskData.priority || "Medium",
          projectId: fullTaskData.projectId || "",
          moduleId: fullTaskData.moduleId || "",
          employeeId: fullTaskData.employeeId || "",
          assignedDate: fullTaskData.assignedDate || "",
          completedDate: fullTaskData.completedDate || ""
        });
      } else {
        // Fallback to table data if individual fetch fails
        setFormData({
          title: task.title || "",
          description: "",
          status: task.status || "Assigned",
          priority: "Medium",
          projectId: "",
          moduleId: "",
          employeeId: "",
          assignedDate: task.assignedDate || "",
          completedDate: task.completedDate || ""
        });
      }
      
      setEditId(task.id);
      setSelectedTask(task);
      setShowModal(true);
    } catch (err) {
      console.error("Error preparing edit form:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/task/delete/${id}`);
      fetchTasks();
      setShowDeleteModal(false);
      setSelectedTask(null);
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const handleView = async (task) => {
    try {
      // Fetch complete task data by ID for viewing
      const fullTaskData = await fetchTaskById(task.id);
      setSelectedTask(fullTaskData || task);
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

  // Format Date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  // Get project name by ID
  const getProjectName = (projectId) => {
    if (!projectId) return 'N/A';
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : `Project #${projectId}`;
  };

  // Get module name by ID
  const getModuleName = (moduleId) => {
    if (!moduleId) return 'N/A';
    const module = modules.find(m => m.id === moduleId);
    return module ? module.name : `Module #${moduleId}`;
  };

  // Get employee name by ID
  const getEmployeeName = (employeeId) => {
    if (!employeeId) return 'N/A';
    const employee = employees.find(e => e.id === employeeId);
    return employee ? employee.name : `Employee #${employeeId}`;
  };

  // Find project ID by name (for table display mapping)
  const getProjectIdByName = (projectName) => {
    const project = projects.find(p => p.name === projectName);
    return project ? project.id : null;
  };

  // Find employee ID by name (for table display mapping)
  const getEmployeeIdByName = (employeeName) => {
    const employee = employees.find(e => e.name === employeeName);
    return employee ? employee.id : null;
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

    // Previous dots
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          className="btn btn-outline-secondary btn-sm mx-1"
          onClick={() => handlePageChange(1)}
          style={{ fontSize: '0.8rem' }}
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(<span key="dots1" className="mx-1 text-muted" style={{ fontSize: '0.8rem' }}>•••</span>);
      }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`btn btn-sm mx-1 ${page === i ? 'btn-primary' : 'btn-outline-secondary'}`}
          onClick={() => handlePageChange(i)}
          style={{ fontSize: '0.8rem' }}
        >
          {i}
        </button>
      );
    }

    // Next dots
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="dots2" className="mx-1 text-muted" style={{ fontSize: '0.8rem' }}>•••</span>);
      }
      pages.push(
        <button
          key={totalPages}
          className="btn btn-outline-secondary btn-sm mx-1"
          onClick={() => handlePageChange(totalPages)}
          style={{ fontSize: '0.8rem' }}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="container-fluid py-3">
      {/* Card Container */}
      <Card className="shadow-sm border-0">
        {/* Card Header */}
        <Card.Header className="bg-white border-0 py-3">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-0 text-dark fw-bold" style={{ fontSize: '1.1rem' }}>Tasks Management</h5>
              <small className="text-muted" style={{ fontSize: '0.75rem' }}>Manage your organization's tasks</small>
            </div>
            <Button
              variant="primary"
              className="d-flex align-items-center gap-2 px-3"
              onClick={handleShow}
              style={{ fontSize: '0.8rem' }}
            >
              <FaPlus size={12} />
              Add Task
            </Button>
          </div>
        </Card.Header>

        <Card.Body className="p-0">
          {/* Controls Section */}
          <div className="p-3 border-bottom bg-light">
            <div className="row g-3 align-items-center">
              <div className="col-md-6">
                <InputGroup>
                  <Form.Control
                    placeholder="Search tasks by title, employee, project, or status..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    style={{ fontSize: '0.8rem' }}
                  />
                  <InputGroup.Text className="bg-white" style={{ fontSize: '0.8rem' }}>
                    <FaSearch className="text-muted" size={12} />
                  </InputGroup.Text>
                </InputGroup>
              </div>
              <div className="col-md-6 d-flex justify-content-end gap-3">
                <div className="d-flex align-items-center gap-2">
                  <span className="text-muted" style={{ fontSize: '0.8rem' }}>Show:</span>
                  <Form.Select
                    value={size}
                    onChange={handleSizeChange}
                    style={{ width: '70px', fontSize: '0.8rem' }}
                  >
                    {pageSizeOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </Form.Select>
                </div>
                <Dropdown>
                  <Dropdown.Toggle variant="outline-secondary" size="sm" className="d-flex align-items-center gap-2" style={{ fontSize: '0.8rem' }}>
                    <FaFilter size={10} />
                    Filter
                  </Dropdown.Toggle>
                  <Dropdown.Menu style={{ fontSize: '0.8rem' }}>
                    <Dropdown.Item>Assigned Tasks</Dropdown.Item>
                    <Dropdown.Item>In Progress</Dropdown.Item>
                    <Dropdown.Item>Completed</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item>Clear Filters</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead className="table-light">
                <tr>
                  <th
                    style={{ cursor: "pointer", width: "70px" }}
                    onClick={() => handleSort("id")}
                    className="py-2"
                  >
                    <div className="d-flex align-items-center justify-content-between">
                      <span className="fw-semibold text-muted" style={{ fontSize: '0.8rem' }}>ID</span>
                      {getSortIcon("id")}
                    </div>
                  </th>
                  <th
                    style={{ cursor: "pointer", minWidth: "180px" }}
                    onClick={() => handleSort("title")}
                    className="py-2"
                  >
                    <div className="d-flex align-items-center justify-content-between">
                      <span className="fw-semibold text-muted" style={{ fontSize: '0.8rem' }}>Task</span>
                      {getSortIcon("title")}
                    </div>
                  </th>
                  <th
                    style={{ cursor: "pointer", minWidth: "100px" }}
                    onClick={() => handleSort("status")}
                    className="py-2"
                  >
                    <div className="d-flex align-items-center justify-content-between">
                      <span className="fw-semibold text-muted" style={{ fontSize: '0.8rem' }}>Status</span>
                      {getSortIcon("status")}
                    </div>
                  </th>
                  <th
                    style={{ cursor: "pointer", minWidth: "120px" }}
                    onClick={() => handleSort("employeeName")}
                    className="py-2"
                  >
                    <div className="d-flex align-items-center justify-content-between">
                      <span className="fw-semibold text-muted" style={{ fontSize: '0.8rem' }}>Employee</span>
                      {getSortIcon("employeeName")}
                    </div>
                  </th>
                  <th
                    style={{ cursor: "pointer", minWidth: "120px" }}
                    onClick={() => handleSort("projectName")}
                    className="py-2"
                  >
                    <div className="d-flex align-items-center justify-content-between">
                      <span className="fw-semibold text-muted" style={{ fontSize: '0.8rem' }}>Project</span>
                      {getSortIcon("projectName")}
                    </div>
                  </th>
                  <th
                    style={{ cursor: "pointer", minWidth: "110px" }}
                    onClick={() => handleSort("assignedDate")}
                    className="py-2"
                  >
                    <div className="d-flex align-items-center justify-content-between">
                      <span className="fw-semibold text-muted" style={{ fontSize: '0.8rem' }}>Assigned</span>
                      {getSortIcon("assignedDate")}
                    </div>
                  </th>
                  <th
                    style={{ cursor: "pointer", minWidth: "110px" }}
                    onClick={() => handleSort("completedDate")}
                    className="py-2"
                  >
                    <div className="d-flex align-items-center justify-content-between">
                      <span className="fw-semibold text-muted" style={{ fontSize: '0.8rem' }}>Completed</span>
                      {getSortIcon("completedDate")}
                    </div>
                  </th>
                  <th style={{ minWidth: "130px" }} className="py-2 fw-semibold text-center text-muted" style={{ fontSize: '0.8rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      <div className="d-flex justify-content-center align-items-center">
                        <Spinner animation="border" variant="primary" size="sm" className="me-2" />
                        <span className="text-muted" style={{ fontSize: '0.8rem' }}>Loading tasks...</span>
                      </div>
                    </td>
                  </tr>
                ) : tasks.length > 0 ? (
                  tasks.map((t) => (
                    <tr key={t.id} className="border-bottom">
                      <td className="py-2">
                        <span className="text-muted fw-medium" style={{ fontSize: '0.8rem' }}>{t.id}</span>
                      </td>
                      <td className="py-2">
                        <div className="fw-semibold text-dark" style={{ fontSize: '0.85rem' }}>{t.title}</div>
                        <small className="text-muted" style={{ fontSize: '0.7rem' }}>Task</small>
                      </td>
                      <td className="py-2">
                        <Badge className={statusColors[t.status] || "info"} style={{ fontSize: '0.7rem' }}>
                          {t.status}
                        </Badge>
                      </td>
                      <td className="py-2">
                        <div className="text-dark" style={{ fontSize: '0.8rem' }}>{t.employeeName}</div>
                        <small className="text-muted" style={{ fontSize: '0.7rem' }}>Employee</small>
                      </td>
                      <td className="py-2">
                        <div className="text-dark" style={{ fontSize: '0.8rem' }}>{t.projectName}</div>
                        <small className="text-muted" style={{ fontSize: '0.7rem' }}>Project</small>
                      </td>
                      <td className="py-2">
                        <div className="text-dark" style={{ fontSize: '0.8rem' }}>{formatDate(t.assignedDate)}</div>
                        <small className="text-muted" style={{ fontSize: '0.7rem' }}>Date</small>
                      </td>
                      <td className="py-2">
                        <div className="text-dark" style={{ fontSize: '0.8rem' }}>{formatDate(t.completedDate)}</div>
                        <small className="text-muted" style={{ fontSize: '0.7rem' }}>Date</small>
                      </td>
                      <td className="py-2">
                        <div className="d-flex justify-content-center gap-1">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="d-flex align-items-center px-2"
                            onClick={() => handleView(t)}
                            title="View Details"
                            style={{ fontSize: '0.7rem' }}
                          >
                            <FaEye size={10} className="me-1" />
                            View
                          </Button>
                          <Button
                            variant="outline-warning"
                            size="sm"
                            className="d-flex align-items-center px-2"
                            onClick={() => handleEdit(t)}
                            title="Edit"
                            style={{ fontSize: '0.7rem' }}
                          >
                            <FaEdit size={10} className="me-1" />
                            Edit
                          </Button>
                          <Dropdown>
                            <Dropdown.Toggle
                              variant="outline-secondary"
                              size="sm"
                              className="d-flex align-items-center px-1"
                              style={{ fontSize: '0.7rem' }}
                            >
                              <FaEllipsisH size={10} />
                            </Dropdown.Toggle>
                            <Dropdown.Menu style={{ fontSize: '0.8rem' }}>
                              <Dropdown.Item onClick={() => handleView(t)} style={{ fontSize: '0.8rem' }}>
                                <FaEye className="me-2 text-primary" size={10} />
                                View Details
                              </Dropdown.Item>
                              <Dropdown.Item onClick={() => handleEdit(t)} style={{ fontSize: '0.8rem' }}>
                                <FaEdit className="me-2 text-warning" size={10} />
                                Edit Task
                              </Dropdown.Item>
                              <Dropdown.Divider />
                              <Dropdown.Item className="text-danger" onClick={() => handleConfirmDelete(t)} style={{ fontSize: '0.8rem' }}>
                                <FaTrash className="me-2" size={10} />
                                Delete
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      <div className="text-muted">
                        <FaSearch size={32} className="mb-2 opacity-25" />
                        <h6 className="mb-2" style={{ fontSize: '0.9rem' }}>No tasks found</h6>
                        <p className="mb-0" style={{ fontSize: '0.8rem' }}>
                          {search ? 'Try adjusting your search terms' : 'Get started by adding your first task'}
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
            <div className="p-2 border-top bg-light">
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
                    className="d-flex align-items-center px-2"
                    style={{ fontSize: '0.7rem' }}
                  >
                    <FaChevronLeft size={10} className="me-1" />
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
                    className="d-flex align-items-center px-2"
                    style={{ fontSize: '0.7rem' }}
                  >
                    Next
                    <FaChevronRight size={10} className="ms-1" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* ➕ Add/Edit Task Modal */}
      <Modal show={showModal} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '1rem' }}>{editId ? "Edit Task" : "Add Task"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {taskLoading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2 mb-0" style={{ fontSize: '0.85rem' }}>Loading task data...</p>
            </div>
          ) : (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label style={{ fontSize: '0.85rem' }}>Title *</Form.Label>
                <Form.Control
                  placeholder="Enter task title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  style={{ fontSize: '0.85rem' }}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label style={{ fontSize: '0.85rem' }}>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter task description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{ fontSize: '0.85rem' }}
                />
              </Form.Group>

              <div className="row">
                <Form.Group className="mb-3 col-md-6">
                  <Form.Label style={{ fontSize: '0.85rem' }}>Status *</Form.Label>
                  <Form.Select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    style={{ fontSize: '0.85rem' }}
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3 col-md-6">
                  <Form.Label style={{ fontSize: '0.85rem' }}>Priority *</Form.Label>
                  <Form.Select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    style={{ fontSize: '0.85rem' }}
                  >
                    {priorityOptions.map(priority => (
                      <option key={priority} value={priority}>{priority}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>

              <div className="row">
                <Form.Group className="mb-3 col-md-6">
                  <Form.Label style={{ fontSize: '0.85rem' }}>Project *</Form.Label>
                  <Form.Select
                    value={formData.projectId}
                    onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                    required
                    style={{ fontSize: '0.85rem' }}
                  >
                    <option value="">Select Project</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>
                        {project.name} (ID: {project.id})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3 col-md-6">
                  <Form.Label style={{ fontSize: '0.85rem' }}>Module</Form.Label>
                  <Form.Select
                    value={formData.moduleId}
                    onChange={(e) => setFormData({ ...formData, moduleId: e.target.value })}
                    style={{ fontSize: '0.85rem' }}
                    disabled={modulesLoading}
                  >
                    <option value="">Select Module</option>
                    {modules.map(module => (
                      <option key={module.id} value={module.id}>
                        {module.name}
                      </option>
                    ))}
                  </Form.Select>
                  {modulesLoading && (
                    <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                      Loading modules...
                    </small>
                  )}
                </Form.Group>
              </div>

              <div className="row">
                <Form.Group className="mb-3 col-md-6">
                  <Form.Label style={{ fontSize: '0.85rem' }}>Employee *</Form.Label>
                  <Form.Select
                    value={formData.employeeId}
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    required
                    style={{ fontSize: '0.85rem' }}
                  >
                    <option value="">Select Employee</option>
                    {employees.map(employee => (
                      <option key={employee.id} value={employee.id}>
                        {employee.name} (ID: {employee.id})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3 col-md-6">
                  <Form.Label style={{ fontSize: '0.85rem' }}>Assigned Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.assignedDate}
                    onChange={(e) => setFormData({ ...formData, assignedDate: e.target.value })}
                    style={{ fontSize: '0.85rem' }}
                  />
                </Form.Group>
              </div>

              <Form.Group className="mb-3">
                <Form.Label style={{ fontSize: '0.85rem' }}>Completed Date</Form.Label>
                <Form.Control
                  type="date"
                  value={formData.completedDate}
                  onChange={(e) => setFormData({ ...formData, completedDate: e.target.value })}
                  style={{ fontSize: '0.85rem' }}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClose} style={{ fontSize: '0.8rem' }}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={taskLoading} style={{ fontSize: '0.8rem' }}>
            {editId ? "Update Task" : "Add Task"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* 👁️ View Task Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '1rem' }}>Task Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {taskLoading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2 mb-0" style={{ fontSize: '0.85rem' }}>Loading task details...</p>
            </div>
          ) : selectedTask ? (
            <div>
              <div className="mb-3">
                <Badge className={statusColors[selectedTask.status] || "info"} style={{ fontSize: '0.8rem' }}>
                  {selectedTask.status}
                </Badge>
              </div>
              <div className="mb-2" style={{ fontSize: '0.85rem' }}>
                <strong>ID:</strong> {selectedTask.id}
              </div>
              <div className="mb-2" style={{ fontSize: '0.85rem' }}>
                <strong>Title:</strong> {selectedTask.title}
              </div>
              <div className="mb-2" style={{ fontSize: '0.85rem' }}>
                <strong>Description:</strong> {selectedTask.description || 'N/A'}
              </div>
              <div className="mb-2" style={{ fontSize: '0.85rem' }}>
                <strong>Employee:</strong> {selectedTask.employeeName || getEmployeeName(selectedTask.employeeId)}
              </div>
              <div className="mb-2" style={{ fontSize: '0.85rem' }}>
                <strong>Project:</strong> {selectedTask.projectName || getProjectName(selectedTask.projectId)}
              </div>
              <div className="mb-2" style={{ fontSize: '0.85rem' }}>
                <strong>Assigned Date:</strong> {formatDate(selectedTask.assignedDate)}
              </div>
              <div className="mb-2" style={{ fontSize: '0.85rem' }}>
                <strong>Completed Date:</strong> {formatDate(selectedTask.completedDate)}
              </div>
              {selectedTask.priority && (
                <div className="mb-2" style={{ fontSize: '0.85rem' }}>
                  <strong>Priority:</strong> {selectedTask.priority}
                </div>
              )}
              {selectedTask.moduleId && (
                <div className="mb-2" style={{ fontSize: '0.85rem' }}>
                  <strong>Module:</strong> {getModuleName(selectedTask.moduleId)}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-muted">
              <p style={{ fontSize: '0.85rem' }}>No task data available</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowViewModal(false)} style={{ fontSize: '0.8rem' }}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* 🗑️ Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '1rem' }}>Delete Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTask && (
            <div className="text-center">
              <div className="mb-3">
                <h6 className="mb-1" style={{ fontSize: '0.9rem' }}>{selectedTask.title}</h6>
                <Badge className={statusColors[selectedTask.status] || "info"} style={{ fontSize: '0.7rem' }}>
                  {selectedTask.status}
                </Badge>
              </div>
              <p className="mb-0" style={{ fontSize: '0.85rem' }}>
                Are you sure you want to delete task <strong>"{selectedTask.title}"</strong>?
                This action cannot be undone.
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowDeleteModal(false)} style={{ fontSize: '0.8rem' }}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => handleDelete(selectedTask?.id)} style={{ fontSize: '0.8rem' }}>
            Delete Task
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}