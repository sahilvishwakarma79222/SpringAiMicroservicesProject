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
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
  FaCheckCircle,
  FaClock,
  FaCalendarAlt,
  FaUserTie,
  FaUserCog,
  FaHourglassHalf,
  FaBan,
  FaCheck,
  FaTimesCircle
} from "react-icons/fa";
import API from "@/services/api";

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Sorting State
  const [sortBy, setSortBy] = useState("id");
  const [sortDir, setSortDir] = useState("asc");

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [formData, setFormData] = useState({ 
    name: "", 
    description: "",
    projecthead: "",
    projectmanager: "",
    status: "planning",
    startDate: "",
    endDate: ""
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

  // Status options
  const statusOptions = [
    "planning",
    "active", 
    "onHold",
    "completed",
    "cancelled"
  ];

  // Status colors and icons
  const statusColors = {
    "planning": "secondary",
    "active": "success",
    "onHold": "warning",
    "completed": "primary",
    "cancelled": "danger"
  };

  const statusIcons = {
    "planning": <FaHourglassHalf className="me-1" size={10} />,
    "active": <FaCheckCircle className="me-1" size={10} />,
    "onHold": <FaClock className="me-1" size={10} />,
    "completed": <FaCheck className="me-1" size={10} />,
    "cancelled": <FaBan className="me-1" size={10} />
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

  const getInitials = (name) => {
    if (!name) return 'P';
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
    if (status === 'onHold') return 'On Hold';
    return status.charAt(0).toUpperCase() + status.slice(1);
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
      errors.name = "Project name is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await API.get(
        `/project/smart?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}&search=${search}`
      );
      setProjects(res.data.results || res.data || []);
      setTotalPages(res.data.totalPages || 1);
      setTotalRecords(res.data.totalRecords || 0);
    } catch (err) {
      console.error("Error fetching projects:", err);
      showToast("Failed to fetch projects", "error");
      try {
        const res = await API.get("/project/getAllProjects");
        setProjects(res.data || []);
        setTotalPages(1);
        setTotalRecords(res.data?.length || 0);
      } catch (fallbackError) {
        console.error("Error in fallback fetch:", fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [page, size, search, sortBy, sortDir]);

  const handleClose = () => {
    setShowModal(false);
    setFormData({ 
      name: "", 
      description: "", 
      projecthead: "",
      projectmanager: "",
      status: "planning",
      startDate: "",
      endDate: ""
    });
    setFormErrors({});
    setEditId(null);
    setSelectedProject(null);
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    try {
      // ✅ Fix: Use formData.status directly, don't override
      const projectData = {
        name: formData.name,
        description: formData.description,
        projecthead: formData.projecthead,
        projectmanager: formData.projectmanager,
        status: formData.status,  // ✅ Use selected status from form
        startDate: formData.startDate,
        endDate: formData.endDate
      };

      if (editId) {
        await API.put(`/project/update/${editId}`, projectData);
        showToast("Project updated successfully!", "success");
      } else {
        await API.post("/project/save", projectData);
        showToast("Project added successfully!", "success");
      }
      fetchProjects();
      handleClose();
    } catch (err) {
      console.error("Error saving project:", err);
      showToast("Failed to save project", "error");
    }
  };

  const handleEdit = (project) => {
    setFormData({
      name: project.name,
      description: project.description || "",
      projecthead: project.projecthead || "",
      projectmanager: project.projectmanager || "",
      status: project.status || "planning",
      startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : "",
      endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : ""
    });
    setFormErrors({});
    setEditId(project.id);
    setSelectedProject(project);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/project/delete/${id}`);
      fetchProjects();
      setShowDeleteModal(false);
      setSelectedProject(null);
      showToast("Project deleted successfully!", "success");
    } catch (err) {
      console.error("Error deleting project:", err);
      showToast("Failed to delete project", "error");
    }
  };

  const handleView = (project) => {
    setSelectedProject(project);
    setShowViewModal(true);
  };

  const handleConfirmDelete = (project) => {
    setSelectedProject(project);
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
            {toast.type === 'success' ? (
              <FaCheckCircle className="me-2" />
            ) : (
              <FaTimesCircle className="me-2" />
            )}
            <strong className="me-auto">
              {toast.type === 'success' ? 'Success!' : 'Error!'}
            </strong>
            <small>just now</small>
          </Toast.Header>
          <Toast.Body className="py-2">
            {toast.message}
          </Toast.Body>
        </Toast>
      </ToastContainer>

      {/* Page Header */}
      <div className="mb-3">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <h5 className="mb-0 fw-bold text-dark" style={{ fontSize: '1.1rem' }}>Projects Management</h5>
            <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>Manage your organization's projects</p>
          </div>
          <Button 
            variant="primary" 
            className="d-flex align-items-center gap-2 px-3 py-1"
            onClick={() => setShowModal(true)}
            style={{ fontSize: '0.8rem' }}
          >
            <FaPlus size={12} />
            Add Project
          </Button>
        </div>
      </div>

      {/* Main Card */}
      <Card className="shadow-sm border-0" style={{ borderRadius: '10px' }}>
        
        {/* Search Section */}
        <Card.Body className="p-2 border-bottom bg-white">
          <div className="row g-2 align-items-center">
            <div className="col-md-6">
              <InputGroup size="sm" style={{ borderRadius: '6px' }}>
                <Form.Control
                  placeholder="Search projects by name, head, manager..."
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
            <div className="col-md-6 d-flex justify-content-end gap-2">
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
              <Dropdown>
                <Dropdown.Toggle variant="outline-secondary" size="sm" className="d-flex align-items-center gap-1" style={{ fontSize: '0.7rem' }}>
                  <FaFilter size={10} />
                  Filter
                </Dropdown.Toggle>
                <Dropdown.Menu style={{ fontSize: '0.75rem' }}>
                  <Dropdown.Item onClick={() => {setSearch("planning"); setPage(1);}}>Planning</Dropdown.Item>
                  <Dropdown.Item onClick={() => {setSearch("active"); setPage(1);}}>Active</Dropdown.Item>
                  <Dropdown.Item onClick={() => {setSearch("onHold"); setPage(1);}}>On Hold</Dropdown.Item>
                  <Dropdown.Item onClick={() => {setSearch("completed"); setPage(1);}}>Completed</Dropdown.Item>
                  <Dropdown.Item onClick={() => {setSearch("cancelled"); setPage(1);}}>Cancelled</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={() => {setSearch(""); setPage(1);}}>Clear Filters</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
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
                  style={{ cursor: "pointer", minWidth: "200px", fontSize: '0.75rem' }} 
                  onClick={() => handleSort("name")}
                  className="py-2"
                >
                  <div className="d-flex align-items-center gap-1">
                    <span className="fw-semibold text-muted">Project</span>
                    {getSortIcon("name")}
                  </div>
                </th>
                <th style={{ minWidth: "150px", fontSize: '0.75rem' }} className="py-2">
                  <span className="fw-semibold text-muted">Project Head</span>
                </th>
                <th style={{ minWidth: "150px", fontSize: '0.75rem' }} className="py-2">
                  <span className="fw-semibold text-muted">Project Manager</span>
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
                <th style={{ minWidth: "200px", fontSize: '0.75rem' }} className="py-2">
                  <span className="fw-semibold text-muted">Timeline</span>
                </th>
                <th style={{ width: "180px", fontSize: '0.75rem' }} className="text-center py-2">
                  <span className="fw-semibold text-muted">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    <Spinner animation="border" variant="primary" size="sm" className="me-2" />
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>Loading projects...</span>
                  </td>
                </tr>
              ) : projects.length > 0 ? (
                projects.map((p, index) => (
                  <tr key={p.id}>
                    <td className="py-2" style={{ fontSize: '0.75rem' }}>
                      <span className="text-muted">{p.id}</span>
                    </td>
                    <td className="py-2">
                      <div className="d-flex align-items-center gap-2">
                        <div className="rounded-circle d-flex align-items-center justify-content-center text-white shadow-sm"
                             style={{ 
                               width: '32px', 
                               height: '32px', 
                               background: getAvatarColor(index),
                               fontSize: '0.75rem', 
                               fontWeight: '600',
                               boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                             }}>
                          {getInitials(p.name)}
                        </div>
                        <div>
                          <div className="fw-semibold" style={{ fontSize: '0.85rem' }}>{p.name}</div>
                          <small className="text-muted" style={{ fontSize: '0.65rem' }}>ID: {p.id}</small>
                        </div>
                      </div>
                    </td>
                    <td className="py-2">
                      <div className="d-flex align-items-center gap-2">
                        <FaUserTie size={12} className="text-muted" />
                        <span style={{ fontSize: '0.8rem' }}>{p.projecthead || '—'}</span>
                      </div>
                    </td>
                    <td className="py-2">
                      <div className="d-flex align-items-center gap-2">
                        <FaUserCog size={12} className="text-muted" />
                        <span style={{ fontSize: '0.8rem' }}>{p.projectmanager || '—'}</span>
                      </div>
                    </td>
                    <td className="py-2">
                      <Badge 
                        bg={statusColors[p.status] || "secondary"}
                        className="d-inline-flex align-items-center px-2 py-1"
                        style={{ fontWeight: '500', fontSize: '0.7rem', borderRadius: '6px' }}
                      >
                        {statusIcons[p.status]}
                        {formatStatus(p.status)}
                      </Badge>
                    </td>
                    <td className="py-2">
                      <div className="d-flex flex-column gap-1" style={{ fontSize: '0.7rem' }}>
                        <div className="d-flex align-items-center gap-2 text-muted">
                          <FaCalendarAlt size={10} />
                          <span>Start: {formatDate(p.startDate)}</span>
                        </div>
                        <div className="d-flex align-items-center gap-2 text-muted">
                          <FaCalendarAlt size={10} />
                          <span>End: {formatDate(p.endDate)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-2">
                      <div className="d-flex justify-content-center gap-2">
                        <Button
                          variant="outline-info"
                          size="sm"
                          className="d-flex align-items-center gap-1 px-2 py-1"
                          onClick={() => handleView(p)}
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
                          onClick={() => handleEdit(p)}
                          title="Edit Project"
                          style={{ fontSize: '0.7rem', borderRadius: '6px' }}
                        >
                          <FaEdit size={11} />
                          <span>Edit</span>
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="d-flex align-items-center gap-1 px-2 py-1"
                          onClick={() => handleConfirmDelete(p)}
                          title="Delete Project"
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
                  <td colSpan="7" className="text-center py-4">
                    <div className="text-muted">
                      <FaSearch size={28} className="mb-2 opacity-25" />
                      <p className="mb-0" style={{ fontSize: '0.75rem' }}>No projects found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        {/* Pagination Section */}
        {projects.length > 0 && (
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

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton className="border-0 pb-0 pt-3 px-4">
          <div className="d-flex align-items-center gap-2">
            <div className="rounded-circle p-2" style={{ background: editId ? '#ffc10720' : '#0d6efd20' }}>
              {editId ? <FaEdit size={20} className="text-warning" /> : <FaPlus size={20} className="text-primary" />}
            </div>
            <Modal.Title className="fw-semibold" style={{ fontSize: '1.1rem' }}>
              {editId ? "Edit Project" : "Add Project"}
            </Modal.Title>
          </div>
        </Modal.Header>
        
        <Modal.Body className="px-4 py-3">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-semibold text-secondary mb-1">Project Name <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter project name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{ fontSize: '0.85rem', borderRadius: '8px' }}
                isInvalid={!!formErrors.name}
              />
              <Form.Control.Feedback type="invalid" style={{ fontSize: '0.75rem' }}>
                {formErrors.name}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label className="small fw-semibold text-secondary mb-1">Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Enter project description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                style={{ fontSize: '0.85rem', borderRadius: '8px' }}
              />
            </Form.Group>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold text-secondary mb-1">
                    <FaUserTie className="me-1" size={12} />
                    Project Head
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter project head name"
                    value={formData.projecthead}
                    onChange={(e) => setFormData({ ...formData, projecthead: e.target.value })}
                    style={{ fontSize: '0.85rem', borderRadius: '8px' }}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold text-secondary mb-1">
                    <FaUserCog className="me-1" size={12} />
                    Project Manager
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter project manager name"
                    value={formData.projectmanager}
                    onChange={(e) => setFormData({ ...formData, projectmanager: e.target.value })}
                    style={{ fontSize: '0.85rem', borderRadius: '8px' }}
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold text-secondary mb-1">
                    <FaCalendarAlt className="me-1" size={12} />
                    Start Date
                  </Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    style={{ fontSize: '0.85rem', borderRadius: '8px' }}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-semibold text-secondary mb-1">
                    <FaCalendarAlt className="me-1" size={12} />
                    End Date
                  </Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    style={{ fontSize: '0.85rem', borderRadius: '8px' }}
                  />
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-2">
              <Form.Label className="small fw-semibold text-secondary mb-1">Status</Form.Label>
              <Form.Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                style={{ fontSize: '0.85rem', borderRadius: '8px' }}
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>
                    {formatStatus(status)}
                  </option>
                ))}
              </Form.Select>
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
            {editId ? "Update Project" : "Add Project"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* View Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered size="lg">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-semibold" style={{ fontSize: '1rem' }}>Project Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-0">
          {selectedProject && (
            <div>
              <div className="text-center mb-4">
                <div className="rounded-circle d-flex align-items-center justify-content-center text-white mx-auto mb-2 shadow-sm"
                     style={{ width: '70px', height: '70px', background: getAvatarColor(0), fontSize: '1.5rem', fontWeight: '600' }}>
                  {getInitials(selectedProject.name)}
                </div>
                <h5 className="mb-1 fw-bold" style={{ fontSize: '1rem' }}>{selectedProject.name}</h5>
                <Badge bg={statusColors[selectedProject.status]} className="mb-2" style={{ fontSize: '0.7rem', borderRadius: '6px' }}>
                  {statusIcons[selectedProject.status]}
                  {formatStatus(selectedProject.status)}
                </Badge>
                <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>Project ID: {selectedProject.id}</p>
              </div>
              
              <div className="row mb-3">
                <div className="col-md-6">
                  <div className="bg-light p-3 rounded" style={{ borderRadius: '10px' }}>
                    <div className="d-flex align-items-center mb-2">
                      <FaUserTie size={14} className="text-primary me-2" />
                      <strong style={{ fontSize: '0.8rem' }}>Project Head</strong>
                    </div>
                    <p className="mb-0" style={{ fontSize: '0.85rem' }}>
                      {selectedProject.projecthead || 'Not assigned'}
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="bg-light p-3 rounded" style={{ borderRadius: '10px' }}>
                    <div className="d-flex align-items-center mb-2">
                      <FaUserCog size={14} className="text-success me-2" />
                      <strong style={{ fontSize: '0.8rem' }}>Project Manager</strong>
                    </div>
                    <p className="mb-0" style={{ fontSize: '0.85rem' }}>
                      {selectedProject.projectmanager || 'Not assigned'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <div className="bg-light p-3 rounded" style={{ borderRadius: '10px' }}>
                  <strong style={{ fontSize: '0.8rem' }}>Description</strong>
                  <p className="mt-2 mb-0" style={{ fontSize: '0.85rem' }}>
                    {selectedProject.description || 'No description available'}
                  </p>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="bg-light p-3 rounded" style={{ borderRadius: '10px' }}>
                    <strong style={{ fontSize: '0.8rem' }}>Timeline</strong>
                    <div className="mt-2">
                      <div className="d-flex align-items-center mb-2">
                        <FaCalendarAlt className="me-2 text-muted" size={12} />
                        <span style={{ fontSize: '0.8rem' }}>Start: {formatDate(selectedProject.startDate)}</span>
                      </div>
                      <div className="d-flex align-items-center">
                        <FaCalendarAlt className="me-2 text-muted" size={12} />
                        <span style={{ fontSize: '0.8rem' }}>End: {formatDate(selectedProject.endDate)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="bg-light p-3 rounded" style={{ borderRadius: '10px' }}>
                    <strong style={{ fontSize: '0.8rem' }}>Status Info</strong>
                    <div className="mt-2">
                      <Badge bg={statusColors[selectedProject.status]} style={{ fontSize: '0.75rem' }}>
                        {statusIcons[selectedProject.status]}
                        {formatStatus(selectedProject.status)}
                      </Badge>
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

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <div className="d-flex align-items-center gap-2">
            <div className="rounded-circle p-2 bg-danger bg-opacity-10">
              <FaTrash size={20} className="text-danger" />
            </div>
            <Modal.Title className="fw-semibold" style={{ fontSize: '1rem' }}>Delete Project</Modal.Title>
          </div>
        </Modal.Header>
        <Modal.Body className="text-center pt-3">
          {selectedProject && (
            <>
              <div className="rounded-circle d-flex align-items-center justify-content-center text-white mx-auto mb-2 shadow-sm"
                   style={{ width: '50px', height: '50px', background: getAvatarColor(0), fontSize: '1rem' }}>
                {getInitials(selectedProject.name)}
              </div>
              <h6 className="mb-1 fw-bold" style={{ fontSize: '0.9rem' }}>{selectedProject.name}</h6>
              <Badge bg={statusColors[selectedProject.status]} className="mb-3" style={{ fontSize: '0.65rem' }}>
                {statusIcons[selectedProject.status]}
                {formatStatus(selectedProject.status)}
              </Badge>
              <p className="mb-0" style={{ fontSize: '0.8rem' }}>
                Are you sure you want to delete this project?
              </p>
              <small className="text-muted">This action cannot be undone.</small>
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0 justify-content-center">
          <Button variant="light" size="sm" onClick={() => setShowDeleteModal(false)} style={{ fontSize: '0.8rem' }}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={() => handleDelete(selectedProject?.id)} style={{ fontSize: '0.8rem' }}>
            Yes, Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProjectsPage;