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

  // Page size options
  const pageSizeOptions = [5, 10, 20, 50];

  // Color palette for avatar backgrounds
  const avatarColors = [
    'bg-primary', 'bg-success', 'bg-warning', 'bg-info',
    'bg-danger', 'bg-secondary', 'bg-dark'
  ];

  // Get random color for avatar
  const getAvatarColor = (index) => {
    return avatarColors[index % avatarColors.length];
  };

  // Get initials from name
  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  // 🔍 Fetch Employees with Pagination + Search + Sorting
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [page, size, search, sortBy, sortDir]);

  // 🧾 Handle Input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 💾 Save Employee
  const handleSave = async () => {
    try {
      await API.post("/employee/save", formData);
      setShowModal(false);
      setFormData({ name: "", email: "", department: "" });
      fetchEmployees();
    } catch (error) {
      console.error("Error saving employee:", error);
    }
  };

  // ✏️ Update Employee
  const handleUpdate = async () => {
    try {
      await API.put(`/employee/update/${selectedEmployee.id}`, formData);
      setShowModal(false);
      setFormData({ name: "", email: "", department: "" });
      setSelectedEmployee(null);
      fetchEmployees();
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  // 🗑️ Delete Employee
  const handleDelete = async () => {
    try {
      await API.delete(`/employee/delete/${selectedEmployee.id}`);
      setShowDeleteModal(false);
      setSelectedEmployee(null);
      fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
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

  // ➕ Add New Employee
  const handleAddNew = () => {
    setFormData({ name: "", email: "", department: "" });
    setSelectedEmployee(null);
    setShowModal(true);
  };

  // ✏️ Edit Employee
  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setFormData({
      name: employee.name,
      email: employee.email,
      department: employee.department,
    });
    setShowModal(true);
  };

  // 👁️ View Employee
  const handleView = (employee) => {
    setSelectedEmployee(employee);
    setShowViewModal(true);
  };

  // 🗑️ Confirm Delete
  const handleConfirmDelete = (employee) => {
    setSelectedEmployee(employee);
    setShowDeleteModal(true);
  };

  // Get Sort Icon
  const getSortIcon = (column) => {
    if (sortBy !== column) return <FaSort className="ms-1 opacity-50" size={12} />;
    return sortDir === "asc" ? <FaSortUp className="ms-1" size={12} /> : <FaSortDown className="ms-1" size={12} />;
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
              <h5 className="mb-0 text-dark fw-bold" style={{ fontSize: '1.1rem' }}>Employees Management</h5>
              <small className="text-muted" style={{ fontSize: '0.75rem' }}>Manage your team members efficiently</small>
            </div>
            <Button 
              variant="primary" 
              className="d-flex align-items-center gap-2 px-3"
              onClick={handleAddNew}
              style={{ fontSize: '0.8rem' }}
            >
              <FaPlus size={12} />
              Add Employee
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
                    placeholder="Search by name, email, department..."
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
                    <Dropdown.Item>Active Employees</Dropdown.Item>
                    <Dropdown.Item>Inactive Employees</Dropdown.Item>
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
                    onClick={() => handleSort("name")}
                    className="py-2"
                  >
                    <div className="d-flex align-items-center justify-content-between">
                      <span className="fw-semibold text-muted" style={{ fontSize: '0.8rem' }}>Employee</span>
                      {getSortIcon("name")}
                    </div>
                  </th>
                  <th 
                    style={{ cursor: "pointer", minWidth: "200px" }} 
                    onClick={() => handleSort("email")}
                    className="py-2"
                  >
                    <div className="d-flex align-items-center justify-content-between">
                      <span className="fw-semibold text-muted" style={{ fontSize: '0.8rem' }}>Contact</span>
                      {getSortIcon("email")}
                    </div>
                  </th>
                  <th 
                    style={{ cursor: "pointer", minWidth: "130px" }} 
                    onClick={() => handleSort("department")}
                    className="py-2"
                  >
                    <div className="d-flex align-items-center justify-content-between">
                      <span className="fw-semibold text-muted" style={{ fontSize: '0.8rem' }}>Department</span>
                      {getSortIcon("department")}
                    </div>
                  </th>
                  <th style={{ minWidth: "130px" }} className="py-2 fw-semibold text-center text-muted" style={{ fontSize: '0.8rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      <div className="d-flex justify-content-center align-items-center">
                        <Spinner animation="border" variant="primary" size="sm" className="me-2" />
                        <span className="text-muted" style={{ fontSize: '0.8rem' }}>Loading employees...</span>
                      </div>
                    </td>
                  </tr>
                ) : employees.length > 0 ? (
                  employees.map((emp, index) => (
                    <tr key={emp.id} className="border-bottom">
                      <td className="py-2">
                        <span className="text-muted fw-medium" style={{ fontSize: '0.8rem' }}>{emp.id}</span>
                      </td>
                      <td className="py-2">
                        <div className="d-flex align-items-center">
                          <div className={`rounded-circle d-flex align-items-center justify-content-center text-white me-2 ${getAvatarColor(index)}`}
                               style={{ width: '32px', height: '32px', fontSize: '0.8rem', fontWeight: '600' }}>
                            {getInitials(emp.name)}
                          </div>
                          <div>
                            <div className="fw-semibold text-dark" style={{ fontSize: '0.85rem' }}>{emp.name}</div>
                            {/* <small className="text-muted" style={{ fontSize: '0.7rem' }}>Employee</small> */}
                          </div>
                        </div>
                      </td>
                      <td className="py-2">
                        <div className="text-dark" style={{ fontSize: '0.8rem' }}>{emp.email}</div>
                        {/* <small className="text-muted" style={{ fontSize: '0.7rem' }}>Email</small> */}
                      </td>
                      <td className="py-2">
                        <Badge 
                          bg="outline-primary" 
                          text="dark" 
                          className="border px-2 py-1"
                          style={{ 
                            backgroundColor: 'transparent', 
                            borderColor: '#6c757d!important',
                            fontWeight: '500',
                            fontSize: '0.75rem'
                          }}
                        >
                          {emp.department}
                        </Badge>
                      </td>
                      <td className="py-2">
                        <div className="d-flex justify-content-center gap-1">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="d-flex align-items-center px-2"
                            onClick={() => handleView(emp)}
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
                            onClick={() => handleEdit(emp)}
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
                              <Dropdown.Item onClick={() => handleView(emp)} style={{ fontSize: '0.8rem' }}>
                                <FaEye className="me-2 text-primary" size={10} />
                                View Details
                              </Dropdown.Item>
                              <Dropdown.Item onClick={() => handleEdit(emp)} style={{ fontSize: '0.8rem' }}>
                                <FaEdit className="me-2 text-warning" size={10} />
                                Edit Employee
                              </Dropdown.Item>
                              <Dropdown.Divider />
                              <Dropdown.Item className="text-danger" onClick={() => handleConfirmDelete(emp)} style={{ fontSize: '0.8rem' }}>
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
                    <td colSpan="5" className="text-center py-4">
                      <div className="text-muted">
                        <FaSearch size={32} className="mb-2 opacity-25" />
                        <h6 className="mb-2" style={{ fontSize: '0.9rem' }}>No employees found</h6>
                        <p className="mb-0" style={{ fontSize: '0.8rem' }}>
                          {search ? 'Try adjusting your search terms' : 'Get started by adding your first employee'}
                        </p>
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
                <div>
                  <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                    Showing <strong>{((page - 1) * size) + 1}-{Math.min(page * size, totalRecords)}</strong> of <strong>{totalRecords}</strong> employees
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

      {/* Modals */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '1rem' }}>
            {selectedEmployee ? "Edit Employee" : "Add Employee"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label style={{ fontSize: '0.85rem' }}>Name</Form.Label>
              <Form.Control
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter name"
                style={{ fontSize: '0.85rem' }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ fontSize: '0.85rem' }}>Email</Form.Label>
              <Form.Control
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                style={{ fontSize: '0.85rem' }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ fontSize: '0.85rem' }}>Department</Form.Label>
              <Form.Control
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder="Enter department"
                style={{ fontSize: '0.85rem' }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowModal(false)} style={{ fontSize: '0.8rem' }}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={selectedEmployee ? handleUpdate : handleSave}
            style={{ fontSize: '0.8rem' }}
          >
            {selectedEmployee ? "Update Employee" : "Add Employee"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '1rem' }}>Employee Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEmployee && (
            <div className="text-center">
              <div className={`rounded-circle d-flex align-items-center justify-content-center text-white mx-auto mb-2 ${getAvatarColor(0)}`}
                   style={{ width: '60px', height: '60px', fontSize: '1.2rem', fontWeight: '600' }}>
                {getInitials(selectedEmployee.name)}
              </div>
              <h5 className="mb-1" style={{ fontSize: '1rem' }}>{selectedEmployee.name}</h5>
              <p className="text-muted mb-2" style={{ fontSize: '0.8rem' }}>Employee</p>
              
              <div className="text-start">
                <div className="mb-2" style={{ fontSize: '0.85rem' }}>
                  <strong>Employee ID:</strong> {selectedEmployee.id}
                </div>
                <div className="mb-2" style={{ fontSize: '0.85rem' }}>
                  <strong>Email:</strong> {selectedEmployee.email}
                </div>
                <div className="mb-2" style={{ fontSize: '0.85rem' }}>
                  <strong>Department:</strong> {selectedEmployee.department}
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowViewModal(false)} style={{ fontSize: '0.8rem' }}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '1rem' }}>Delete Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEmployee && (
            <div className="text-center">
              <div className="mb-3">
                <div className={`rounded-circle d-flex align-items-center justify-content-center text-white mx-auto mb-2 ${getAvatarColor(0)}`}
                     style={{ width: '50px', height: '50px', fontSize: '1rem', fontWeight: '600' }}>
                  {getInitials(selectedEmployee.name)}
                </div>
                <h6 className="mb-1" style={{ fontSize: '0.9rem' }}>{selectedEmployee.name}</h6>
                <small className="text-muted" style={{ fontSize: '0.8rem' }}>{selectedEmployee.department}</small>
              </div>
              <p className="mb-0" style={{ fontSize: '0.85rem' }}>
                Are you sure you want to delete employee <strong>{selectedEmployee.name}</strong>?
                This action cannot be undone.
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowDeleteModal(false)} style={{ fontSize: '0.8rem' }}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete} style={{ fontSize: '0.8rem' }}>
            Delete Employee
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EmployeePage;