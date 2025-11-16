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
    FaSort,
    FaSortUp,
    FaSortDown,
    FaSearch,
    FaFilter,
    FaChevronLeft,
    FaChevronRight,
    FaTasks,
    FaUser,
    FaCalendarAlt,
    FaClock,
    FaProjectDiagram,
    FaUsers
} from "react-icons/fa";

export default function MyTasksPage() {
    const [tasks, setTasks] = useState([]);
    const [employees, setEmployees] = useState([]); // All employees for dropdown
    const [selectedEmployee, setSelectedEmployee] = useState(null); // Selected employee from dropdown
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState(false);
    const [employeesLoading, setEmployeesLoading] = useState(false);

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

    // 🔍 Fetch All Employees for Dropdown
    const fetchEmployees = async () => {
        setEmployeesLoading(true);
        try {
            const res = await API.get("/employee/smart?page=1&size=100");
            setEmployees(res.data.results || res.data || []);

            // Auto-select first employee by default
            if (res.data.results && res.data.results.length > 0 && !selectedEmployee) {
                setSelectedEmployee(res.data.results[0]);
            } else if (res.data && res.data.length > 0 && !selectedEmployee) {
                setSelectedEmployee(res.data[0]);
            }
        } catch (err) {
            console.error("Error fetching employees:", err);
        } finally {
            setEmployeesLoading(false);
        }
    };

    // 🔍 Fetch Employee's Tasks based on selected employee
    const fetchEmployeeTasks = async () => {
        if (!selectedEmployee) return;

        setLoading(true);
        try {
            const res = await API.get(
                `/task/employee/${selectedEmployee.id}/smart?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}&search=${search}`
            );

            // Handle different response structures
            const tasksData = res.data?.results || res.data || [];
            setTasks(tasksData);
            setTotalPages(res.data?.totalPages || 1);
            setTotalRecords(res.data?.totalRecords || tasksData.length);

        } catch (error) {
            console.error("Error fetching employee tasks:", error);
            // Fallback to all tasks with client-side filtering
            try {
                const allTasksRes = await API.get("/task/all");
                const allTasks = allTasksRes.data?.results || allTasksRes.data || [];
                const employeeTasks = allTasks.filter(task =>
                    task.employeeId === selectedEmployee.id ||
                    task.assignedTo === selectedEmployee.id ||
                    task.employeeName === selectedEmployee.name
                );
                setTasks(employeeTasks);
                setTotalPages(1);
                setTotalRecords(employeeTasks.length);
            } catch (fallbackError) {
                console.error("Fallback also failed:", fallbackError);
                setTasks([]);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    useEffect(() => {
        if (selectedEmployee) {
            fetchEmployeeTasks();
        }
    }, [selectedEmployee, page, size, search, sortBy, sortDir]);

    // Handle employee selection from dropdown
    const handleEmployeeChange = (employee) => {
        setSelectedEmployee(employee);
        setPage(1); // Reset to first page when employee changes
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
                                <FaTasks className="text-primary me-2" />
                                Employee Tasks
                            </h3>
                            <p className="text-muted mb-0" style={{ fontSize: '0.875rem' }}>
                                View tasks assigned to different employees
                            </p>
                        </div>

                        {/* Employee Selection Dropdown */}
                        <div className="d-flex align-items-center gap-3">
                            <div className="d-flex align-items-center gap-2">
                                <FaUsers className="text-muted" />
                                <span className="text-muted" style={{ fontSize: '0.875rem' }}>Select Employee:</span>
                            </div>
                            <Dropdown>
                                <Dropdown.Toggle
                                    variant="outline-primary"
                                    className="d-flex align-items-center gap-2"
                                    disabled={employeesLoading}
                                    style={{ fontSize: '0.8rem' }}
                                >
                                    {employeesLoading ? (
                                        <>
                                            <Spinner animation="border" size="sm" className="me-2" />
                                            Loading...
                                        </>
                                    ) : selectedEmployee ? (
                                        <>
                                            <FaUser className="me-1" />
                                            {selectedEmployee.name}
                                            {selectedEmployee.department && ` - ${selectedEmployee.department}`}
                                        </>
                                    ) : (
                                        "Select Employee"
                                    )}
                                </Dropdown.Toggle>
                                <Dropdown.Menu style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                    {employees.map((employee) => (
                                        <Dropdown.Item
                                            key={employee.id}
                                            onClick={() => handleEmployeeChange(employee)}
                                            className={selectedEmployee?.id === employee.id ? 'bg-light' : ''}
                                        >
                                            <div className="d-flex align-items-center">
                                                <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white me-2"
                                                    style={{ width: '24px', height: '24px', fontSize: '0.7rem' }}>
                                                    {employee.name ? employee.name.charAt(0).toUpperCase() : 'E'}
                                                </div>
                                                <div>
                                                    <div className="fw-medium" style={{ fontSize: '0.85rem' }}>{employee.name}</div>
                                                    <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                                                        {employee.department} • ID: {employee.id}
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

            {/* Selected Employee Info */}
            {selectedEmployee && (
                <Row className="g-3 mb-4">
                    <Col xl={3} lg={3} md={6}>
                        <Card className="shadow-sm border-0 h-100">
                            <Card.Body className="p-3">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 className="text-muted mb-2" style={{ fontSize: '0.8rem' }}>Selected Employee</h6>
                                        <h5 className="fw-bold text-primary mb-0" style={{ fontSize: '1.2rem' }}>{selectedEmployee.name}</h5>
                                        <small className="text-muted" style={{ fontSize: '0.75rem' }}>{selectedEmployee.department}</small>
                                    </div>
                                    <div className="bg-primary bg-opacity-10 rounded p-2">
                                        <FaUser className="text-primary" size={20} />
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
                                {selectedEmployee ? `${selectedEmployee.name}'s Tasks` : 'Select an Employee'}
                            </h5>
                            <small className="text-muted" style={{ fontSize: '0.875rem' }}>
                                {selectedEmployee ? `Managing tasks for ${selectedEmployee.name}` : 'Please select an employee to view their tasks'}
                            </small>
                        </div>
                        {selectedEmployee && (
                            <div className="d-flex align-items-center gap-2">
                                <span className="text-muted" style={{ fontSize: '0.75rem' }}>Showing {tasks.length} tasks</span>
                            </div>
                        )}
                    </div>
                </Card.Header>

                <Card.Body className="p-0">
                    {selectedEmployee ? (
                        <>
                            {/* Controls Section */}
                            <div className="p-3 border-bottom bg-light">
                                <div className="row g-3 align-items-center">
                                    <div className="col-md-6">
                                        <InputGroup>
                                            <Form.Control
                                                placeholder="Search tasks by title, project, or status..."
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
                            <div className="table-responsive">
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
                                            <th style={{ cursor: "pointer", minWidth: "150px" }} onClick={() => handleSort("projectName")}>
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <span className="fw-semibold text-muted" style={{ fontSize: '0.8rem' }}>Project</span>
                                                    {getSortIcon("projectName")}
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
                                                        <span className="text-muted" style={{ fontSize: '0.875rem' }}>Loading tasks...</span>
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
                                                                {task.description.length > 80
                                                                    ? `${task.description.substring(0, 80)}...`
                                                                    : task.description
                                                                }
                                                            </small>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <Badge 
                                                            bg={getStatusBadge(task.status)}
                                                            style={{ fontSize: '0.75rem' }}
                                                        >
                                                            {task.status}
                                                        </Badge>
                                                    </td>
                                                    <td>
                                                        <div className="d-flex align-items-center">
                                                            <FaProjectDiagram className="text-primary me-2" size={14} />
                                                            <span style={{ fontSize: '0.85rem' }}>{task.projectName || 'No Project'}</span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className={`fw-medium ${new Date(task.assignedDate) < new Date() && 
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
                                                            {search ? 'No tasks match your search criteria' : `${selectedEmployee.name} has no tasks assigned yet`}
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
                        /* No Employee Selected State */
                        <div className="text-center py-5">
                            <FaUsers size={48} className="text-muted mb-3 opacity-25" />
                            <h5 className="text-muted" style={{ fontSize: '1rem' }}>No Employee Selected</h5>
                            <p className="text-muted mb-0" style={{ fontSize: '0.875rem' }}>Please select an employee from the dropdown to view their tasks</p>
                        </div>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
}