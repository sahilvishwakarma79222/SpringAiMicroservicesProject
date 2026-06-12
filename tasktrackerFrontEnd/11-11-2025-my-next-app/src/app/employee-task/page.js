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
    Col,
    Modal,
    Nav
} from "react-bootstrap";
import {
    FaSort,
    FaSortUp,
    FaSortDown,
    FaSearch,
    FaChevronLeft,
    FaChevronRight,
    FaTasks,
    FaUser,
    FaCalendarAlt,
    FaClock,
    FaProjectDiagram,
    FaUsers,
    FaBug,
    FaExclamationTriangle,
    FaCheckCircle,
    FaTimesCircle,
    FaExternalLinkAlt
} from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function MyTasksPage() {
    const router = useRouter();
    const [tasks, setTasks] = useState([]);
    const [errors, setErrors] = useState([]);
    const [projects, setProjects] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState(false);
    const [employeesLoading, setEmployeesLoading] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [taskErrors, setTaskErrors] = useState([]);
    const [activeTab, setActiveTab] = useState("tasks");
    
    // Error Pagination State
    const [errorPage, setErrorPage] = useState(1);
    const [errorSize, setErrorSize] = useState(10);
    const [errorTotalPages, setErrorTotalPages] = useState(1);
    const [errorTotalRecords, setErrorTotalRecords] = useState(0);
    const [errorSearch, setErrorSearch] = useState("");
    const [errorLoading, setErrorLoading] = useState(false);

    // Sorting State
    const [sortBy, setSortBy] = useState("id");
    const [sortDir, setSortDir] = useState("asc");
    const [errorSortBy, setErrorSortBy] = useState("id");
    const [errorSortDir, setErrorSortDir] = useState("desc");

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

    // Error status colors
    const errorStatusColors = {
        "Open": "danger",
        "In Progress": "warning",
        "Resolved": "success",
        "Closed": "secondary"
    };

    // Fetch All Employees
    const fetchEmployees = async () => {
        setEmployeesLoading(true);
        try {
            const res = await API.get("/employee/smart?page=1&size=100");
            const empList = res.data.results || res.data || [];
            setEmployees(empList);
            if (empList.length > 0 && !selectedEmployee) {
                setSelectedEmployee(empList[0]);
            }
        } catch (err) {
            console.error("Error fetching employees:", err);
        } finally {
            setEmployeesLoading(false);
        }
    };

    // Fetch Projects
    const fetchProjects = async () => {
        try {
            const res = await API.get("/project/smart?page=1&size=100");
            setProjects(res.data.results || res.data || []);
        } catch (err) {
            console.error("Error fetching projects:", err);
        }
    };

    // Fetch Employee Tasks
    const fetchEmployeeTasks = async () => {
        if (!selectedEmployee) return;

        setLoading(true);
        try {
            const res = await API.get(
                `/task/employee/${selectedEmployee.id}/smart?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}&search=${search}`
            );
            const tasksData = res.data?.results || res.data || [];
            
            const enhancedTasks = tasksData.map(task => ({
                ...task,
                isOverdue: task.dueDate && new Date(task.dueDate) < new Date() && 
                           task.status?.toUpperCase() !== 'COMPLETED' && 
                           task.status?.toUpperCase() !== 'DONE'
            }));
            
            setTasks(enhancedTasks);
            setTotalPages(res.data?.totalPages || 1);
            setTotalRecords(res.data?.totalRecords || tasksData.length);
        } catch (error) {
            console.error("Error fetching employee tasks:", error);
            setTasks([]);
        } finally {
            setLoading(false);
        }
    };

    // Fetch Errors for selected employee
    // Fetch Errors for selected employee
const fetchEmployeeErrors = async () => {
    if (!selectedEmployee) return;
    
    setErrorLoading(true);
    try {
        // 1. Fetch all errors
        let url = `/errors/smart?page=${errorPage}&size=${errorSize}&sortBy=${errorSortBy}&sortDir=${errorSortDir}`;
        if (errorSearch) url += `&search=${errorSearch}`;
        
        const res = await API.get(url);
        const allErrors = res.data.results || res.data || [];
        
        // 2. Fetch modules where employee is module lead
        let moduleLeadProjectIds = [];
        try {
            const modulesRes = await API.get(`/modules/smart?page=1&size=100`);
            const allModules = modulesRes.data.results || modulesRes.data || [];
            const leadModules = allModules.filter(m => m.moduleLead === selectedEmployee.id);
            moduleLeadProjectIds = leadModules.map(m => m.projectId);
        } catch (err) {
            console.error("Error fetching modules:", err);
        }
        
        // 3. Fetch tasks of this employee to get their project IDs
        let employeeProjectIds = [];
        try {
            const tasksRes = await API.get(`/task/employee/${selectedEmployee.id}/smart?page=1&size=100`);
            const employeeTasks = tasksRes.data?.results || tasksRes.data || [];
            employeeProjectIds = [...new Set(employeeTasks.map(task => task.projectId).filter(id => id))];
        } catch (err) {
            console.error("Error fetching tasks:", err);
        }
        
        // 4. Filter errors based on multiple conditions
        const employeeErrors = allErrors.filter(err => {
            const isReporter = err.reportedBy === selectedEmployee.id;
            const isAssigned = err.assignedTo === selectedEmployee.id;
            const isModuleLead = moduleLeadProjectIds.includes(err.projectId);
            const isOnProject = employeeProjectIds.includes(err.projectId);
            
            // Employee should see error if:
            // - They reported it, OR
            // - It's assigned to them, OR
            // - They are module lead of that project, OR
            // - They have tasks in that project
            const shouldSee = isReporter || isAssigned || isModuleLead || isOnProject;
            
            return shouldSee && err.status !== 'Closed';
        });
        
        setErrors(employeeErrors);
        setErrorTotalRecords(employeeErrors.length);
        setErrorTotalPages(Math.ceil(employeeErrors.length / errorSize));
    } catch (error) {
        console.error("Error fetching employee errors:", error);
        setErrors([]);
    } finally {
        setErrorLoading(false);
    }
};

    // Fetch errors for a specific task
    const fetchTaskErrors = async (task) => {
        setTaskErrors([]);
        try {
            const res = await API.get(`/errors/smart?page=1&size=100`);
            const allErrors = res.data.results || res.data || [];
            const relatedErrors = allErrors.filter(err => 
                err.projectId === task.projectId && 
                (err.moduleId === task.moduleId || !err.moduleId) &&
                err.status !== 'Closed'
            );
            setTaskErrors(relatedErrors);
            setSelectedTask(task);
            setShowErrorModal(true);
        } catch (error) {
            console.error("Error fetching task errors:", error);
            setTaskErrors([]);
            setSelectedTask(task);
            setShowErrorModal(true);
        }
    };

    useEffect(() => {
        fetchEmployees();
        fetchProjects();
    }, []);

    useEffect(() => {
        if (selectedEmployee) {
            fetchEmployeeTasks();
        }
    }, [selectedEmployee, page, size, search, sortBy, sortDir]);

    useEffect(() => {
        if (selectedEmployee && activeTab === "errors") {
            fetchEmployeeErrors();
        }
    }, [selectedEmployee, errorPage, errorSize, errorSearch, errorSortBy, errorSortDir, activeTab]);

    const handleEmployeeChange = (employee) => {
        setSelectedEmployee(employee);
        setPage(1);
        setErrorPage(1);
        setSearch("");
        setErrorSearch("");
        setActiveTab("tasks");
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

    const handleErrorSort = (column) => {
        if (errorSortBy === column) {
            setErrorSortDir(errorSortDir === "asc" ? "desc" : "asc");
        } else {
            setErrorSortBy(column);
            setErrorSortDir("asc");
        }
        setErrorPage(1);
    };

    const getSortIcon = (column) => {
        if (sortBy !== column) return <FaSort className="ms-1 opacity-50" size={12} />;
        return sortDir === "asc" ? <FaSortUp className="ms-1" size={12} /> : <FaSortDown className="ms-1" size={12} />;
    };

    const getErrorSortIcon = (column) => {
        if (errorSortBy !== column) return <FaSort className="ms-1 opacity-50" size={12} />;
        return errorSortDir === "asc" ? <FaSortUp className="ms-1" size={12} /> : <FaSortDown className="ms-1" size={12} />;
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Not set";
        return new Date(dateString).toLocaleDateString();
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

    // Error Pagination
    const handleErrorPageChange = (newPage) => {
        setErrorPage(newPage);
    };

    const handleErrorPrevious = () => {
        setErrorPage(prev => Math.max(1, prev - 1));
    };

    const handleErrorNext = () => {
        setErrorPage(prev => Math.min(errorTotalPages, prev + 1));
    };

    const handleErrorSizeChange = (e) => {
        setErrorSize(parseInt(e.target.value));
        setErrorPage(1);
    };

    const getProjectName = (projectId) => {
        if (!projectId) return 'N/A';
        const project = projects.find(p => p.id === projectId);
        return project ? project.name : `Project #${projectId}`;
    };

    const renderPaginationNumbers = (currentPage, totalPages, onPageChange) => {
        const pages = [];
        const maxVisiblePages = 5;
        const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (startPage > 1) {
            pages.push(
                <button key={1} className="btn btn-outline-secondary btn-sm mx-1" onClick={() => onPageChange(1)} style={{ fontSize: '0.75rem', minWidth: '35px', borderRadius: '6px' }}>
                    1
                </button>
            );
            if (startPage > 2) {
                pages.push(<span key="dots1" className="mx-1 text-muted">•••</span>);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button key={i} className={`btn btn-sm mx-1 ${currentPage === i ? 'btn-primary' : 'btn-outline-secondary'}`}
                    onClick={() => onPageChange(i)} style={{ fontSize: '0.75rem', minWidth: '35px', borderRadius: '6px' }}>
                    {i}
                </button>
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pages.push(<span key="dots2" className="mx-1 text-muted">•••</span>);
            }
            pages.push(
                <button key={totalPages} className="btn btn-outline-secondary btn-sm mx-1"
                    onClick={() => onPageChange(totalPages)} style={{ fontSize: '0.75rem', minWidth: '35px', borderRadius: '6px' }}>
                    {totalPages}
                </button>
            );
        }

        return pages;
    };

    const stats = {
        total: tasks.length,
        pending: tasks.filter(t => t.status?.toUpperCase() === 'PENDING').length,
        inProgress: tasks.filter(t => {
            const status = t.status?.toUpperCase();
            return status === 'IN_PROGRESS' || status === 'ONGOING';
        }).length,
        completed: tasks.filter(t => {
            const status = t.status?.toUpperCase();
            return status === 'COMPLETED' || status === 'DONE';
        }).length,
        overdue: tasks.filter(t => t.isOverdue).length,
        openErrors: errors.filter(e => e.status !== 'Closed').length
    };

    const paginatedErrors = errors.slice((errorPage - 1) * errorSize, errorPage * errorSize);

    return (
        <div className="container-fluid py-3 px-3" style={{ minHeight: 'calc(100vh - 56px)', background: '#f8f9fa' }}>
            
            {/* Header Section */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                        <div>
                            <h3 className="text-dark fw-bold mb-1" style={{ fontSize: '1.4rem' }}>
                                <FaUsers className="text-primary me-2" />
                                Employee Dashboard
                            </h3>
                            <p className="text-muted mb-0" style={{ fontSize: '0.875rem' }}>
                                View tasks and errors assigned to employees
                            </p>
                        </div>

                        <div className="d-flex align-items-center gap-3">
                            <div className="d-flex align-items-center gap-2">
                                <FaUser className="text-muted" />
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
                                                        {employee.department || 'No Department'} • ID: {employee.id}
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

            {selectedEmployee && (
                <>
                    {/* Stats Cards */}
                    <Row className="g-3 mb-4">
                        <Col xl={2} lg={3} md={6}>
                            <Card className="shadow-sm border-0 h-100">
                                <Card.Body className="p-3">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="text-muted mb-2" style={{ fontSize: '0.75rem' }}>Total Tasks</h6>
                                            <h3 className="fw-bold text-primary mb-0" style={{ fontSize: '1.6rem' }}>{stats.total}</h3>
                                        </div>
                                        <div className="bg-primary bg-opacity-10 rounded p-2">
                                            <FaTasks className="text-primary" size={20} />
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col xl={2} lg={3} md={6}>
                            <Card className="shadow-sm border-0 h-100">
                                <Card.Body className="p-3">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="text-muted mb-2" style={{ fontSize: '0.75rem' }}>In Progress</h6>
                                            <h3 className="fw-bold text-warning mb-0" style={{ fontSize: '1.6rem' }}>{stats.inProgress}</h3>
                                        </div>
                                        <div className="bg-warning bg-opacity-10 rounded p-2">
                                            <FaClock className="text-warning" size={20} />
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col xl={2} lg={3} md={6}>
                            <Card className="shadow-sm border-0 h-100">
                                <Card.Body className="p-3">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="text-muted mb-2" style={{ fontSize: '0.75rem' }}>Completed</h6>
                                            <h3 className="fw-bold text-success mb-0" style={{ fontSize: '1.6rem' }}>{stats.completed}</h3>
                                        </div>
                                        <div className="bg-success bg-opacity-10 rounded p-2">
                                            <FaCheckCircle className="text-success" size={20} />
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col xl={2} lg={3} md={6}>
                            <Card className={`shadow-sm border-0 h-100 ${stats.overdue > 0 ? 'border-danger' : ''}`}>
                                <Card.Body className="p-3">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="text-muted mb-2" style={{ fontSize: '0.75rem' }}>Overdue</h6>
                                            <h3 className={`fw-bold mb-0 ${stats.overdue > 0 ? 'text-danger' : 'text-muted'}`} style={{ fontSize: '1.6rem' }}>{stats.overdue}</h3>
                                        </div>
                                        <div className="bg-danger bg-opacity-10 rounded p-2">
                                            <FaExclamationTriangle className="text-danger" size={20} />
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col xl={2} lg={3} md={6}>
                            <Card className={`shadow-sm border-0 h-100 ${stats.openErrors > 0 ? 'border-warning' : ''}`}>
                                <Card.Body className="p-3">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="text-muted mb-2" style={{ fontSize: '0.75rem' }}>Open Errors</h6>
                                            <h3 className={`fw-bold mb-0 ${stats.openErrors > 0 ? 'text-warning' : 'text-muted'}`} style={{ fontSize: '1.6rem' }}>{stats.openErrors}</h3>
                                        </div>
                                        <div className="bg-warning bg-opacity-10 rounded p-2">
                                            <FaBug className="text-warning" size={20} />
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    {/* Tabs Section */}
                    <Card className="shadow-sm border-0">
                        <Card.Header className="bg-white border-0 pt-3 px-4">
                            <div className="d-flex gap-3">
                                <button
                                    onClick={() => setActiveTab("tasks")}
                                    className={`d-flex align-items-center gap-2 px-3 py-2 border-0 bg-transparent fw-semibold rounded-top ${activeTab === "tasks" ? 'text-primary border-bottom border-primary' : 'text-secondary'}`}
                                    style={{ fontSize: '0.9rem' }}
                                >
                                    <FaTasks size={16} />
                                    Tasks
                                    <Badge bg={activeTab === "tasks" ? 'primary' : 'secondary'} className="ms-1" style={{ fontSize: '0.7rem' }}>{stats.total}</Badge>
                                </button>
                                <button
                                    onClick={() => setActiveTab("errors")}
                                    className={`d-flex align-items-center gap-2 px-3 py-2 border-0 bg-transparent fw-semibold rounded-top ${activeTab === "errors" ? 'text-primary border-bottom border-primary' : 'text-secondary'}`}
                                    style={{ fontSize: '0.9rem' }}
                                >
                                    <FaBug size={16} />
                                    Error Tickets
                                    <Badge bg={activeTab === "errors" ? 'warning' : 'secondary'} className="ms-1" style={{ fontSize: '0.7rem' }}>{stats.openErrors}</Badge>
                                </button>
                            </div>
                        </Card.Header>

                        <Card.Body className="p-0">
                            {/* Tasks Tab */}
                            {activeTab === "tasks" && (
                                <>
                                    <div className="p-3 border-bottom bg-light">
                                        <div className="row g-3 align-items-center">
                                            <div className="col-md-6">
                                                <InputGroup>
                                                    <Form.Control
                                                        placeholder="Search tasks by title, project..."
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
                                            </div>
                                        </div>
                                    </div>

                                    <div className="table-responsive">
                                        <Table hover className="mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th style={{ cursor: "pointer", width: "70px" }} onClick={() => handleSort("id")}>
                                                        <div className="d-flex align-items-center gap-1">
                                                            <span className="fw-semibold text-muted" style={{ fontSize: '0.75rem' }}>ID</span>
                                                            {getSortIcon("id")}
                                                        </div>
                                                    </th>
                                                    <th style={{ cursor: "pointer", minWidth: "220px" }} onClick={() => handleSort("title")}>
                                                        <div className="d-flex align-items-center gap-1">
                                                            <span className="fw-semibold text-muted" style={{ fontSize: '0.75rem' }}>Task Details</span>
                                                            {getSortIcon("title")}
                                                        </div>
                                                    </th>
                                                    <th style={{ cursor: "pointer", minWidth: "100px" }} onClick={() => handleSort("status")}>
                                                        <div className="d-flex align-items-center gap-1">
                                                            <span className="fw-semibold text-muted" style={{ fontSize: '0.75rem' }}>Status</span>
                                                            {getSortIcon("status")}
                                                        </div>
                                                    </th>
                                                    <th style={{ cursor: "pointer", minWidth: "150px" }} onClick={() => handleSort("projectName")}>
                                                        <div className="d-flex align-items-center gap-1">
                                                            <span className="fw-semibold text-muted" style={{ fontSize: '0.75rem' }}>Project</span>
                                                            {getSortIcon("projectName")}
                                                        </div>
                                                    </th>
                                                    <th style={{ cursor: "pointer", minWidth: "120px" }} onClick={() => handleSort("dueDate")}>
                                                        <div className="d-flex align-items-center gap-1">
                                                            <span className="fw-semibold text-muted" style={{ fontSize: '0.75rem' }}>Due Date</span>
                                                            {getSortIcon("dueDate")}
                                                        </div>
                                                    </th>
                                                    <th style={{ width: "100px" }} className="text-center">
                                                        <span className="fw-semibold text-muted" style={{ fontSize: '0.75rem' }}>Errors</span>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {loading ? (
                                                    <tr>
                                                        <td colSpan="6" className="text-center py-4">
                                                            <Spinner animation="border" variant="primary" size="sm" className="me-2" />
                                                            <span className="text-muted">Loading tasks...</span>
                                                        </td>
                                                    </tr>
                                                ) : tasks.length > 0 ? (
                                                    tasks.map((task) => (
                                                        <tr key={task.id} className="border-bottom">
                                                            <td className="py-2">
                                                                <span className="text-muted fw-medium" style={{ fontSize: '0.75rem' }}>#{task.id}</span>
                                                            </td>
                                                            <td className="py-2">
                                                                <div className="fw-semibold text-dark" style={{ fontSize: '0.85rem' }}>{task.title}</div>
                                                                {task.description && (
                                                                    <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                                                                        {task.description.length > 60 ? `${task.description.substring(0, 60)}...` : task.description}
                                                                    </small>
                                                                )}
                                                            </td>
                                                            <td className="py-2">
                                                                <Badge bg={getStatusBadge(task.status)} style={{ fontSize: '0.7rem', borderRadius: '6px' }}>
                                                                    {task.status}
                                                                </Badge>
                                                                {task.isOverdue && (
                                                                    <Badge bg="danger" className="ms-1" style={{ fontSize: '0.6rem' }}>Overdue</Badge>
                                                                )}
                                                            </td>
                                                            <td className="py-2">
                                                                <div className="d-flex align-items-center">
                                                                    <FaProjectDiagram className="text-primary me-2" size={12} />
                                                                    <span style={{ fontSize: '0.8rem' }}>{task.projectName || 'No Project'}</span>
                                                                </div>
                                                                {task.moduleName && (
                                                                    <small className="text-muted ms-4" style={{ fontSize: '0.7rem' }}>
                                                                        Module: {task.moduleName}
                                                                    </small>
                                                                )}
                                                            </td>
                                                            <td className="py-2">
                                                                <div className={`d-flex flex-column ${task.isOverdue ? 'text-danger' : 'text-dark'}`}>
                                                                    <span style={{ fontSize: '0.8rem' }}>{formatDate(task.dueDate || task.assignedDate)}</span>
                                                                    {task.isOverdue && (
                                                                        <small className="text-danger" style={{ fontSize: '0.65rem' }}>Overdue</small>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="py-2 text-center">
                                                                <Button
                                                                    variant="outline-warning"
                                                                    size="sm"
                                                                    className="d-flex align-items-center gap-1 px-2 py-1 mx-auto"
                                                                    onClick={() => fetchTaskErrors(task)}
                                                                    style={{ fontSize: '0.7rem', borderRadius: '6px' }}
                                                                >
                                                                    <FaBug size={11} />
                                                                    <span>View</span>
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="6" className="text-center py-4">
                                                            <div className="text-muted">
                                                                <FaTasks size={32} className="mb-2 opacity-25" />
                                                                <p className="mb-0" style={{ fontSize: '0.8rem' }}>No tasks found for {selectedEmployee.name}</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </Table>
                                    </div>

                                    {tasks.length > 0 && (
                                        <div className="p-3 border-top bg-light">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                                                    Showing {((page - 1) * size) + 1} to {Math.min(page * size, totalRecords)} of {totalRecords} tasks
                                                </span>
                                                <div className="d-flex align-items-center gap-1">
                                                    <Button variant="outline-secondary" size="sm" onClick={handlePrevious} disabled={page <= 1} className="px-2" style={{ fontSize: '0.7rem' }}>
                                                        <FaChevronLeft className="me-1" size={10} />
                                                        Prev
                                                    </Button>
                                                    <div className="d-flex gap-1 mx-1">{renderPaginationNumbers(page, totalPages, handlePageChange)}</div>
                                                    <Button variant="outline-secondary" size="sm" onClick={handleNext} disabled={page >= totalPages} className="px-2" style={{ fontSize: '0.7rem' }}>
                                                        Next
                                                        <FaChevronRight className="ms-1" size={10} />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Errors Tab */}
                            {activeTab === "errors" && (
                                <>
                                    <div className="p-3 border-bottom bg-light">
                                        <div className="row g-3 align-items-center">
                                            <div className="col-md-6">
                                                <InputGroup>
                                                    <Form.Control
                                                        placeholder="Search errors by title, project..."
                                                        value={errorSearch}
                                                        onChange={(e) => {
                                                            setErrorSearch(e.target.value);
                                                            setErrorPage(1);
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
                                                    <Form.Select value={errorSize} onChange={handleErrorSizeChange} style={{ width: '70px', fontSize: '0.8rem' }}>
                                                        {pageSizeOptions.map(option => (
                                                            <option key={option} value={option}>{option}</option>
                                                        ))}
                                                    </Form.Select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="table-responsive">
                                        <Table hover className="mb-0">
                                            <thead className="table-light">
                                                <tr>
                                                    <th style={{ cursor: "pointer", width: "70px" }} onClick={() => handleErrorSort("id")}>
                                                        <div className="d-flex align-items-center gap-1">
                                                            <span className="fw-semibold text-muted" style={{ fontSize: '0.75rem' }}>ID</span>
                                                            {getErrorSortIcon("id")}
                                                        </div>
                                                    </th>
                                                    <th style={{ cursor: "pointer", minWidth: "220px" }} onClick={() => handleErrorSort("title")}>
                                                        <div className="d-flex align-items-center gap-1">
                                                            <span className="fw-semibold text-muted" style={{ fontSize: '0.75rem' }}>Error Details</span>
                                                            {getErrorSortIcon("title")}
                                                        </div>
                                                    </th>
                                                    <th style={{ cursor: "pointer", minWidth: "100px" }} onClick={() => handleErrorSort("priority")}>
                                                        <div className="d-flex align-items-center gap-1">
                                                            <span className="fw-semibold text-muted" style={{ fontSize: '0.75rem' }}>Priority</span>
                                                            {getErrorSortIcon("priority")}
                                                        </div>
                                                    </th>
                                                    <th style={{ cursor: "pointer", minWidth: "100px" }} onClick={() => handleErrorSort("status")}>
                                                        <div className="d-flex align-items-center gap-1">
                                                            <span className="fw-semibold text-muted" style={{ fontSize: '0.75rem' }}>Status</span>
                                                            {getErrorSortIcon("status")}
                                                        </div>
                                                    </th>
                                                    <th style={{ minWidth: "150px" }}>
                                                        <div className="d-flex align-items-center gap-1">
                                                            <span className="fw-semibold text-muted" style={{ fontSize: '0.75rem' }}>Project</span>
                                                        </div>
                                                    </th>
                                                    <th style={{ width: "100px" }} className="text-center">
                                                        <span className="fw-semibold text-muted" style={{ fontSize: '0.75rem' }}>Action</span>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {errorLoading ? (
                                                    <tr>
                                                        <td colSpan="6" className="text-center py-4">
                                                            <Spinner animation="border" variant="primary" size="sm" className="me-2" />
                                                            <span className="text-muted">Loading errors...</span>
                                                        </td>
                                                    </tr>
                                                ) : paginatedErrors.length > 0 ? (
                                                    paginatedErrors.map((error) => (
                                                        <tr key={error.id} className="border-bottom">
                                                            <td className="py-2">
                                                                <span className="text-muted fw-medium" style={{ fontSize: '0.75rem' }}>#{error.id}</span>
                                                            </td>
                                                            <td className="py-2">
                                                                <div className="fw-semibold text-dark" style={{ fontSize: '0.85rem' }}>{error.title}</div>
                                                                {error.description && (
                                                                    <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                                                                        {error.description.length > 60 ? `${error.description.substring(0, 60)}...` : error.description}
                                                                    </small>
                                                                )}
                                                            </td>
                                                            <td className="py-2">
                                                                <Badge bg={error.priority === 'High' ? 'danger' : error.priority === 'Medium' ? 'warning' : 'info'} style={{ fontSize: '0.7rem', borderRadius: '6px' }}>
                                                                    {error.priority || 'Medium'}
                                                                </Badge>
                                                            </td>
                                                            <td className="py-2">
                                                                <Badge bg={errorStatusColors[error.status] || 'secondary'} style={{ fontSize: '0.7rem', borderRadius: '6px' }}>
                                                                    {error.status || 'Open'}
                                                                </Badge>
                                                            </td>
                                                            <td className="py-2">
                                                                <div className="d-flex align-items-center">
                                                                    <FaProjectDiagram className="text-primary me-2" size={12} />
                                                                    <span style={{ fontSize: '0.8rem' }}>{getProjectName(error.projectId)}</span>
                                                                </div>
                                                            </td>
                                                            <td className="py-2 text-center">
                                                                <Button
                                                                    variant="outline-primary"
                                                                    size="sm"
                                                                    className="d-flex align-items-center gap-1 px-2 py-1 mx-auto"
                                                                    onClick={() => router.push(`/errors?id=${error.id}`)}
                                                                    style={{ fontSize: '0.7rem', borderRadius: '6px' }}
                                                                >
                                                                    <FaExternalLinkAlt size={10} />
                                                                    <span>View</span>
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="6" className="text-center py-4">
                                                            <div className="text-muted">
                                                                <FaBug size={32} className="mb-2 opacity-25" />
                                                                <p className="mb-0" style={{ fontSize: '0.8rem' }}>No open error tickets found for {selectedEmployee.name}</p>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </Table>
                                    </div>

                                    {paginatedErrors.length > 0 && (
                                        <div className="p-3 border-top bg-light">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                                                    Showing {((errorPage - 1) * errorSize) + 1} to {Math.min(errorPage * errorSize, errorTotalRecords)} of {errorTotalRecords} errors
                                                </span>
                                                <div className="d-flex align-items-center gap-1">
                                                    <Button variant="outline-secondary" size="sm" onClick={handleErrorPrevious} disabled={errorPage <= 1} className="px-2" style={{ fontSize: '0.7rem' }}>
                                                        <FaChevronLeft className="me-1" size={10} />
                                                        Prev
                                                    </Button>
                                                    <div className="d-flex gap-1 mx-1">{renderPaginationNumbers(errorPage, errorTotalPages, handleErrorPageChange)}</div>
                                                    <Button variant="outline-secondary" size="sm" onClick={handleErrorNext} disabled={errorPage >= errorTotalPages} className="px-2" style={{ fontSize: '0.7rem' }}>
                                                        Next
                                                        <FaChevronRight className="ms-1" size={10} />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </Card.Body>
                    </Card>
                </>
            )}

            {/* Task Errors Modal */}
            <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)} centered size="lg">
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-semibold" style={{ fontSize: '1rem' }}>
                        <FaBug className="me-2 text-warning" />
                        Related Errors for Task
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedTask && (
                        <>
                            <div className="bg-light p-3 rounded mb-3">
                                <h6 className="fw-bold mb-2">{selectedTask.title}</h6>
                                <div className="d-flex gap-2">
                                    <Badge bg={getStatusBadge(selectedTask.status)} style={{ fontSize: '0.7rem' }}>{selectedTask.status}</Badge>
                                    <Badge bg="primary" style={{ fontSize: '0.7rem' }}>{selectedTask.projectName}</Badge>
                                    {selectedTask.moduleName && <Badge bg="secondary" style={{ fontSize: '0.7rem' }}>{selectedTask.moduleName}</Badge>}
                                </div>
                            </div>
                            
                            {taskErrors.length > 0 ? (
                                <div className="table-responsive">
                                    <Table size="sm" hover>
                                        <thead className="table-light">
                                            <tr>
                                                <th>ID</th>
                                                <th>Error Title</th>
                                                <th>Priority</th>
                                                <th>Status</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {taskErrors.map((error) => (
                                                <tr key={error.id}>
                                                    <td className="text-muted">#{error.id}</td>
                                                    <td>
                                                        <div className="fw-semibold">{error.title}</div>
                                                        <small className="text-muted">{error.description?.substring(0, 50)}</small>
                                                    </td>
                                                    <td>
                                                        <Badge bg={error.priority === 'High' ? 'danger' : error.priority === 'Medium' ? 'warning' : 'info'} style={{ fontSize: '0.7rem' }}>
                                                            {error.priority}
                                                        </Badge>
                                                    </td>
                                                    <td>
                                                        <Badge bg={errorStatusColors[error.status] || 'secondary'} style={{ fontSize: '0.7rem' }}>
                                                            {error.status}
                                                        </Badge>
                                                    </td>
                                                    <td>
                                                        <Button
                                                            variant="outline-primary"
                                                            size="sm"
                                                            onClick={() => router.push(`/errors?id=${error.id}`)}
                                                            style={{ fontSize: '0.7rem' }}
                                                        >
                                                            <FaExternalLinkAlt size={10} className="me-1" />
                                                            View
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                </div>
                            ) : (
                                <div className="text-center py-4 text-muted">
                                    <FaCheckCircle size={40} className="mb-2 opacity-25" />
                                    <p className="mb-0">No open errors reported for this task's project/module</p>
                                </div>
                            )}
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer className="border-0">
                    <Button variant="secondary" size="sm" onClick={() => setShowErrorModal(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}