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
  FaTimesCircle,
  FaUserPlus,
  FaUserEdit,
  FaUserMinus
} from "react-icons/fa";

const EmployeePage = () => {
  const [employees, setEmployees] = useState([]);
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
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
  });

  // Toast States
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success"
  });

  // Page size options
  const pageSizeOptions = [5, 10, 20, 50];

  // Professional Avatar Colors (Gradient)
  const avatarColors = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    'linear-gradient(135deg, #ff6a88 0%, #ff99ac 100%)',
    'linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)'
  ];

  const getAvatarColor = (index) => {
    return avatarColors[index % avatarColors.length];
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3000);
  };

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await API.get(
        `/employee/smart?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}&search=${search}`
      );
      setEmployees(res.data.results || []);
      setTotalPages(res.data.totalPages || 1);
      setTotalRecords(res.data.totalRecords || 0);
    } catch (error) {
      console.error("Error fetching employees:", error);
      showToast("Failed to fetch employees", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [page, size, search, sortBy, sortDir]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!formData.name || !formData.email || !formData.department) {
      showToast("Please fill all fields", "error");
      return;
    }
    
    try {
      await API.post("/employee/save", formData);
      setShowModal(false);
      setFormData({ name: "", email: "", department: "" });
      fetchEmployees();
      showToast("Employee added successfully!", "success");
    } catch (error) {
      console.error("Error saving employee:", error);
      showToast("Failed to add employee", "error");
    }
  };

  const handleUpdate = async () => {
    if (!formData.name || !formData.email || !formData.department) {
      showToast("Please fill all fields", "error");
      return;
    }
    
    try {
      await API.put(`/employee/update/${selectedEmployee.id}`, formData);
      setShowModal(false);
      setFormData({ name: "", email: "", department: "" });
      setSelectedEmployee(null);
      fetchEmployees();
      showToast("Employee updated successfully!", "success");
    } catch (error) {
      console.error("Error updating employee:", error);
      showToast("Failed to update employee", "error");
    }
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/employee/delete/${selectedEmployee.id}`);
      setShowDeleteModal(false);
      setSelectedEmployee(null);
      fetchEmployees();
      showToast("Employee deleted successfully!", "success");
    } catch (error) {
      console.error("Error deleting employee:", error);
      showToast("Failed to delete employee", "error");
    }
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

  const handleAddNew = () => {
    setFormData({ name: "", email: "", department: "" });
    setSelectedEmployee(null);
    setShowModal(true);
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setFormData({
      name: employee.name,
      email: employee.email,
      department: employee.department,
    });
    setShowModal(true);
  };

  const handleView = (employee) => {
    setSelectedEmployee(employee);
    setShowViewModal(true);
  };

  const handleConfirmDelete = (employee) => {
    setSelectedEmployee(employee);
    setShowDeleteModal(true);
  };

  const getSortIcon = (column) => {
    if (sortBy !== column) return <FaSort className="ms-1 opacity-50" size={12} />;
    return sortDir === "asc" ? <FaSortUp className="ms-1" size={12} /> : <FaSortDown className="ms-1" size={12} />;
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
          style={{ fontSize: '0.8rem', minWidth: '35px', borderRadius: '6px' }}
        >
          1
        </button>
      );
      if (startPage > 2) {
        pages.push(<span key="dots1" className="mx-1 text-muted" style={{ fontSize: '0.8rem' }}>•••</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`btn btn-sm mx-1 ${page === i ? 'btn-primary' : 'btn-outline-secondary'}`}
          onClick={() => handlePageChange(i)}
          style={{ fontSize: '0.8rem', minWidth: '35px', borderRadius: '6px' }}
        >
          {i}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="dots2" className="mx-1 text-muted" style={{ fontSize: '0.8rem' }}>•••</span>);
      }
      pages.push(
        <button
          key={totalPages}
          className="btn btn-outline-secondary btn-sm mx-1"
          onClick={() => handlePageChange(totalPages)}
          style={{ fontSize: '0.8rem', minWidth: '35px', borderRadius: '6px' }}
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
            <h5 className="mb-0 fw-bold text-dark" style={{ fontSize: '1.1rem' }}>Employees Management</h5>
            <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>Manage your team members efficiently</p>
          </div>
          <Button 
            variant="primary" 
            className="d-flex align-items-center gap-2 px-3 py-1"
            onClick={handleAddNew}
            style={{ fontSize: '0.8rem' }}
          >
            <FaPlus size={12} />
            Add Employee
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
                  placeholder="Search by name, email, department..."
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
                  <Dropdown.Item>All Employees</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item className="text-danger">Clear Filters</Dropdown.Item>
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
                    <span className="fw-semibold text-muted">Employee</span>
                    {getSortIcon("name")}
                  </div>
                </th>
                <th 
                  style={{ cursor: "pointer", minWidth: "200px", fontSize: '0.75rem' }} 
                  onClick={() => handleSort("email")}
                  className="py-2"
                >
                  <div className="d-flex align-items-center gap-1">
                    <span className="fw-semibold text-muted">Contact</span>
                    {getSortIcon("email")}
                  </div>
                </th>
                <th 
                  style={{ cursor: "pointer", minWidth: "130px", fontSize: '0.75rem' }} 
                  onClick={() => handleSort("department")}
                  className="py-2"
                >
                  <div className="d-flex align-items-center gap-1">
                    <span className="fw-semibold text-muted">Department</span>
                    {getSortIcon("department")}
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
                  <td colSpan="5" className="text-center py-4">
                    <Spinner animation="border" variant="primary" size="sm" className="me-2" />
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>Loading...</span>
                  </td>
                </tr>
              ) : employees.length > 0 ? (
                employees.map((emp, index) => (
                  <tr key={emp.id}>
                    <td className="py-2" style={{ fontSize: '0.75rem' }}>
                      <span className="text-muted">{emp.id}</span>
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
                          {getInitials(emp.name)}
                        </div>
                        <span className="fw-semibold" style={{ fontSize: '0.85rem' }}>{emp.name}</span>
                      </div>
                    </td>
                    <td className="py-2" style={{ fontSize: '0.75rem', color: '#6c757d' }}>{emp.email}</td>
                    <td className="py-2">
                      <Badge 
                        bg="light" 
                        text="dark" 
                        className="px-2 py-1"
                        style={{ fontSize: '0.7rem', fontWeight: '400', borderRadius: '6px' }}
                      >
                        {emp.department || 'General'}
                      </Badge>
                    </td>
                    <td className="py-2">
                      {/* Action Buttons - All in one line */}
                      <div className="d-flex justify-content-center gap-2">
                        <Button
                          variant="outline-info"
                          size="sm"
                          className="d-flex align-items-center gap-1 px-2 py-1"
                          onClick={() => handleView(emp)}
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
                          onClick={() => handleEdit(emp)}
                          title="Edit Employee"
                          style={{ fontSize: '0.7rem', borderRadius: '6px' }}
                        >
                          <FaEdit size={11} />
                          <span>Edit</span>
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="d-flex align-items-center gap-1 px-2 py-1"
                          onClick={() => handleConfirmDelete(emp)}
                          title="Delete Employee"
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
                  <td colSpan="5" className="text-center py-4">
                    <div className="text-muted">
                      <FaSearch size={28} className="mb-2 opacity-25" />
                      <p className="mb-0" style={{ fontSize: '0.75rem' }}>No employees found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>

        {/* Pagination Section */}
        {employees.length > 0 && (
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
      <Modal show={showModal} onHide={() => setShowModal(false)} centered className="fade">
        <Modal.Header closeButton className="border-0 pb-0 pt-3 px-4">
          <div className="d-flex align-items-center gap-2">
            <div className="rounded-circle p-2" style={{ background: selectedEmployee ? '#ffc10720' : '#0d6efd20' }}>
              {selectedEmployee ? <FaUserEdit size={20} className="text-warning" /> : <FaUserPlus size={20} className="text-primary" />}
            </div>
            <Modal.Title className="fw-semibold" style={{ fontSize: '1.1rem' }}>
              {selectedEmployee ? "Edit Employee" : "Add Employee"}
            </Modal.Title>
          </div>
        </Modal.Header>
        
        <Modal.Body className="px-4 py-3">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label className="small fw-semibold text-secondary mb-1">Full Name</Form.Label>
              <Form.Control
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter employee name"
                className="py-2"
                style={{ fontSize: '0.85rem', borderRadius: '8px' }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="small fw-semibold text-secondary mb-1">Email Address</Form.Label>
              <Form.Control
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
                className="py-2"
                style={{ fontSize: '0.85rem', borderRadius: '8px' }}
              />
            </Form.Group>

            <Form.Group className="mb-2">
              <Form.Label className="small fw-semibold text-secondary mb-1">Department</Form.Label>
              <Form.Control
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="Enter department name"
                className="py-2"
                style={{ fontSize: '0.85rem', borderRadius: '8px' }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        
        <Modal.Footer className="border-0 pt-0 pb-3 px-4">
          <Button 
            variant="light" 
            onClick={() => setShowModal(false)} 
            size="sm"
            className="px-3"
            style={{ fontSize: '0.8rem' }}
          >
            Cancel
          </Button>
          <Button 
            variant={selectedEmployee ? "warning" : "primary"} 
            onClick={selectedEmployee ? handleUpdate : handleSave}
            size="sm"
            className="px-3"
            style={{ fontSize: '0.8rem' }}
          >
            {selectedEmployee ? (
              <>
                <FaUserEdit className="me-1" size={12} />
                Update Employee
              </>
            ) : (
              <>
                <FaUserPlus className="me-1" size={12} />
                Add Employee
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* View Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-semibold" style={{ fontSize: '1rem' }}>Employee Details</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-0">
          {selectedEmployee && (
            <div className="text-center">
              <div className="rounded-circle d-flex align-items-center justify-content-center text-white mx-auto mb-2 shadow-sm"
                   style={{ width: '60px', height: '60px', background: getAvatarColor(0), fontSize: '1.2rem', fontWeight: '500' }}>
                {getInitials(selectedEmployee.name)}
              </div>
              <h6 className="mb-1 fw-bold" style={{ fontSize: '0.95rem' }}>{selectedEmployee.name}</h6>
              <p className="text-muted mb-3" style={{ fontSize: '0.7rem' }}>Employee</p>
              
              <div className="text-start">
                <div className="mb-2 p-2 rounded" style={{ background: '#f8f9fa' }}>
                  <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>Employee ID</small>
                  <span className="fw-medium" style={{ fontSize: '0.85rem' }}>{selectedEmployee.id}</span>
                </div>
                <div className="mb-2 p-2 rounded" style={{ background: '#f8f9fa' }}>
                  <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>Email</small>
                  <span style={{ fontSize: '0.85rem' }}>{selectedEmployee.email}</span>
                </div>
                <div className="p-2 rounded" style={{ background: '#f8f9fa' }}>
                  <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>Department</small>
                  <span style={{ fontSize: '0.85rem' }}>{selectedEmployee.department || 'General'}</span>
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
              <FaUserMinus size={20} className="text-danger" />
            </div>
            <Modal.Title className="fw-semibold" style={{ fontSize: '1rem' }}>Delete Employee</Modal.Title>
          </div>
        </Modal.Header>
        <Modal.Body className="text-center pt-3">
          {selectedEmployee && (
            <>
              <div className="rounded-circle d-flex align-items-center justify-content-center text-white mx-auto mb-2 shadow-sm"
                   style={{ width: '50px', height: '50px', background: getAvatarColor(0), fontSize: '1rem' }}>
                {getInitials(selectedEmployee.name)}
              </div>
              <h6 className="mb-1 fw-bold" style={{ fontSize: '0.9rem' }}>{selectedEmployee.name}</h6>
              <small className="text-muted d-block mb-3" style={{ fontSize: '0.7rem' }}>{selectedEmployee.department}</small>
              <p className="mb-0" style={{ fontSize: '0.8rem' }}>
                Are you sure you want to delete this employee?
              </p>
              <small className="text-muted">This action cannot be undone.</small>
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0 justify-content-center">
          <Button variant="light" size="sm" onClick={() => setShowDeleteModal(false)} style={{ fontSize: '0.8rem' }}>
            Cancel
          </Button>
          <Button variant="danger" size="sm" onClick={handleDelete} style={{ fontSize: '0.8rem' }}>
            Yes, Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EmployeePage;