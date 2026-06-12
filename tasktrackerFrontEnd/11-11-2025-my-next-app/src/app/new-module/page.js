"use client";
import React, { useEffect, useState } from "react";
import API from "@/services/api";
import {
  Card,
  Table,
  Button,
  Form,
  InputGroup,
  Modal,
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
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
  FaCheckCircle,
  FaClock,
  FaPlay,
  FaList,
  FaTimesCircle,
  FaProjectDiagram,
  FaCalendarAlt,
  FaUserAlt,
  FaUserTie
} from "react-icons/fa";

const ModulePage = () => {
  const [modules, setModules] = useState([]);
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]); // ✅ Add employees state
  const [search, setSearch] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [employeesLoading, setEmployeesLoading] = useState(false); // ✅ Add

  // Sorting State
  const [sortBy, setSortBy] = useState("id");
  const [sortDir, setSortDir] = useState("desc");

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    priority: "Medium",
    status: "Active",
    clientName: "",
    projectId: "",
    moduleLead: "", // ✅ Add module lead field
    startDate: "",
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

  // Page size options
  const pageSizeOptions = [5, 10, 20, 50];

  // Priority colors
  const priorityColors = {
    "High": "danger",
    "Medium": "warning",
    "Low": "info"
  };

  // Status colors
  const statusColors = {
    "Planning": "secondary",
    "Active": "success",
    "Complete": "primary",
    "On Hold": "warning"
  };

  // Status icons
  const statusIcons = {
    "Planning": <FaClock className="me-1" size={10} />,
    "Active": <FaPlay className="me-1" size={10} />,
    "Complete": <FaCheckCircle className="me-1" size={10} />,
    "On Hold": <FaList className="me-1" size={10} />
  };

  // Professional Avatar Colors
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

  const getInitials = (name) => {
    if (!name) return 'M';
    return name.charAt(0).toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatStatus = (status) => {
    if (!status) return 'Planning';
    if (status === 'On Hold') return 'On Hold';
    return status;
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = "Module name is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Fetch Modules
  const fetchModules = async () => {
    setLoading(true);
    try {
      let url = `/modules/smart?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`;
      if (search) url += `&search=${search}`;
      
      const res = await API.get(url);
      let allModules = res.data.results || [];
      
      if (selectedProject) {
        allModules = allModules.filter(module => {
          const projectName = getProjectNameFromList(module.projectId);
          return projectName === selectedProject;
        });
      }
      
      setModules(allModules);
      setTotalRecords(allModules.length);
      setTotalPages(Math.ceil(allModules.length / size));
    } catch (error) {
      console.error("Error fetching modules:", error);
      showToast("Failed to fetch modules", "error");
    } finally {
      setLoading(false);
    }
  };

  const getProjectNameFromList = (projectId) => {
    if (!projectId) return 'N/A';
    const project = projects.find(p => p.id === projectId);
    return project ? project.name : `Project #${projectId}`;
  };

  // Fetch Projects
  const fetchProjects = async () => {
    setProjectsLoading(true);
    try {
      const res = await API.get('/project/smart?page=1&size=100');
      setProjects(res.data.results || res.data || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setProjectsLoading(false);
    }
  };

  // ✅ Fetch Employees for Module Lead dropdown
  const fetchEmployees = async () => {
    setEmployeesLoading(true);
    try {
      const res = await API.get('/employee/smart?page=1&size=100');
      setEmployees(res.data.results || res.data || []);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setEmployeesLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchEmployees(); // ✅ Fetch employees
  }, []);

  useEffect(() => {
    fetchModules();
  }, [page, size, search, sortBy, sortDir, selectedProject]);

  const handleClose = () => {
    setShowModal(false);
    setFormData({
      name: "",
      description: "",
      priority: "Medium",
      status: "Active",
      clientName: "",
      projectId: "",
      moduleLead: "",
      startDate: "",
      completedDate: ""
    });
    setFormErrors({});
    setEditId(null);
    setSelectedModule(null);
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    try {
      const formattedData = {
        name: formData.name,
        description: formData.description,
        priority: formData.priority,
        status: formData.status,
        clientName: formData.clientName,
        projectId: formData.projectId ? parseInt(formData.projectId) : null,
        moduleLead: formData.moduleLead ? parseInt(formData.moduleLead) : null, // ✅ Add module lead
        startDate: formData.startDate || new Date().toISOString().split('T')[0],
        completedDate: formData.completedDate || null
      };
      
      if (editId) {
        await API.put(`/modules/update/${editId}`, formattedData);
        showToast("Module updated successfully!", "success");
      } else {
        await API.post("/modules/save", formattedData);
        showToast("Module added successfully!", "success");
      }
      fetchModules();
      handleClose();
    } catch (error) {
      console.error("Error saving module:", error);
      showToast("Failed to save module", "error");
    }
  };

  const handleEdit = (module) => {
    setFormData({
      name: module.name,
      description: module.description || "",
      priority: module.priority || "Medium",
      status: module.status || "Active",
      clientName: module.clientName || "",
      projectId: module.projectId || "",
      moduleLead: module.moduleLead || "",
      startDate: module.startDate || "",
      completedDate: module.completedDate || ""
    });
    setFormErrors({});
    setEditId(module.id);
    setSelectedModule(module);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/modules/delete/${id}`);
      fetchModules();
      setShowDeleteModal(false);
      setSelectedModule(null);
      showToast("Module deleted successfully!", "success");
    } catch (error) {
      console.error("Error deleting module:", error);
      showToast("Failed to delete module", "error");
    }
  };

  const handleView = (module) => {
    setSelectedModule(module);
    setShowViewModal(true);
  };

  const handleConfirmDelete = (module) => {
    setSelectedModule(module);
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

  const clearProjectFilter = () => {
    setSelectedProject("");
    setPage(1);
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
            <h5 className="mb-0 fw-bold text-dark" style={{ fontSize: '1.1rem' }}>Module Management</h5>
            <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>Manage and track project modules</p>
          </div>
          <Button 
            variant="primary" 
            className="d-flex align-items-center gap-2 px-3 py-1"
            onClick={() => setShowModal(true)}
            style={{ fontSize: '0.8rem' }}
          >
            <FaPlus size={12} />
            Add Module
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
                  placeholder="Search by name, description, client..."
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
                  {projectsLoading ? (
                    <Dropdown.Item disabled>Loading projects...</Dropdown.Item>
                  ) : (
                    projects.map((project) => (
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
                    ))
                  )}
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
                <th style={{ cursor: "pointer", width: "70px" }} onClick={() => handleSort("id")} className="py-2">
                  <div className="d-flex align-items-center gap-1"><span className="fw-semibold text-muted" style={{ fontSize: '0.75rem' }}>ID</span>{getSortIcon("id")}</div>
                </th>
                <th style={{ cursor: "pointer", minWidth: "200px" }} onClick={() => handleSort("name")} className="py-2">
                  <div className="d-flex align-items-center gap-1"><span className="fw-semibold text-muted" style={{ fontSize: '0.75rem' }}>Module Name</span>{getSortIcon("name")}</div>
                </th>
                <th style={{ cursor: "pointer", minWidth: "100px" }} onClick={() => handleSort("priority")} className="py-2">
                  <div className="d-flex align-items-center gap-1"><span className="fw-semibold text-muted" style={{ fontSize: '0.75rem' }}>Priority</span>{getSortIcon("priority")}</div>
                </th>
                <th style={{ cursor: "pointer", minWidth: "120px" }} onClick={() => handleSort("status")} className="py-2">
                  <div className="d-flex align-items-center gap-1"><span className="fw-semibold text-muted" style={{ fontSize: '0.75rem' }}>Status</span>{getSortIcon("status")}</div>
                </th>
                <th style={{ minWidth: "150px" }} className="py-2"><span className="fw-semibold text-muted" style={{ fontSize: '0.75rem' }}>Project</span></th>
                <th style={{ minWidth: "150px" }} className="py-2"><span className="fw-semibold text-muted" style={{ fontSize: '0.75rem' }}>Module Lead</span></th>
                <th style={{ minWidth: "130px" }} className="py-2"><span className="fw-semibold text-muted" style={{ fontSize: '0.75rem' }}>Client</span></th>
                <th style={{ width: "180px" }} className="text-center py-2"><span className="fw-semibold text-muted" style={{ fontSize: '0.75rem' }}>Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="8" className="text-center py-4"><Spinner animation="border" variant="primary" size="sm" className="me-2" /><span className="text-muted">Loading modules...</span></td></tr>
              ) : modules.length > 0 ? (
                modules.map((module, index) => (
                  <tr key={module.id}>
                    <td className="py-2"><span className="text-muted">#{module.id}</span></td>
                    <td className="py-2">
                      <div className="d-flex align-items-center gap-2">
                        <div className="rounded-circle d-flex align-items-center justify-content-center text-white shadow-sm" style={{ width: '32px', height: '32px', background: getAvatarColor(index), fontSize: '0.75rem', fontWeight: '600', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>{getInitials(module.name)}</div>
                        <div><div className="fw-semibold" style={{ fontSize: '0.85rem' }}>{module.name}</div><small className="text-muted" style={{ fontSize: '0.65rem' }}>ID: {module.id}</small></div>
                      </div>
                    </td>
                    <td className="py-2"><Badge bg={priorityColors[module.priority] || "secondary"} className="px-2 py-1" style={{ fontWeight: '500', fontSize: '0.7rem', borderRadius: '6px' }}>{module.priority}</Badge></td>
                    <td className="py-2"><Badge bg={statusColors[module.status] || "secondary"} className="d-inline-flex align-items-center px-2 py-1" style={{ fontWeight: '500', fontSize: '0.7rem', borderRadius: '6px' }}>{statusIcons[module.status]}{module.status}</Badge></td>
                    <td className="py-2"><span style={{ fontSize: '0.8rem' }}>{getProjectName(module.projectId)}</span></td>
                    <td className="py-2">
                      <div className="d-flex align-items-center gap-2">
                        <FaUserTie size={12} className="text-primary" />
                        <span style={{ fontSize: '0.8rem' }}>{getEmployeeName(module.moduleLead)}</span>
                      </div>
                    </td>
                    <td className="py-2"><span style={{ fontSize: '0.8rem' }}>{module.clientName || 'N/A'}</span></td>
                    <td className="py-2">
                      <div className="d-flex justify-content-center gap-2">
                        <Button variant="outline-info" size="sm" className="d-flex align-items-center gap-1 px-2 py-1" onClick={() => handleView(module)} style={{ fontSize: '0.7rem', borderRadius: '6px' }}><FaEye size={11} /><span>View</span></Button>
                        <Button variant="outline-warning" size="sm" className="d-flex align-items-center gap-1 px-2 py-1" onClick={() => handleEdit(module)} style={{ fontSize: '0.7rem', borderRadius: '6px' }}><FaEdit size={11} /><span>Edit</span></Button>
                        <Button variant="outline-danger" size="sm" className="d-flex align-items-center gap-1 px-2 py-1" onClick={() => handleConfirmDelete(module)} style={{ fontSize: '0.7rem', borderRadius: '6px' }}><FaTrash size={11} /><span>Delete</span></Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="8" className="text-center py-4"><div className="text-muted"><FaSearch size={28} className="mb-2 opacity-25" /><p className="mb-0">No modules found</p></div></td></tr>
              )}
            </tbody>
          </Table>
        </div>

        {modules.length > 0 && (
          <div className="p-2 border-top bg-light">
            <div className="d-flex justify-content-between align-items-center">
              <span className="text-muted" style={{ fontSize: '0.65rem' }}>Showing {((page - 1) * size) + 1} to {Math.min(page * size, totalRecords)} of {totalRecords}</span>
              <div className="d-flex align-items-center gap-1">
                <Button variant="outline-secondary" size="sm" onClick={handlePrevious} disabled={page <= 1} className="px-2" style={{ fontSize: '0.65rem' }}><FaChevronLeft size={8} className="me-1" />Prev</Button>
                <div className="d-flex gap-1">{renderPaginationNumbers()}</div>
                <Button variant="outline-secondary" size="sm" onClick={handleNext} disabled={page >= totalPages} className="px-2" style={{ fontSize: '0.65rem' }}>Next<FaChevronRight size={8} className="ms-1" /></Button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton className="border-0 pb-0 pt-3 px-4">
          <div className="d-flex align-items-center gap-2">
            <div className="rounded-circle p-2" style={{ background: editId ? '#ffc10720' : '#0d6efd20' }}>{editId ? <FaEdit size={20} className="text-warning" /> : <FaPlus size={20} className="text-primary" />}</div>
            <Modal.Title className="fw-semibold" style={{ fontSize: '1.1rem' }}>{editId ? "Edit Module" : "Add Module"}</Modal.Title>
          </div>
        </Modal.Header>
        
        <Modal.Body className="px-4 py-3">
          <Form>
            <Form.Group className="mb-3"><Form.Label className="small fw-semibold text-secondary mb-1">Module Name <span className="text-danger">*</span></Form.Label><Form.Control type="text" placeholder="Enter module name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ fontSize: '0.85rem', borderRadius: '8px' }} isInvalid={!!formErrors.name} /><Form.Control.Feedback type="invalid">{formErrors.name}</Form.Control.Feedback></Form.Group>
            <Form.Group className="mb-3"><Form.Label className="small fw-semibold text-secondary mb-1">Description</Form.Label><Form.Control as="textarea" rows={2} placeholder="Enter module description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} style={{ fontSize: '0.85rem', borderRadius: '8px' }} /></Form.Group>
            <div className="row">
              <div className="col-md-6"><Form.Group className="mb-3"><Form.Label className="small fw-semibold text-secondary mb-1">Priority</Form.Label><Form.Select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} style={{ fontSize: '0.85rem', borderRadius: '8px' }}><option value="High">High</option><option value="Medium">Medium</option><option value="Low">Low</option></Form.Select></Form.Group></div>
              <div className="col-md-6"><Form.Group className="mb-3"><Form.Label className="small fw-semibold text-secondary mb-1">Status</Form.Label><Form.Select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} style={{ fontSize: '0.85rem', borderRadius: '8px' }}><option value="Planning">Planning</option><option value="Active">Active</option><option value="Complete">Complete</option><option value="On Hold">On Hold</option></Form.Select></Form.Group></div>
            </div>
            <div className="row">
              <div className="col-md-6"><Form.Group className="mb-3"><Form.Label className="small fw-semibold text-secondary mb-1">Project</Form.Label><Form.Select value={formData.projectId} onChange={(e) => setFormData({ ...formData, projectId: e.target.value })} style={{ fontSize: '0.85rem', borderRadius: '8px' }} disabled={projectsLoading}><option value="">Select Project</option>{projects.map((project) => (<option key={project.id} value={project.id}>{project.name}</option>))}</Form.Select></Form.Group></div>
              <div className="col-md-6"><Form.Group className="mb-3"><Form.Label className="small fw-semibold text-secondary mb-1">Module Lead</Form.Label><Form.Select value={formData.moduleLead} onChange={(e) => setFormData({ ...formData, moduleLead: e.target.value })} style={{ fontSize: '0.85rem', borderRadius: '8px' }} disabled={employeesLoading}><option value="">Select Module Lead</option>{employees.map((emp) => (<option key={emp.id} value={emp.id}>{emp.name}</option>))}</Form.Select></Form.Group></div>
            </div>
            <div className="row">
              <div className="col-md-6"><Form.Group className="mb-3"><Form.Label className="small fw-semibold text-secondary mb-1">Client Name</Form.Label><Form.Control type="text" placeholder="Enter client name" value={formData.clientName} onChange={(e) => setFormData({ ...formData, clientName: e.target.value })} style={{ fontSize: '0.85rem', borderRadius: '8px' }} /></Form.Group></div>
              <div className="col-md-6"><Form.Group className="mb-3"><Form.Label className="small fw-semibold text-secondary mb-1">Start Date</Form.Label><Form.Control type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} style={{ fontSize: '0.85rem', borderRadius: '8px' }} /></Form.Group></div>
            </div>
            <div className="row">
              <div className="col-md-6"><Form.Group className="mb-3"><Form.Label className="small fw-semibold text-secondary mb-1">Completed Date</Form.Label><Form.Control type="date" value={formData.completedDate} onChange={(e) => setFormData({ ...formData, completedDate: e.target.value })} style={{ fontSize: '0.85rem', borderRadius: '8px' }} /></Form.Group></div>
            </div>
          </Form>
        </Modal.Body>
        
        <Modal.Footer className="border-0 pt-0 pb-3 px-4">
          <Button variant="light" onClick={handleClose} size="sm" className="px-3" style={{ fontSize: '0.8rem' }}>Cancel</Button>
          <Button variant={editId ? "warning" : "primary"} onClick={handleSave} size="sm" className="px-3" style={{ fontSize: '0.8rem' }}>{editId ? "Update Module" : "Add Module"}</Button>
        </Modal.Footer>
      </Modal>

      {/* View Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered size="lg">
        <Modal.Header closeButton className="border-0 pb-0"><Modal.Title className="fw-semibold" style={{ fontSize: '1rem' }}>Module Details</Modal.Title></Modal.Header>
        <Modal.Body className="pt-0">
          {selectedModule && (
            <div>
              <div className="text-center mb-4">
                <div className="rounded-circle d-flex align-items-center justify-content-center text-white mx-auto mb-2 shadow-sm" style={{ width: '70px', height: '70px', background: getAvatarColor(0), fontSize: '1.5rem', fontWeight: '600' }}>{getInitials(selectedModule.name)}</div>
                <h5 className="mb-1 fw-bold">{selectedModule.name}</h5>
                <div className="d-flex gap-2 justify-content-center mt-2"><Badge bg={priorityColors[selectedModule.priority] || "secondary"}>{selectedModule.priority} Priority</Badge><Badge bg={statusColors[selectedModule.status] || "secondary"}>{statusIcons[selectedModule.status]}{selectedModule.status}</Badge></div>
                <p className="text-muted mt-2 mb-0">Module ID: {selectedModule.id}</p>
              </div>
              <div className="row mb-3">
                <div className="col-md-6"><div className="bg-light p-3 rounded"><strong>Project</strong><p className="mt-2 mb-0">{getProjectName(selectedModule.projectId)}</p></div></div>
                <div className="col-md-6"><div className="bg-light p-3 rounded"><strong>Module Lead</strong><p className="mt-2 mb-0">{getEmployeeName(selectedModule.moduleLead)}</p></div></div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6"><div className="bg-light p-3 rounded"><strong>Client</strong><p className="mt-2 mb-0">{selectedModule.clientName || 'N/A'}</p></div></div>
                <div className="col-md-6"><div className="bg-light p-3 rounded"><strong>Description</strong><p className="mt-2 mb-0">{selectedModule.description || 'No description available'}</p></div></div>
              </div>
              <div className="row">
                <div className="col-md-6"><div className="bg-light p-3 rounded"><strong>Timeline</strong><div className="mt-2"><div className="d-flex align-items-center mb-2"><FaCalendarAlt className="me-2 text-muted" size={12} /><span>Start: {formatDate(selectedModule.startDate)}</span></div><div className="d-flex align-items-center"><FaCalendarAlt className="me-2 text-muted" size={12} /><span>Completed: {formatDate(selectedModule.completedDate)}</span></div></div></div></div>
                <div className="col-md-6"><div className="bg-light p-3 rounded"><strong>Status Info</strong><div className="mt-2"><Badge bg={statusColors[selectedModule.status] || "secondary"}>{statusIcons[selectedModule.status]}{selectedModule.status}</Badge></div></div></div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0"><Button variant="secondary" size="sm" onClick={() => setShowViewModal(false)}>Close</Button></Modal.Footer>
      </Modal>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton className="border-0 pb-0"><div className="d-flex align-items-center gap-2"><div className="rounded-circle p-2 bg-danger bg-opacity-10"><FaTrash size={20} className="text-danger" /></div><Modal.Title className="fw-semibold">Delete Module</Modal.Title></div></Modal.Header>
        <Modal.Body className="text-center pt-3">
          {selectedModule && (<><div className="rounded-circle d-flex align-items-center justify-content-center text-white mx-auto mb-2 shadow-sm" style={{ width: '50px', height: '50px', background: getAvatarColor(0), fontSize: '1rem' }}>{getInitials(selectedModule.name)}</div><h6 className="mb-1 fw-bold">{selectedModule.name}</h6><div className="d-flex gap-2 justify-content-center mb-3"><Badge bg={priorityColors[selectedModule.priority] || "secondary"}>{selectedModule.priority}</Badge><Badge bg={statusColors[selectedModule.status] || "secondary"}>{selectedModule.status}</Badge></div><p className="mb-0">Are you sure you want to delete this module?</p><small className="text-muted">This action cannot be undone.</small></>)}
        </Modal.Body>
        <Modal.Footer className="border-0 justify-content-center"><Button variant="light" size="sm" onClick={() => setShowDeleteModal(false)}>Cancel</Button><Button variant="danger" size="sm" onClick={() => handleDelete(selectedModule?.id)}>Yes, Delete</Button></Modal.Footer>
      </Modal>
    </div>
  );
};

export default ModulePage;