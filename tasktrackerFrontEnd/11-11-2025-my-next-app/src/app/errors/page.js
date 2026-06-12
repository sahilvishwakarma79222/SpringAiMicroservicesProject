// // "use client";
// // import React, { useEffect, useState } from "react";
// // import API from "@/services/api";
// // import {
// //     Card,
// //     Table,
// //     Button,
// //     Form,
// //     InputGroup,
// //     Modal,
// //     Spinner,
// //     Dropdown,
// //     Badge
// // } from "react-bootstrap";
// // import {
// //     FaEdit,
// //     FaEye,
// //     FaTrash,
// //     FaSort,
// //     FaSortUp,
// //     FaSortDown,
// //     FaPlus,
// //     FaSearch,
// //     FaFilter,
// //     FaChevronLeft,
// //     FaChevronRight,
// //     FaEllipsisH,
// //     FaExclamationTriangle,
// //     FaCheckCircle,
// //     FaClock
// // } from "react-icons/fa";

// // const ErrorTicketPage = () => {
// //     const [errors, setErrors] = useState([]);
// //     const [search, setSearch] = useState("");
// //     const [page, setPage] = useState(1);
// //     const [size, setSize] = useState(5);
// //     const [totalPages, setTotalPages] = useState(1);
// //     const [totalRecords, setTotalRecords] = useState(0);
// //     const [loading, setLoading] = useState(false);

// //     // Sorting State
// //     const [sortBy, setSortBy] = useState("id");
// //     const [sortDir, setSortDir] = useState("desc");

// //     // Modal States
// //     const [showModal, setShowModal] = useState(false);
// //     const [showViewModal, setShowViewModal] = useState(false);
// //     const [showDeleteModal, setShowDeleteModal] = useState(false);
// //     const [selectedError, setSelectedError] = useState(null);
// //     const [formData, setFormData] = useState({
// //         title: "",
// //         description: "",
// //         status: "Open",
// //         errordate: "",
// //         solved: "",
// //         projectId: "",
// //         priority: "Medium",
// //         clientName: ""
// //     });

// //     // Page size options
// //     const pageSizeOptions = [5, 10, 20, 50];

// //     // Priority colors
// //     const priorityColors = {
// //         "High": "danger",
// //         "Medium": "warning",
// //         "Low": "info"
// //     };

// //     // Status colors
// //     const statusColors = {
// //         "Open": "danger",
// //         "In Progress": "warning",
// //         "Resolved": "success",
// //         "Closed": "secondary"
// //     };

// //     // Status icons
// //     const statusIcons = {
// //         "Open": <FaExclamationTriangle className="me-1" />,
// //         "In Progress": <FaClock className="me-1" />,
// //         "Resolved": <FaCheckCircle className="me-1" />,
// //         "Closed": <FaCheckCircle className="me-1" />
// //     };

// //     // 🔍 Fetch Errors with Pagination + Search + Sorting
// //     const fetchErrors = async () => {
// //         setLoading(true);
// //         try {
// //             const res = await API.get(
// //                 `/errors/smart?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}&search=${search}`
// //             );
// //             setErrors(res.data.results || []);
// //             setTotalPages(res.data.totalPages || 1);
// //             setTotalRecords(res.data.totalRecords || 0);
// //         } catch (error) {
// //             console.error("Error fetching errors:", error);
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     useEffect(() => {
// //         fetchErrors();
// //     }, [page, size, search, sortBy, sortDir]);

// //     // 🧾 Handle Input
// //     const handleChange = (e) => {
// //         setFormData({ ...formData, [e.target.name]: e.target.value });
// //     };

// //     // 💾 Save Error
// //     const handleSave = async () => {
// //         try {
// //             // Format date to YYYY-MM-DD
// //             const formattedData = {
// //                 ...formData,
// //                 errordate: formData.errordate || new Date().toISOString().split('T')[0],
// //                 projectId: formData.projectId ? parseInt(formData.projectId) : null,
// //                 solved: formData.solved || null
// //             };

// //             await API.post("/errors/save", formattedData);
// //             setShowModal(false);
// //             setFormData({
// //                 title: "",
// //                 description: "",
// //                 status: "Open",
// //                 errordate: "",
// //                 solved: "",
// //                 projectId: "",
// //                 priority: "Medium",
// //                 clientName: ""
// //             });
// //             fetchErrors();
// //         } catch (error) {
// //             console.error("Error saving error ticket:", error);
// //         }
// //     };

// //     // ✏️ Update Error
// //     const handleUpdate = async () => {
// //         try {
// //             const formattedData = {
// //                 ...formData,
// //                 projectId: formData.projectId ? parseInt(formData.projectId) : null,
// //                 solved: formData.solved || null
// //             };

// //             await API.put(`/errors/update/${selectedError.id}`, formattedData);
// //             setShowModal(false);
// //             setFormData({
// //                 title: "",
// //                 description: "",
// //                 status: "Open",
// //                 errordate: "",
// //                 solved: "",
// //                 projectId: "",
// //                 priority: "Medium",
// //                 clientName: ""
// //             });
// //             setSelectedError(null);
// //             fetchErrors();
// //         } catch (error) {
// //             console.error("Error updating error ticket:", error);
// //         }
// //     };

// //     // 🗑️ Delete Error
// //     const handleDelete = async () => {
// //         try {
// //             await API.delete(`/errors/delete/${selectedError.id}`);
// //             setShowDeleteModal(false);
// //             setSelectedError(null);
// //             fetchErrors();
// //         } catch (error) {
// //             console.error("Error deleting error ticket:", error);
// //         }
// //     };

// //     // 🔄 Sort Handling
// //     const handleSort = (column) => {
// //         if (sortBy === column) {
// //             setSortDir(sortDir === "asc" ? "desc" : "asc");
// //         } else {
// //             setSortBy(column);
// //             setSortDir("asc");
// //         }
// //         setPage(1);
// //     };

// //     // ➕ Add New Error
// //     const handleAddNew = () => {
// //         setFormData({
// //             title: "",
// //             description: "",
// //             status: "Open",
// //             errordate: new Date().toISOString().split('T')[0],
// //             solved: "",
// //             projectId: "",
// //             priority: "Medium",
// //             clientName: ""
// //         });
// //         setSelectedError(null);
// //         setShowModal(true);
// //     };

// //     // ✏️ Edit Error
// //     const handleEdit = (error) => {
// //         setSelectedError(error);
// //         setFormData({
// //             title: error.title,
// //             description: error.description,
// //             status: error.status,
// //             errordate: error.errordate,
// //             solved: error.solved || "",
// //             projectId: error.projectId || "",
// //             priority: error.priority,
// //             clientName: error.clientName
// //         });
// //         setShowModal(true);
// //     };

// //     // 👁️ View Error
// //     const handleView = (error) => {
// //         setSelectedError(error);
// //         setShowViewModal(true);
// //     };

// //     // 🗑️ Confirm Delete
// //     const handleConfirmDelete = (error) => {
// //         setSelectedError(error);
// //         setShowDeleteModal(true);
// //     };

// //     // Get Sort Icon
// //     const getSortIcon = (column) => {
// //         if (sortBy !== column) return <FaSort className="ms-1 opacity-50" size={12} />;
// //         return sortDir === "asc" ? <FaSortUp className="ms-1" size={12} /> : <FaSortDown className="ms-1" size={12} />;
// //     };

// //     // Pagination Functions
// //     const handlePageChange = (newPage) => {
// //         setPage(newPage);
// //     };

// //     const handlePrevious = () => {
// //         setPage(prev => Math.max(1, prev - 1));
// //     };

// //     const handleNext = () => {
// //         setPage(prev => Math.min(totalPages, prev + 1));
// //     };

// //     const handleSizeChange = (e) => {
// //         setSize(parseInt(e.target.value));
// //         setPage(1);
// //     };

// //     // Format date for display
// //     const formatDate = (dateString) => {
// //         if (!dateString) return 'N/A';
// //         return new Date(dateString).toLocaleDateString('en-US', {
// //             year: 'numeric',
// //             month: 'short',
// //             day: 'numeric'
// //         });
// //     };

// //     // Render Pagination Numbers
// //     const renderPaginationNumbers = () => {
// //         const pages = [];
// //         const maxVisiblePages = 5;
// //         const startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
// //         const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

// //         // Previous dots
// //         if (startPage > 1) {
// //             pages.push(
// //                 <button
// //                     key={1}
// //                     className="btn btn-outline-secondary btn-sm mx-1"
// //                     onClick={() => handlePageChange(1)}
// //                     style={{ fontSize: '0.8rem' }}
// //                 >
// //                     1
// //                 </button>
// //             );
// //             if (startPage > 2) {
// //                 pages.push(<span key="dots1" className="mx-1 text-muted" style={{ fontSize: '0.8rem' }}>•••</span>);
// //             }
// //         }

// //         // Page numbers
// //         for (let i = startPage; i <= endPage; i++) {
// //             pages.push(
// //                 <button
// //                     key={i}
// //                     className={`btn btn-sm mx-1 ${page === i ? 'btn-primary' : 'btn-outline-secondary'}`}
// //                     onClick={() => handlePageChange(i)}
// //                     style={{ fontSize: '0.8rem' }}
// //                 >
// //                     {i}
// //                 </button>
// //             );
// //         }

// //         // Next dots
// //         if (endPage < totalPages) {
// //             if (endPage < totalPages - 1) {
// //                 pages.push(<span key="dots2" className="mx-1 text-muted" style={{ fontSize: '0.8rem' }}>•••</span>);
// //             }
// //             pages.push(
// //                 <button
// //                     key={totalPages}
// //                     className="btn btn-outline-secondary btn-sm mx-1"
// //                     onClick={() => handlePageChange(totalPages)}
// //                     style={{ fontSize: '0.8rem' }}
// //                 >
// //                     {totalPages}
// //                 </button>
// //             );
// //         }

// //         return pages;
// //     };

// //     return (
// //         <div className="container-fluid py-3">
// //             {/* Card Container */}
// //             <Card className="shadow-sm border-0">
// //                 {/* Card Header */}
// //                 <Card.Header className="bg-white border-0 py-3">
// //                     <div className="d-flex justify-content-between align-items-center">
// //                         <div>
// //                             <h5 className="mb-0 text-dark fw-bold" style={{ fontSize: '1.1rem' }}>Error & Ticket Management</h5>
// //                             <small className="text-muted" style={{ fontSize: '0.75rem' }}>Track and resolve issues efficiently</small>
// //                         </div>
// //                         <Button
// //                             variant="primary"
// //                             className="d-flex align-items-center gap-2 px-3"
// //                             onClick={handleAddNew}
// //                             style={{ fontSize: '0.8rem' }}
// //                         >
// //                             <FaPlus size={12} />
// //                             New Ticket
// //                         </Button>
// //                     </div>
// //                 </Card.Header>

// //                 <Card.Body className="p-0">
// //                     {/* Controls Section */}
// //                     <div className="p-3 border-bottom bg-light">
// //                         <div className="row g-3 align-items-center">
// //                             <div className="col-md-6">
// //                                 <InputGroup>
// //                                     <Form.Control
// //                                         placeholder="Search by title, description, client..."
// //                                         value={search}
// //                                         onChange={(e) => {
// //                                             setSearch(e.target.value);
// //                                             setPage(1);
// //                                         }}
// //                                         style={{ fontSize: '0.8rem' }}
// //                                     />
// //                                     <InputGroup.Text className="bg-white" style={{ fontSize: '0.8rem' }}>
// //                                         <FaSearch className="text-muted" size={12} />
// //                                     </InputGroup.Text>
// //                                 </InputGroup>
// //                             </div>
// //                             <div className="col-md-6 d-flex justify-content-end gap-3">
// //                                 <div className="d-flex align-items-center gap-2">
// //                                     <span className="text-muted" style={{ fontSize: '0.8rem' }}>Show:</span>
// //                                     <Form.Select
// //                                         value={size}
// //                                         onChange={handleSizeChange}
// //                                         style={{ width: '70px', fontSize: '0.8rem' }}
// //                                     >
// //                                         {pageSizeOptions.map(option => (
// //                                             <option key={option} value={option}>{option}</option>
// //                                         ))}
// //                                     </Form.Select>
// //                                 </div>
// //                                 <Dropdown>
// //                                     <Dropdown.Toggle variant="outline-secondary" size="sm" className="d-flex align-items-center gap-2" style={{ fontSize: '0.8rem' }}>
// //                                         <FaFilter size={10} />
// //                                         Filter
// //                                     </Dropdown.Toggle>
// //                                     <Dropdown.Menu style={{ fontSize: '0.8rem' }}>
// //                                         <Dropdown.Item>Open Tickets</Dropdown.Item>
// //                                         <Dropdown.Item>In Progress</Dropdown.Item>
// //                                         <Dropdown.Item>Resolved Tickets</Dropdown.Item>
// //                                         <Dropdown.Divider />
// //                                         <Dropdown.Item>Clear Filters</Dropdown.Item>
// //                                     </Dropdown.Menu>
// //                                 </Dropdown>
// //                             </div>
// //                         </div>
// //                     </div>

// //                     {/* Table Section */}
// //                     <div className="table-responsive">
// //                         <Table hover className="mb-0">
// //                             <thead className="table-light">
// //                                 <tr>
// //                                     <th
// //                                         style={{ cursor: "pointer", width: "70px" }}
// //                                         onClick={() => handleSort("id")}
// //                                         className="py-2"
// //                                     >
// //                                         <div className="d-flex align-items-center justify-content-between">
// //                                             <span className="fw-semibold text-muted" style={{ fontSize: '0.8rem' }}>ID</span>
// //                                             {getSortIcon("id")}
// //                                         </div>
// //                                     </th>
// //                                     <th
// //                                         style={{ cursor: "pointer", minWidth: "200px" }}
// //                                         onClick={() => handleSort("title")}
// //                                         className="py-2"
// //                                     >
// //                                         <div className="d-flex align-items-center justify-content-between">
// //                                             <span className="fw-semibold text-muted" style={{ fontSize: '0.8rem' }}>Error Title</span>
// //                                             {getSortIcon("title")}
// //                                         </div>
// //                                     </th>
// //                                     <th
// //                                         style={{ cursor: "pointer", minWidth: "120px" }}
// //                                         onClick={() => handleSort("priority")}
// //                                         className="py-2"
// //                                     >
// //                                         <div className="d-flex align-items-center justify-content-between">
// //                                             <span className="fw-semibold text-muted" style={{ fontSize: '0.8rem' }}>Priority</span>
// //                                             {getSortIcon("priority")}
// //                                         </div>
// //                                     </th>
// //                                     <th
// //                                         style={{ cursor: "pointer", minWidth: "130px" }}
// //                                         onClick={() => handleSort("status")}
// //                                         className="py-2"
// //                                     >
// //                                         <div className="d-flex align-items-center justify-content-between">
// //                                             <span className="fw-semibold text-muted" style={{ fontSize: '0.8rem' }}>Status</span>
// //                                             {getSortIcon("status")}
// //                                         </div>
// //                                     </th>
// //                                     <th
// //                                         style={{ cursor: "pointer", minWidth: "120px" }}
// //                                         onClick={() => handleSort("errordate")}
// //                                         className="py-2"
// //                                     >
// //                                         <div className="d-flex align-items-center justify-content-between">
// //                                             <span className="fw-semibold text-muted" style={{ fontSize: '0.8rem' }}>Reported Date</span>
// //                                             {getSortIcon("errordate")}
// //                                         </div>
// //                                     </th>
// //                                     <th
// //                                         style={{ cursor: "pointer", minWidth: "150px" }}
// //                                         onClick={() => handleSort("clientName")}
// //                                         className="py-2"
// //                                     >
// //                                         <div className="d-flex align-items-center justify-content-between">
// //                                             <span className="fw-semibold text-muted" style={{ fontSize: '0.8rem' }}>Client</span>
// //                                             {getSortIcon("clientName")}
// //                                         </div>
// //                                     </th>
// //                                     <th style={{ minWidth: "130px" }} className="py-2 fw-semibold text-center text-muted" style={{ fontSize: '0.8rem' }}>Actions</th>
// //                                 </tr>
// //                             </thead>
// //                             <tbody>
// //                                 {loading ? (
// //                                     <tr>
// //                                         <td colSpan="7" className="text-center py-4">
// //                                             <div className="d-flex justify-content-center align-items-center">
// //                                                 <Spinner animation="border" variant="primary" size="sm" className="me-2" />
// //                                                 <span className="text-muted" style={{ fontSize: '0.8rem' }}>Loading error tickets...</span>
// //                                             </div>
// //                                         </td>
// //                                     </tr>
// //                                 ) : errors.length > 0 ? (
// //                                     errors.map((error) => (
// //                                         <tr key={error.id} className="border-bottom">
// //                                             <td className="py-2">
// //                                                 <span className="text-muted fw-medium" style={{ fontSize: '0.8rem' }}>#{error.id}</span>
// //                                             </td>
// //                                             <td className="py-2">
// //                                                 <div>
// //                                                     <div className="fw-semibold text-dark" style={{ fontSize: '0.85rem' }}>{error.title}</div>
// //                                                     <small className="text-muted" style={{ fontSize: '0.7rem' }}>
// //                                                         {error.description && error.description.length > 50
// //                                                             ? `${error.description.substring(0, 50)}...`
// //                                                             : error.description}
// //                                                     </small>
// //                                                 </div>
// //                                             </td>
// //                                             <td className="py-2">
// //                                                 <Badge
// //                                                     bg={priorityColors[error.priority] || "secondary"}
// //                                                     className="px-2 py-1"
// //                                                     style={{ fontWeight: '500', fontSize: '0.75rem' }}
// //                                                 >
// //                                                     {error.priority}
// //                                                 </Badge>
// //                                             </td>
// //                                             <td className="py-2">
// //                                                 <Badge
// //                                                     bg={statusColors[error.status] || "secondary"}
// //                                                     className="d-flex align-items-center px-2 py-1"
// //                                                     style={{ fontWeight: '500', fontSize: '0.75rem', width: 'fit-content' }}
// //                                                 >
// //                                                     {statusIcons[error.status]}
// //                                                     {error.status}
// //                                                 </Badge>
// //                                             </td>
// //                                             <td className="py-2">
// //                                                 <span className="text-dark" style={{ fontSize: '0.8rem' }}>
// //                                                     {formatDate(error.errordate)}
// //                                                 </span>
// //                                             </td>
// //                                             <td className="py-2">
// //                                                 <span className="text-dark" style={{ fontSize: '0.8rem' }}>
// //                                                     {error.clientName || 'N/A'}
// //                                                 </span>
// //                                             </td>
// //                                             <td className="py-2">
// //                                                 <div className="d-flex justify-content-center gap-1">
// //                                                     <Button
// //                                                         variant="outline-primary"
// //                                                         size="sm"
// //                                                         className="d-flex align-items-center px-2"
// //                                                         onClick={() => handleView(error)}
// //                                                         title="View Details"
// //                                                         style={{ fontSize: '0.7rem' }}
// //                                                     >
// //                                                         <FaEye size={10} className="me-1" />
// //                                                         View
// //                                                     </Button>
// //                                                     <Button
// //                                                         variant="outline-warning"
// //                                                         size="sm"
// //                                                         className="d-flex align-items-center px-2"
// //                                                         onClick={() => handleEdit(error)}
// //                                                         title="Edit"
// //                                                         style={{ fontSize: '0.7rem' }}
// //                                                     >
// //                                                         <FaEdit size={10} className="me-1" />
// //                                                         Edit
// //                                                     </Button>
// //                                                     <Dropdown>
// //                                                         <Dropdown.Toggle
// //                                                             variant="outline-secondary"
// //                                                             size="sm"
// //                                                             className="d-flex align-items-center px-1"
// //                                                             style={{ fontSize: '0.7rem' }}
// //                                                         >
// //                                                             <FaEllipsisH size={10} />
// //                                                         </Dropdown.Toggle>
// //                                                         <Dropdown.Menu style={{ fontSize: '0.8rem' }}>
// //                                                             <Dropdown.Item onClick={() => handleView(error)} style={{ fontSize: '0.8rem' }}>
// //                                                                 <FaEye className="me-2 text-primary" size={10} />
// //                                                                 View Details
// //                                                             </Dropdown.Item>
// //                                                             <Dropdown.Item onClick={() => handleEdit(error)} style={{ fontSize: '0.8rem' }}>
// //                                                                 <FaEdit className="me-2 text-warning" size={10} />
// //                                                                 Edit Ticket
// //                                                             </Dropdown.Item>
// //                                                             <Dropdown.Divider />
// //                                                             <Dropdown.Item className="text-danger" onClick={() => handleConfirmDelete(error)} style={{ fontSize: '0.8rem' }}>
// //                                                                 <FaTrash className="me-2" size={10} />
// //                                                                 Delete
// //                                                             </Dropdown.Item>
// //                                                         </Dropdown.Menu>
// //                                                     </Dropdown>
// //                                                 </div>
// //                                             </td>
// //                                         </tr>
// //                                     ))
// //                                 ) : (
// //                                     <tr>
// //                                         <td colSpan="7" className="text-center py-4">
// //                                             <div className="text-muted">
// //                                                 <FaSearch size={32} className="mb-2 opacity-25" />
// //                                                 <h6 className="mb-2" style={{ fontSize: '0.9rem' }}>No error tickets found</h6>
// //                                                 <p className="mb-0" style={{ fontSize: '0.8rem' }}>
// //                                                     {search ? 'Try adjusting your search terms' : 'Get started by creating your first error ticket'}
// //                                                 </p>
// //                                             </div>
// //                                         </td>
// //                                     </tr>
// //                                 )}
// //                             </tbody>
// //                         </Table>
// //                     </div>

// //                     {/* Pagination Section */}
// //                     {errors.length > 0 && (
// //                         <div className="p-2 border-top bg-light">
// //                             <div className="d-flex justify-content-between align-items-center">
// //                                 <div>
// //                                     <span className="text-muted" style={{ fontSize: '0.75rem' }}>
// //                                         Showing <strong>{((page - 1) * size) + 1}-{Math.min(page * size, totalRecords)}</strong> of <strong>{totalRecords}</strong> tickets
// //                                     </span>
// //                                 </div>

// //                                 <div className="d-flex align-items-center gap-1">
// //                                     <Button
// //                                         variant="outline-secondary"
// //                                         size="sm"
// //                                         onClick={handlePrevious}
// //                                         disabled={page <= 1}
// //                                         className="d-flex align-items-center px-2"
// //                                         style={{ fontSize: '0.7rem' }}
// //                                     >
// //                                         <FaChevronLeft size={10} className="me-1" />
// //                                         Prev
// //                                     </Button>

// //                                     <div className="d-flex gap-1 mx-1">
// //                                         {renderPaginationNumbers()}
// //                                     </div>

// //                                     <Button
// //                                         variant="outline-secondary"
// //                                         size="sm"
// //                                         onClick={handleNext}
// //                                         disabled={page >= totalPages}
// //                                         className="d-flex align-items-center px-2"
// //                                         style={{ fontSize: '0.7rem' }}
// //                                     >
// //                                         Next
// //                                         <FaChevronRight size={10} className="ms-1" />
// //                                     </Button>
// //                                 </div>
// //                             </div>
// //                         </div>
// //                     )}
// //                 </Card.Body>
// //             </Card>

// //             {/* Modals */}
// //             <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
// //                 <Modal.Header closeButton>
// //                     <Modal.Title style={{ fontSize: '1rem' }}>
// //                         {selectedError ? "Edit Error Ticket" : "Create New Error Ticket"}
// //                     </Modal.Title>
// //                 </Modal.Header>
// //                 <Modal.Body>
// //                     <Form>
// //                         <div className="row">
// //                             <div className="col-md-6">
// //                                 <Form.Group className="mb-3">
// //                                     <Form.Label style={{ fontSize: '0.85rem' }}>Title <span className="text-danger">*</span></Form.Label>
// //                                     <Form.Control
// //                                         name="title"
// //                                         value={formData.title}
// //                                         onChange={handleChange}
// //                                         placeholder="Enter error title"
// //                                         style={{ fontSize: '0.85rem' }}
// //                                     />
// //                                 </Form.Group>
// //                             </div>
// //                             <div className="col-md-6">
// //                                 <Form.Group className="mb-3">
// //                                     <Form.Label style={{ fontSize: '0.85rem' }}>Priority <span className="text-danger">*</span></Form.Label>
// //                                     <Form.Select
// //                                         name="priority"
// //                                         value={formData.priority}
// //                                         onChange={handleChange}
// //                                         style={{ fontSize: '0.85rem' }}
// //                                     >
// //                                         <option value="High">High</option>
// //                                         <option value="Medium">Medium</option>
// //                                         <option value="Low">Low</option>
// //                                     </Form.Select>
// //                                 </Form.Group>
// //                             </div>
// //                         </div>

// //                         <Form.Group className="mb-3">
// //                             <Form.Label style={{ fontSize: '0.85rem' }}>Description <span className="text-danger">*</span></Form.Label>
// //                             <Form.Control
// //                                 as="textarea"
// //                                 rows={3}
// //                                 name="description"
// //                                 value={formData.description}
// //                                 onChange={handleChange}
// //                                 placeholder="Describe the error in detail..."
// //                                 style={{ fontSize: '0.85rem' }}
// //                             />
// //                         </Form.Group>

// //                         <div className="row">
// //                             <div className="col-md-6">
// //                                 <Form.Group className="mb-3">
// //                                     <Form.Label style={{ fontSize: '0.85rem' }}>Status</Form.Label>
// //                                     <Form.Select
// //                                         name="status"
// //                                         value={formData.status}
// //                                         onChange={handleChange}
// //                                         style={{ fontSize: '0.85rem' }}
// //                                     >
// //                                         <option value="Open">Open</option>
// //                                         <option value="In Progress">In Progress</option>
// //                                         <option value="Resolved">Resolved</option>
// //                                         <option value="Closed">Closed</option>
// //                                     </Form.Select>
// //                                 </Form.Group>
// //                             </div>
// //                             <div className="col-md-6">
// //                                 <Form.Group className="mb-3">
// //                                     <Form.Label style={{ fontSize: '0.85rem' }}>Error Date</Form.Label>
// //                                     <Form.Control
// //                                         type="date"
// //                                         name="errordate"
// //                                         value={formData.errordate}
// //                                         onChange={handleChange}
// //                                         style={{ fontSize: '0.85rem' }}
// //                                     />
// //                                 </Form.Group>
// //                             </div>
// //                         </div>

// //                         <div className="row">
// //                             <div className="col-md-6">
// //                                 <Form.Group className="mb-3">
// //                                     <Form.Label style={{ fontSize: '0.85rem' }}>Solved Date</Form.Label>
// //                                     <Form.Control
// //                                         type="date"
// //                                         name="solved"
// //                                         value={formData.solved}
// //                                         onChange={handleChange}
// //                                         style={{ fontSize: '0.85rem' }}
// //                                     />
// //                                 </Form.Group>
// //                             </div>
// //                             <div className="col-md-6">
// //                                 <Form.Group className="mb-3">
// //                                     <Form.Label style={{ fontSize: '0.85rem' }}>Project ID</Form.Label>
// //                                     <Form.Control
// //                                         type="number"
// //                                         name="projectId"
// //                                         value={formData.projectId}
// //                                         onChange={handleChange}
// //                                         placeholder="Enter project ID"
// //                                         style={{ fontSize: '0.85rem' }}
// //                                     />
// //                                 </Form.Group>
// //                             </div>
// //                         </div>

// //                         <Form.Group className="mb-3">
// //                             <Form.Label style={{ fontSize: '0.85rem' }}>Client Name</Form.Label>
// //                             <Form.Control
// //                                 name="clientName"
// //                                 value={formData.clientName}
// //                                 onChange={handleChange}
// //                                 placeholder="Enter client name"
// //                                 style={{ fontSize: '0.85rem' }}
// //                             />
// //                         </Form.Group>
// //                     </Form>
// //                 </Modal.Body>
// //                 <Modal.Footer>
// //                     <Button variant="outline-secondary" onClick={() => setShowModal(false)} style={{ fontSize: '0.8rem' }}>
// //                         Cancel
// //                     </Button>
// //                     <Button
// //                         variant="primary"
// //                         onClick={selectedError ? handleUpdate : handleSave}
// //                         style={{ fontSize: '0.8rem' }}
// //                     >
// //                         {selectedError ? "Update Ticket" : "Create Ticket"}
// //                     </Button>
// //                 </Modal.Footer>
// //             </Modal>

// //             <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered size="lg">
// //                 <Modal.Header closeButton>
// //                     <Modal.Title style={{ fontSize: '1rem' }}>Error Ticket Details</Modal.Title>
// //                 </Modal.Header>
// //                 <Modal.Body>
// //                     {selectedError && (
// //                         <div>
// //                             <div className="d-flex justify-content-between align-items-start mb-3">
// //                                 <div>
// //                                     <h5 className="mb-1" style={{ fontSize: '1rem' }}>{selectedError.title}</h5>
// //                                     <div className="d-flex gap-2 mt-2">
// //                                         <Badge bg={priorityColors[selectedError.priority]} style={{ fontSize: '0.75rem' }}>
// //                                             {selectedError.priority} Priority
// //                                         </Badge>
// //                                         <Badge bg={statusColors[selectedError.status]} style={{ fontSize: '0.75rem' }}>
// //                                             {statusIcons[selectedError.status]}
// //                                             {selectedError.status}
// //                                         </Badge>
// //                                     </div>
// //                                 </div>
// //                                 <span className="text-muted" style={{ fontSize: '0.8rem' }}>#{selectedError.id}</span>
// //                             </div>

// //                             <div className="row">
// //                                 <div className="col-md-6">
// //                                     <div className="mb-3">
// //                                         <strong style={{ fontSize: '0.85rem' }}>Description:</strong>
// //                                         <p className="mb-0 mt-1" style={{ fontSize: '0.8rem' }}>{selectedError.description}</p>
// //                                     </div>
// //                                 </div>
// //                                 <div className="col-md-6">
// //                                     <div className="mb-2" style={{ fontSize: '0.85rem' }}>
// //                                         <strong>Client:</strong> {selectedError.clientName || 'N/A'}
// //                                     </div>
// //                                     <div className="mb-2" style={{ fontSize: '0.85rem' }}>
// //                                         <strong>Project ID:</strong> {selectedError.projectId || 'N/A'}
// //                                     </div>
// //                                     <div className="mb-2" style={{ fontSize: '0.85rem' }}>
// //                                         <strong>Reported Date:</strong> {formatDate(selectedError.errordate)}
// //                                     </div>
// //                                     {selectedError.solved && (
// //                                         <div className="mb-2" style={{ fontSize: '0.85rem' }}>
// //                                             <strong>Solved Date:</strong> {formatDate(selectedError.solved)}
// //                                         </div>
// //                                     )}
// //                                 </div>
// //                             </div>
// //                         </div>
// //                     )}
// //                 </Modal.Body>
// //                 <Modal.Footer>
// //                     <Button variant="outline-secondary" onClick={() => setShowViewModal(false)} style={{ fontSize: '0.8rem' }}>
// //                         Close
// //                     </Button>
// //                 </Modal.Footer>
// //             </Modal>

// //             <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
// //                 <Modal.Header closeButton>
// //                     <Modal.Title style={{ fontSize: '1rem' }}>Delete Error Ticket</Modal.Title>
// //                 </Modal.Header>
// //                 <Modal.Body>
// //                     {selectedError && (
// //                         <div className="text-center">
// //                             <div className="mb-3">
// //                                 <FaExclamationTriangle size={40} className="text-danger mb-2" />
// //                                 <h6 className="mb-1" style={{ fontSize: '0.9rem' }}>{selectedError.title}</h6>
// //                                 <small className="text-muted" style={{ fontSize: '0.8rem' }}>
// //                                     Priority: {selectedError.priority} | Status: {selectedError.status}
// //                                 </small>
// //                             </div>
// //                             <p className="mb-0" style={{ fontSize: '0.85rem' }}>
// //                                 Are you sure you want to delete error ticket <strong>#{selectedError.id}</strong>?
// //                                 This action cannot be undone.
// //                             </p>
// //                         </div>
// //                     )}
// //                 </Modal.Body>
// //                 <Modal.Footer>
// //                     <Button variant="outline-secondary" onClick={() => setShowDeleteModal(false)} style={{ fontSize: '0.8rem' }}>
// //                         Cancel
// //                     </Button>
// //                     <Button variant="danger" onClick={handleDelete} style={{ fontSize: '0.8rem' }}>
// //                         Delete Ticket
// //                     </Button>
// //                 </Modal.Footer>
// //             </Modal>
// //         </div>
// //     );
// // };

// // export default ErrorTicketPage;


// "use client";
// import React, { useEffect, useState } from "react";
// import API from "@/services/api";
// import {
//     Card,
//     Table,
//     Button,
//     Form,
//     InputGroup,
//     Modal,
//     Spinner,
//     Dropdown,
//     Badge
// } from "react-bootstrap";
// import {
//     FaEdit,
//     FaEye,
//     FaTrash,
//     FaSort,
//     FaSortUp,
//     FaSortDown,
//     FaPlus,
//     FaSearch,
//     FaFilter,
//     FaChevronLeft,
//     FaChevronRight,
//     FaEllipsisH,
//     FaExclamationTriangle,
//     FaCheckCircle,
//     FaClock
// } from "react-icons/fa";

// const ErrorTicketPage = () => {
//     const [errors, setErrors] = useState([]);
//     const [projects, setProjects] = useState([]);
//     const [modules, setModules] = useState([]);
//     const [employees, setEmployees] = useState([]);
//     const [search, setSearch] = useState("");
//     const [page, setPage] = useState(1);
//     const [size, setSize] = useState(5);
//     const [totalPages, setTotalPages] = useState(1);
//     const [totalRecords, setTotalRecords] = useState(0);
//     const [loading, setLoading] = useState(false);
//     const [projectsLoading, setProjectsLoading] = useState(false);
//     const [modulesLoading, setModulesLoading] = useState(false);
//     const [employeesLoading, setEmployeesLoading] = useState(false);

//     // Sorting State
//     const [sortBy, setSortBy] = useState("id");
//     const [sortDir, setSortDir] = useState("desc");

//     // Modal States
//     const [showModal, setShowModal] = useState(false);
//     const [showViewModal, setShowViewModal] = useState(false);
//     const [showDeleteModal, setShowDeleteModal] = useState(false);
//     const [selectedError, setSelectedError] = useState(null);
//     const [formData, setFormData] = useState({
//         title: "",
//         description: "",
//         status: "Open",
//         priority: "Medium",
//         clientName: "",
//         projectId: "",
//         moduleId: "",
//         reportedBy: "",
//         errorDate: "",
//         solvedDate: ""
//     });

//     // Page size options
//     const pageSizeOptions = [5, 10, 20, 50];

//     // Priority colors
//     const priorityColors = {
//         "High": "danger",
//         "Medium": "warning",
//         "Low": "info"
//     };

//     // Status colors
//     const statusColors = {
//         "Open": "danger",
//         "In Progress": "warning",
//         "Resolved": "success",
//         "Closed": "secondary"
//     };

//     // Status icons
//     const statusIcons = {
//         "Open": <FaExclamationTriangle className="me-1" />,
//         "In Progress": <FaClock className="me-1" />,
//         "Resolved": <FaCheckCircle className="me-1" />,
//         "Closed": <FaCheckCircle className="me-1" />
//     };

//     // 🔍 Fetch Errors with Pagination + Search + Sorting
//     const fetchErrors = async () => {
//         setLoading(true);
//         try {
//             const res = await API.get(
//                 `/errors/smart?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}&search=${search}`
//             );
//             setErrors(res.data.results || []);
//             setTotalPages(res.data.totalPages || 1);
//             setTotalRecords(res.data.totalRecords || 0);
//         } catch (error) {
//             console.error("Error fetching errors:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // 🏗️ Fetch Projects for Dropdown
//     const fetchProjects = async () => {
//         setProjectsLoading(true);
//         try {
//             const res = await API.get('/project/smart?page=1&size=100');
//             setProjects(res.data.results || res.data || []);
//         } catch (error) {
//             console.error("Error fetching projects:", error);
//         } finally {
//             setProjectsLoading(false);
//         }
//     };

//     // 🏗️ Fetch Modules for Dropdown
//     const fetchModules = async () => {
//         setModulesLoading(true);
//         try {
//             const res = await API.get('/modules/smart?page=1&size=100');
//             setModules(res.data.results || res.data || []);
//         } catch (error) {
//             console.error("Error fetching modules:", error);
//         } finally {
//             setModulesLoading(false);
//         }
//     };

//     // 👥 Fetch Employees for Dropdown
//     const fetchEmployees = async () => {
//         setEmployeesLoading(true);
//         try {
//             const res = await API.get('/employee/smart?page=1&size=100');
//             setEmployees(res.data.results || res.data || []);
//         } catch (error) {
//             console.error("Error fetching employees:", error);
//         } finally {
//             setEmployeesLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchErrors();
//         fetchProjects();
//         fetchModules();
//         fetchEmployees();
//     }, [page, size, search, sortBy, sortDir]);

//     // 🧾 Handle Input
//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     // 💾 Save Error
//     const handleSave = async () => {
//         try {
//             const formattedData = {
//                 title: formData.title,
//                 description: formData.description,
//                 status: formData.status,
//                 priority: formData.priority,
//                 clientName: formData.clientName,
//                 projectId: formData.projectId ? parseInt(formData.projectId) : null,
//                 moduleId: formData.moduleId ? parseInt(formData.moduleId) : null,
//                 reportedBy: formData.reportedBy ? parseInt(formData.reportedBy) : null,
//                 errorDate: formData.errorDate || new Date().toISOString().split('T')[0],
//                 solvedDate: formData.solvedDate || null
//             };

//             await API.post("/errors/save", formattedData);
//             setShowModal(false);
//             setFormData({
//                 title: "",
//                 description: "",
//                 status: "Open",
//                 priority: "Medium",
//                 clientName: "",
//                 projectId: "",
//                 moduleId: "",
//                 reportedBy: "",
//                 errorDate: "",
//                 solvedDate: ""
//             });
//             fetchErrors();
//         } catch (error) {
//             console.error("Error saving error ticket:", error);
//         }
//     };

//     // ✏️ Update Error
//     const handleUpdate = async () => {
//         try {
//             const formattedData = {
//                 title: formData.title,
//                 description: formData.description,
//                 status: formData.status,
//                 priority: formData.priority,
//                 clientName: formData.clientName,
//                 projectId: formData.projectId ? parseInt(formData.projectId) : null,
//                 moduleId: formData.moduleId ? parseInt(formData.moduleId) : null,
//                 reportedBy: formData.reportedBy ? parseInt(formData.reportedBy) : null,
//                 errorDate: formData.errorDate,
//                 solvedDate: formData.solvedDate || null
//             };

//             await API.put(`/errors/update/${selectedError.id}`, formattedData);
//             setShowModal(false);
//             setFormData({
//                 title: "",
//                 description: "",
//                 status: "Open",
//                 priority: "Medium",
//                 clientName: "",
//                 projectId: "",
//                 moduleId: "",
//                 reportedBy: "",
//                 errorDate: "",
//                 solvedDate: ""
//             });
//             setSelectedError(null);
//             fetchErrors();
//         } catch (error) {
//             console.error("Error updating error ticket:", error);
//         }
//     };

//     // 🗑️ Delete Error
//     const handleDelete = async () => {
//         try {
//             await API.delete(`/errors/delete/${selectedError.id}`);
//             setShowDeleteModal(false);
//             setSelectedError(null);
//             fetchErrors();
//         } catch (error) {
//             console.error("Error deleting error ticket:", error);
//         }
//     };

//     // 🔄 Sort Handling
//     const handleSort = (column) => {
//         if (sortBy === column) {
//             setSortDir(sortDir === "asc" ? "desc" : "asc");
//         } else {
//             setSortBy(column);
//             setSortDir("asc");
//         }
//         setPage(1);
//     };

//     // ➕ Add New Error
//     const handleAddNew = () => {
//         setFormData({
//             title: "",
//             description: "",
//             status: "Open",
//             priority: "Medium",
//             clientName: "",
//             projectId: "",
//             moduleId: "",
//             reportedBy: "",
//             errorDate: new Date().toISOString().split('T')[0],
//             solvedDate: ""
//         });
//         setSelectedError(null);
//         setShowModal(true);
//     };

//     // ✏️ Edit Error
//     const handleEdit = (error) => {
//         setSelectedError(error);
//         setFormData({
//             title: error.title,
//             description: error.description,
//             status: error.status,
//             priority: error.priority,
//             clientName: error.clientName,
//             projectId: error.projectId || "",
//             moduleId: error.moduleId || "",
//             reportedBy: error.reportedBy || "",
//             errorDate: error.errorDate || error.errordate || "",
//             solvedDate: error.solvedDate || error.solved || ""
//         });
//         setShowModal(true);
//     };

//     // 👁️ View Error
//     const handleView = (error) => {
//         setSelectedError(error);
//         setShowViewModal(true);
//     };

//     // 🗑️ Confirm Delete
//     const handleConfirmDelete = (error) => {
//         setSelectedError(error);
//         setShowDeleteModal(true);
//     };

//     // Get Sort Icon
//     const getSortIcon = (column) => {
//         if (sortBy !== column) return <FaSort className="ms-1 opacity-50" size={12} />;
//         return sortDir === "asc" ? <FaSortUp className="ms-1" size={12} /> : <FaSortDown className="ms-1" size={12} />;
//     };

//     // Pagination Functions
//     const handlePageChange = (newPage) => {
//         setPage(newPage);
//     };

//     const handlePrevious = () => {
//         setPage(prev => Math.max(1, prev - 1));
//     };

//     const handleNext = () => {
//         setPage(prev => Math.min(totalPages, prev + 1));
//     };

//     const handleSizeChange = (e) => {
//         setSize(parseInt(e.target.value));
//         setPage(1);
//     };

//     // Format date for display
//     const formatDate = (dateString) => {
//         if (!dateString) return 'N/A';
//         return new Date(dateString).toLocaleDateString('en-US', {
//             year: 'numeric',
//             month: 'short',
//             day: 'numeric'
//         });
//     };

//     // Get project name by ID
//     const getProjectName = (projectId) => {
//         if (!projectId) return 'N/A';
//         const project = projects.find(p => p.id === projectId);
//         return project ? project.name : `Project #${projectId}`;
//     };

//     // Get module name by ID
//     const getModuleName = (moduleId) => {
//         if (!moduleId) return 'N/A';
//         const module = modules.find(m => m.id === moduleId);
//         return module ? module.name : `Module #${moduleId}`;
//     };

//     // Get employee name by ID
//     const getEmployeeName = (employeeId) => {
//         if (!employeeId) return 'N/A';
//         const employee = employees.find(e => e.id === employeeId);
//         return employee ? employee.name : `Employee #${employeeId}`;
//     };

//     // Render Pagination Numbers
//     const renderPaginationNumbers = () => {
//         const pages = [];
//         const maxVisiblePages = 5;
//         const startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
//         const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

//         // Previous dots
//         if (startPage > 1) {
//             pages.push(
//                 <button
//                     key={1}
//                     className="btn btn-outline-secondary btn-sm mx-1"
//                     onClick={() => handlePageChange(1)}
//                     style={{ fontSize: '0.8rem' }}
//                 >
//                     1
//                 </button>
//             );
//             if (startPage > 2) {
//                 pages.push(<span key="dots1" className="mx-1 text-muted" style={{ fontSize: '0.8rem' }}>•••</span>);
//             }
//         }

//         // Page numbers
//         for (let i = startPage; i <= endPage; i++) {
//             pages.push(
//                 <button
//                     key={i}
//                     className={`btn btn-sm mx-1 ${page === i ? 'btn-primary' : 'btn-outline-secondary'}`}
//                     onClick={() => handlePageChange(i)}
//                     style={{ fontSize: '0.8rem' }}
//                 >
//                     {i}
//                 </button>
//             );
//         }

//         // Next dots
//         if (endPage < totalPages) {
//             if (endPage < totalPages - 1) {
//                 pages.push(<span key="dots2" className="mx-1 text-muted" style={{ fontSize: '0.8rem' }}>•••</span>);
//             }
//             pages.push(
//                 <button
//                     key={totalPages}
//                     className="btn btn-outline-secondary btn-sm mx-1"
//                     onClick={() => handlePageChange(totalPages)}
//                     style={{ fontSize: '0.8rem' }}
//                 >
//                     {totalPages}
//                 </button>
//             );
//         }

//         return pages;
//     };

//     return (
//         <div className="container-fluid py-3">
//             {/* Card Container */}
//             <Card className="shadow-sm border-0">
//                 {/* Card Header */}
//                 <Card.Header className="bg-white border-0 py-3">
//                     <div className="d-flex justify-content-between align-items-center">
//                         <div>
//                             <h5 className="mb-0 text-dark fw-bold" style={{ fontSize: '1.1rem' }}>Error & Ticket Management</h5>
//                             <small className="text-muted" style={{ fontSize: '0.75rem' }}>Track and resolve issues efficiently</small>
//                         </div>
//                         <Button
//                             variant="primary"
//                             className="d-flex align-items-center gap-2 px-3"
//                             onClick={handleAddNew}
//                             style={{ fontSize: '0.8rem' }}
//                         >
//                             <FaPlus size={12} />
//                             New Ticket
//                         </Button>
//                     </div>
//                 </Card.Header>

//                 <Card.Body className="p-0">
//                     {/* Controls Section */}
//                     <div className="p-3 border-bottom bg-light">
//                         <div className="row g-3 align-items-center">
//                             <div className="col-md-6">
//                                 <InputGroup>
//                                     <Form.Control
//                                         placeholder="Search by title, description, client..."
//                                         value={search}
//                                         onChange={(e) => {
//                                             setSearch(e.target.value);
//                                             setPage(1);
//                                         }}
//                                         style={{ fontSize: '0.8rem' }}
//                                     />
//                                     <InputGroup.Text className="bg-white" style={{ fontSize: '0.8rem' }}>
//                                         <FaSearch className="text-muted" size={12} />
//                                     </InputGroup.Text>
//                                 </InputGroup>
//                             </div>
//                             <div className="col-md-6 d-flex justify-content-end gap-3">
//                                 <div className="d-flex align-items-center gap-2">
//                                     <span className="text-muted" style={{ fontSize: '0.8rem' }}>Show:</span>
//                                     <Form.Select
//                                         value={size}
//                                         onChange={handleSizeChange}
//                                         style={{ width: '70px', fontSize: '0.8rem' }}
//                                     >
//                                         {pageSizeOptions.map(option => (
//                                             <option key={option} value={option}>{option}</option>
//                                         ))}
//                                     </Form.Select>
//                                 </div>
//                                 <Dropdown>
//                                     <Dropdown.Toggle variant="outline-secondary" size="sm" className="d-flex align-items-center gap-2" style={{ fontSize: '0.8rem' }}>
//                                         <FaFilter size={10} />
//                                         Filter
//                                     </Dropdown.Toggle>
//                                     <Dropdown.Menu style={{ fontSize: '0.8rem' }}>
//                                         <Dropdown.Item>Open Tickets</Dropdown.Item>
//                                         <Dropdown.Item>In Progress</Dropdown.Item>
//                                         <Dropdown.Item>Resolved Tickets</Dropdown.Item>
//                                         <Dropdown.Divider />
//                                         <Dropdown.Item>Clear Filters</Dropdown.Item>
//                                     </Dropdown.Menu>
//                                 </Dropdown>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Table Section */}
//                     <div className="table-responsive">
//                         <Table hover className="mb-0">
//                             <thead className="table-light">
//                                 <tr>
//                                     <th
//                                         style={{ cursor: "pointer", width: "70px" }}
//                                         onClick={() => handleSort("id")}
//                                         className="py-2"
//                                     >
//                                         <div className="d-flex align-items-center justify-content-between">
//                                             <span className="fw-semibold text-muted" style={{ fontSize: '0.8rem' }}>ID</span>
//                                             {getSortIcon("id")}
//                                         </div>
//                                     </th>
//                                     <th
//                                         style={{ cursor: "pointer", minWidth: "200px" }}
//                                         onClick={() => handleSort("title")}
//                                         className="py-2"
//                                     >
//                                         <div className="d-flex align-items-center justify-content-between">
//                                             <span className="fw-semibold text-muted" style={{ fontSize: '0.8rem' }}>Error Title</span>
//                                             {getSortIcon("title")}
//                                         </div>
//                                     </th>
//                                     <th
//                                         style={{ cursor: "pointer", minWidth: "120px" }}
//                                         onClick={() => handleSort("priority")}
//                                         className="py-2"
//                                     >
//                                         <div className="d-flex align-items-center justify-content-between">
//                                             <span className="fw-semibold text-muted" style={{ fontSize: '0.8rem' }}>Priority</span>
//                                             {getSortIcon("priority")}
//                                         </div>
//                                     </th>
//                                     <th
//                                         style={{ cursor: "pointer", minWidth: "130px" }}
//                                         onClick={() => handleSort("status")}
//                                         className="py-2"
//                                     >
//                                         <div className="d-flex align-items-center justify-content-between">
//                                             <span className="fw-semibold text-muted" style={{ fontSize: '0.8rem' }}>Status</span>
//                                             {getSortIcon("status")}
//                                         </div>
//                                     </th>
//                                     <th
//                                         style={{ cursor: "pointer", minWidth: "150px" }}
//                                         onClick={() => handleSort("projectId")}
//                                         className="py-2"
//                                     >
//                                         <div className="d-flex align-items-center justify-content-between">
//                                             <span className="fw-semibold text-muted" style={{ fontSize: '0.8rem' }}>Project</span>
//                                             {getSortIcon("projectId")}
//                                         </div>
//                                     </th>
//                                     <th
//                                         style={{ cursor: "pointer", minWidth: "150px" }}
//                                         onClick={() => handleSort("moduleId")}
//                                         className="py-2"
//                                     >
//                                         <div className="d-flex align-items-center justify-content-between">
//                                             <span className="fw-semibold text-muted" style={{ fontSize: '0.8rem' }}>Module</span>
//                                             {getSortIcon("moduleId")}
//                                         </div>
//                                     </th>
//                                     <th
//                                         style={{ cursor: "pointer", minWidth: "150px" }}
//                                         onClick={() => handleSort("clientName")}
//                                         className="py-2"
//                                     >
//                                         <div className="d-flex align-items-center justify-content-between">
//                                             <span className="fw-semibold text-muted" style={{ fontSize: '0.8rem' }}>Client</span>
//                                             {getSortIcon("clientName")}
//                                         </div>
//                                     </th>
//                                     <th style={{ minWidth: "130px" }} className="py-2 fw-semibold text-center text-muted" style={{ fontSize: '0.8rem' }}>Actions</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {loading ? (
//                                     <tr>
//                                         <td colSpan="8" className="text-center py-4">
//                                             <div className="d-flex justify-content-center align-items-center">
//                                                 <Spinner animation="border" variant="primary" size="sm" className="me-2" />
//                                                 <span className="text-muted" style={{ fontSize: '0.8rem' }}>Loading error tickets...</span>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 ) : errors.length > 0 ? (
//                                     errors.map((error) => (
//                                         <tr key={error.id} className="border-bottom">
//                                             <td className="py-2">
//                                                 <span className="text-muted fw-medium" style={{ fontSize: '0.8rem' }}>#{error.id}</span>
//                                             </td>
//                                             <td className="py-2">
//                                                 <div>
//                                                     <div className="fw-semibold text-dark" style={{ fontSize: '0.85rem' }}>{error.title}</div>
//                                                     <small className="text-muted" style={{ fontSize: '0.7rem' }}>
//                                                         {error.description && error.description.length > 50
//                                                             ? `${error.description.substring(0, 50)}...`
//                                                             : error.description}
//                                                     </small>
//                                                 </div>
//                                             </td>
//                                             <td className="py-2">
//                                                 <Badge
//                                                     bg={priorityColors[error.priority] || "secondary"}
//                                                     className="px-2 py-1"
//                                                     style={{ fontWeight: '500', fontSize: '0.75rem' }}
//                                                 >
//                                                     {error.priority}
//                                                 </Badge>
//                                             </td>
//                                             <td className="py-2">
//                                                 <Badge
//                                                     bg={statusColors[error.status] || "secondary"}
//                                                     className="d-flex align-items-center px-2 py-1"
//                                                     style={{ fontWeight: '500', fontSize: '0.75rem', width: 'fit-content' }}
//                                                 >
//                                                     {statusIcons[error.status]}
//                                                     {error.status}
//                                                 </Badge>
//                                             </td>
//                                             <td className="py-2">
//                                                 <span className="text-dark" style={{ fontSize: '0.8rem' }}>
//                                                     {getProjectName(error.projectId)}
//                                                 </span>
//                                             </td>
//                                             <td className="py-2">
//                                                 <span className="text-dark" style={{ fontSize: '0.8rem' }}>
//                                                     {getModuleName(error.moduleId)}
//                                                 </span>
//                                             </td>
//                                             <td className="py-2">
//                                                 <span className="text-dark" style={{ fontSize: '0.8rem' }}>
//                                                     {error.clientName || 'N/A'}
//                                                 </span>
//                                             </td>
//                                             <td className="py-2">
//                                                 <div className="d-flex justify-content-center gap-1">
//                                                     <Button
//                                                         variant="outline-primary"
//                                                         size="sm"
//                                                         className="d-flex align-items-center px-2"
//                                                         onClick={() => handleView(error)}
//                                                         title="View Details"
//                                                         style={{ fontSize: '0.7rem' }}
//                                                     >
//                                                         <FaEye size={10} className="me-1" />
//                                                         View
//                                                     </Button>
//                                                     <Button
//                                                         variant="outline-warning"
//                                                         size="sm"
//                                                         className="d-flex align-items-center px-2"
//                                                         onClick={() => handleEdit(error)}
//                                                         title="Edit"
//                                                         style={{ fontSize: '0.7rem' }}
//                                                     >
//                                                         <FaEdit size={10} className="me-1" />
//                                                         Edit
//                                                     </Button>
//                                                     <Dropdown>
//                                                         <Dropdown.Toggle
//                                                             variant="outline-secondary"
//                                                             size="sm"
//                                                             className="d-flex align-items-center px-1"
//                                                             style={{ fontSize: '0.7rem' }}
//                                                         >
//                                                             <FaEllipsisH size={10} />
//                                                         </Dropdown.Toggle>
//                                                         <Dropdown.Menu style={{ fontSize: '0.8rem' }}>
//                                                             <Dropdown.Item onClick={() => handleView(error)} style={{ fontSize: '0.8rem' }}>
//                                                                 <FaEye className="me-2 text-primary" size={10} />
//                                                                 View Details
//                                                             </Dropdown.Item>
//                                                             <Dropdown.Item onClick={() => handleEdit(error)} style={{ fontSize: '0.8rem' }}>
//                                                                 <FaEdit className="me-2 text-warning" size={10} />
//                                                                 Edit Ticket
//                                                             </Dropdown.Item>
//                                                             <Dropdown.Divider />
//                                                             <Dropdown.Item className="text-danger" onClick={() => handleConfirmDelete(error)} style={{ fontSize: '0.8rem' }}>
//                                                                 <FaTrash className="me-2" size={10} />
//                                                                 Delete
//                                                             </Dropdown.Item>
//                                                         </Dropdown.Menu>
//                                                     </Dropdown>
//                                                 </div>
//                                             </td>
//                                         </tr>
//                                     ))
//                                 ) : (
//                                     <tr>
//                                         <td colSpan="8" className="text-center py-4">
//                                             <div className="text-muted">
//                                                 <FaSearch size={32} className="mb-2 opacity-25" />
//                                                 <h6 className="mb-2" style={{ fontSize: '0.9rem' }}>No error tickets found</h6>
//                                                 <p className="mb-0" style={{ fontSize: '0.8rem' }}>
//                                                     {search ? 'Try adjusting your search terms' : 'Get started by creating your first error ticket'}
//                                                 </p>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 )}
//                             </tbody>
//                         </Table>
//                     </div>

//                     {/* Pagination Section */}
//                     {errors.length > 0 && (
//                         <div className="p-2 border-top bg-light">
//                             <div className="d-flex justify-content-between align-items-center">
//                                 <div>
//                                     <span className="text-muted" style={{ fontSize: '0.75rem' }}>
//                                         Showing <strong>{((page - 1) * size) + 1}-{Math.min(page * size, totalRecords)}</strong> of <strong>{totalRecords}</strong> tickets
//                                     </span>
//                                 </div>

//                                 <div className="d-flex align-items-center gap-1">
//                                     <Button
//                                         variant="outline-secondary"
//                                         size="sm"
//                                         onClick={handlePrevious}
//                                         disabled={page <= 1}
//                                         className="d-flex align-items-center px-2"
//                                         style={{ fontSize: '0.7rem' }}
//                                     >
//                                         <FaChevronLeft size={10} className="me-1" />
//                                         Prev
//                                     </Button>

//                                     <div className="d-flex gap-1 mx-1">
//                                         {renderPaginationNumbers()}
//                                     </div>

//                                     <Button
//                                         variant="outline-secondary"
//                                         size="sm"
//                                         onClick={handleNext}
//                                         disabled={page >= totalPages}
//                                         className="d-flex align-items-center px-2"
//                                         style={{ fontSize: '0.7rem' }}
//                                     >
//                                         Next
//                                         <FaChevronRight size={10} className="ms-1" />
//                                     </Button>
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </Card.Body>
//             </Card>

//             {/* Modals */}
//             <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
//                 <Modal.Header closeButton>
//                     <Modal.Title style={{ fontSize: '1rem' }}>
//                         {selectedError ? "Edit Error Ticket" : "Create New Error Ticket"}
//                     </Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <Form>
//                         <div className="row">
//                             <div className="col-md-6">
//                                 <Form.Group className="mb-3">
//                                     <Form.Label style={{ fontSize: '0.85rem' }}>Title <span className="text-danger">*</span></Form.Label>
//                                     <Form.Control
//                                         name="title"
//                                         value={formData.title}
//                                         onChange={handleChange}
//                                         placeholder="Enter error title"
//                                         style={{ fontSize: '0.85rem' }}
//                                     />
//                                 </Form.Group>
//                             </div>
//                             <div className="col-md-6">
//                                 <Form.Group className="mb-3">
//                                     <Form.Label style={{ fontSize: '0.85rem' }}>Priority <span className="text-danger">*</span></Form.Label>
//                                     <Form.Select
//                                         name="priority"
//                                         value={formData.priority}
//                                         onChange={handleChange}
//                                         style={{ fontSize: '0.85rem' }}
//                                     >
//                                         <option value="High">High</option>
//                                         <option value="Medium">Medium</option>
//                                         <option value="Low">Low</option>
//                                     </Form.Select>
//                                 </Form.Group>
//                             </div>
//                         </div>

//                         <Form.Group className="mb-3">
//                             <Form.Label style={{ fontSize: '0.85rem' }}>Description <span className="text-danger">*</span></Form.Label>
//                             <Form.Control
//                                 as="textarea"
//                                 rows={3}
//                                 name="description"
//                                 value={formData.description}
//                                 onChange={handleChange}
//                                 placeholder="Describe the error in detail..."
//                                 style={{ fontSize: '0.85rem' }}
//                             />
//                         </Form.Group>

//                         <div className="row">
//                             <div className="col-md-6">
//                                 <Form.Group className="mb-3">
//                                     <Form.Label style={{ fontSize: '0.85rem' }}>Status</Form.Label>
//                                     <Form.Select
//                                         name="status"
//                                         value={formData.status}
//                                         onChange={handleChange}
//                                         style={{ fontSize: '0.85rem' }}
//                                     >
//                                         <option value="Open">Open</option>
//                                         <option value="In Progress">In Progress</option>
//                                         <option value="Resolved">Resolved</option>
//                                         <option value="Closed">Closed</option>
//                                     </Form.Select>
//                                 </Form.Group>
//                             </div>
//                             <div className="col-md-6">
//                                 <Form.Group className="mb-3">
//                                     <Form.Label style={{ fontSize: '0.85rem' }}>Error Date</Form.Label>
//                                     <Form.Control
//                                         type="date"
//                                         name="errorDate"
//                                         value={formData.errorDate}
//                                         onChange={handleChange}
//                                         style={{ fontSize: '0.85rem' }}
//                                     />
//                                 </Form.Group>
//                             </div>
//                         </div>

//                         <div className="row">
//                             <div className="col-md-6">
//                                 <Form.Group className="mb-3">
//                                     <Form.Label style={{ fontSize: '0.85rem' }}>Project <span className="text-danger">*</span></Form.Label>
//                                     <Form.Select
//                                         name="projectId"
//                                         value={formData.projectId}
//                                         onChange={handleChange}
//                                         style={{ fontSize: '0.85rem' }}
//                                         disabled={projectsLoading}
//                                     >
//                                         <option value="">Select Project</option>
//                                         {projects.map((project) => (
//                                             <option key={project.id} value={project.id}>
//                                                 {project.name}
//                                             </option>
//                                         ))}
//                                     </Form.Select>
//                                     {projectsLoading && (
//                                         <small className="text-muted" style={{ fontSize: '0.75rem' }}>
//                                             Loading projects...
//                                         </small>
//                                     )}
//                                 </Form.Group>
//                             </div>
//                             <div className="col-md-6">
//                                 <Form.Group className="mb-3">
//                                     <Form.Label style={{ fontSize: '0.85rem' }}>Module</Form.Label>
//                                     <Form.Select
//                                         name="moduleId"
//                                         value={formData.moduleId}
//                                         onChange={handleChange}
//                                         style={{ fontSize: '0.85rem' }}
//                                         disabled={modulesLoading}
//                                     >
//                                         <option value="">Select Module</option>
//                                         {modules.map((module) => (
//                                             <option key={module.id} value={module.id}>
//                                                 {module.name}
//                                             </option>
//                                         ))}
//                                     </Form.Select>
//                                     {modulesLoading && (
//                                         <small className="text-muted" style={{ fontSize: '0.75rem' }}>
//                                             Loading modules...
//                                         </small>
//                                     )}
//                                 </Form.Group>
//                             </div>
//                         </div>

//                         <div className="row">
//                             <div className="col-md-6">
//                                 <Form.Group className="mb-3">
//                                     <Form.Label style={{ fontSize: '0.85rem' }}>Reported By <span className="text-danger">*</span></Form.Label>
//                                     <Form.Select
//                                         name="reportedBy"
//                                         value={formData.reportedBy}
//                                         onChange={handleChange}
//                                         style={{ fontSize: '0.85rem' }}
//                                         disabled={employeesLoading}
//                                     >
//                                         <option value="">Select Employee</option>
//                                         {employees.map((employee) => (
//                                             <option key={employee.id} value={employee.id}>
//                                                 {employee.name}
//                                             </option>
//                                         ))}
//                                     </Form.Select>
//                                     {employeesLoading && (
//                                         <small className="text-muted" style={{ fontSize: '0.75rem' }}>
//                                             Loading employees...
//                                         </small>
//                                     )}
//                                 </Form.Group>
//                             </div>
//                             <div className="col-md-6">
//                                 <Form.Group className="mb-3">
//                                     <Form.Label style={{ fontSize: '0.85rem' }}>Solved Date</Form.Label>
//                                     <Form.Control
//                                         type="date"
//                                         name="solvedDate"
//                                         value={formData.solvedDate}
//                                         onChange={handleChange}
//                                         style={{ fontSize: '0.85rem' }}
//                                     />
//                                 </Form.Group>
//                             </div>
//                         </div>

//                         <Form.Group className="mb-3">
//                             <Form.Label style={{ fontSize: '0.85rem' }}>Client Name</Form.Label>
//                             <Form.Control
//                                 name="clientName"
//                                 value={formData.clientName}
//                                 onChange={handleChange}
//                                 placeholder="Enter client name"
//                                 style={{ fontSize: '0.85rem' }}
//                             />
//                         </Form.Group>
//                     </Form>
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="outline-secondary" onClick={() => setShowModal(false)} style={{ fontSize: '0.8rem' }}>
//                         Cancel
//                     </Button>
//                     <Button
//                         variant="primary"
//                         onClick={selectedError ? handleUpdate : handleSave}
//                         style={{ fontSize: '0.8rem' }}
//                     >
//                         {selectedError ? "Update Ticket" : "Create Ticket"}
//                     </Button>
//                 </Modal.Footer>
//             </Modal>

//             <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered size="lg">
//                 <Modal.Header closeButton>
//                     <Modal.Title style={{ fontSize: '1rem' }}>Error Ticket Details</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     {selectedError && (
//                         <div>
//                             <div className="d-flex justify-content-between align-items-start mb-3">
//                                 <div>
//                                     <h5 className="mb-1" style={{ fontSize: '1rem' }}>{selectedError.title}</h5>
//                                     <div className="d-flex gap-2 mt-2">
//                                         <Badge bg={priorityColors[selectedError.priority]} style={{ fontSize: '0.75rem' }}>
//                                             {selectedError.priority} Priority
//                                         </Badge>
//                                         <Badge bg={statusColors[selectedError.status]} style={{ fontSize: '0.75rem' }}>
//                                             {statusIcons[selectedError.status]}
//                                             {selectedError.status}
//                                         </Badge>
//                                     </div>
//                                 </div>
//                                 <span className="text-muted" style={{ fontSize: '0.8rem' }}>#{selectedError.id}</span>
//                             </div>

//                             <div className="row">
//                                 <div className="col-md-6">
//                                     <div className="mb-3">
//                                         <strong style={{ fontSize: '0.85rem' }}>Description:</strong>
//                                         <p className="mb-0 mt-1" style={{ fontSize: '0.8rem' }}>{selectedError.description}</p>
//                                     </div>
//                                 </div>
//                                 <div className="col-md-6">
//                                     <div className="mb-2" style={{ fontSize: '0.85rem' }}>
//                                         <strong>Client:</strong> {selectedError.clientName || 'N/A'}
//                                     </div>
//                                     <div className="mb-2" style={{ fontSize: '0.85rem' }}>
//                                         <strong>Project:</strong> {getProjectName(selectedError.projectId)}
//                                     </div>
//                                     <div className="mb-2" style={{ fontSize: '0.85rem' }}>
//                                         <strong>Module:</strong> {getModuleName(selectedError.moduleId)}
//                                     </div>
//                                     <div className="mb-2" style={{ fontSize: '0.85rem' }}>
//                                         <strong>Reported By:</strong> {getEmployeeName(selectedError.reportedBy)}
//                                     </div>
//                                     <div className="mb-2" style={{ fontSize: '0.85rem' }}>
//                                         <strong>Error Date:</strong> {formatDate(selectedError.errorDate || selectedError.errordate)}
//                                     </div>
//                                     {selectedError.solvedDate && (
//                                         <div className="mb-2" style={{ fontSize: '0.85rem' }}>
//                                             <strong>Solved Date:</strong> {formatDate(selectedError.solvedDate)}
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="outline-secondary" onClick={() => setShowViewModal(false)} style={{ fontSize: '0.8rem' }}>
//                         Close
//                     </Button>
//                 </Modal.Footer>
//             </Modal>

//             <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
//                 <Modal.Header closeButton>
//                     <Modal.Title style={{ fontSize: '1rem' }}>Delete Error Ticket</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     {selectedError && (
//                         <div className="text-center">
//                             <div className="mb-3">
//                                 <FaExclamationTriangle size={40} className="text-danger mb-2" />
//                                 <h6 className="mb-1" style={{ fontSize: '0.9rem' }}>{selectedError.title}</h6>
//                                 <small className="text-muted" style={{ fontSize: '0.8rem' }}>
//                                     Project: {getProjectName(selectedError.projectId)} | Module: {getModuleName(selectedError.moduleId)} | Priority: {selectedError.priority} | Status: {selectedError.status}
//                                 </small>
//                             </div>
//                             <p className="mb-0" style={{ fontSize: '0.85rem' }}>
//                                 Are you sure you want to delete error ticket <strong>#{selectedError.id}</strong>?
//                                 This action cannot be undone.
//                             </p>
//                         </div>
//                     )}
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="outline-secondary" onClick={() => setShowDeleteModal(false)} style={{ fontSize: '0.8rem' }}>
//                         Cancel
//                     </Button>
//                     <Button variant="danger" onClick={handleDelete} style={{ fontSize: '0.8rem' }}>
//                         Delete Ticket
//                     </Button>
//                 </Modal.Footer>
//             </Modal>
//         </div>
//     );
// };

// export default ErrorTicketPage;





































































// "use client";
// import React, { useEffect, useState } from "react";
// import API from "@/services/api";
// import {
//     Card,
//     Table,
//     Button,
//     Form,
//     InputGroup,
//     Modal,
//     Spinner,
//     Dropdown,
//     Badge
// } from "react-bootstrap";
// import {
//     FaEdit,
//     FaEye,
//     FaTrash,
//     FaSort,
//     FaSortUp,
//     FaSortDown,
//     FaPlus,
//     FaSearch,
//     FaFilter,
//     FaChevronLeft,
//     FaChevronRight,
//     FaEllipsisH,
//     FaExclamationTriangle,
//     FaCheckCircle,
//     FaClock
// } from "react-icons/fa";

// const ErrorTicketPage = () => {
//     const [errors, setErrors] = useState([]);
//     const [projects, setProjects] = useState([]);
//     const [modules, setModules] = useState([]);
//     const [employees, setEmployees] = useState([]);
//     const [search, setSearch] = useState("");
//     const [page, setPage] = useState(1);
//     const [size, setSize] = useState(5);
//     const [totalPages, setTotalPages] = useState(1);
//     const [totalRecords, setTotalRecords] = useState(0);
//     const [loading, setLoading] = useState(false);
//     const [projectsLoading, setProjectsLoading] = useState(false);
//     const [modulesLoading, setModulesLoading] = useState(false);
//     const [employeesLoading, setEmployeesLoading] = useState(false);

//     // Sorting State
//     const [sortBy, setSortBy] = useState("id");
//     const [sortDir, setSortDir] = useState("desc");

//     // Modal States
//     const [showModal, setShowModal] = useState(false);
//     const [showViewModal, setShowViewModal] = useState(false);
//     const [showDeleteModal, setShowDeleteModal] = useState(false);
//     const [selectedError, setSelectedError] = useState(null);
//     const [formData, setFormData] = useState({
//         title: "",
//         description: "",
//         status: "Open",
//         priority: "Medium",
//         clientName: "",
//         projectId: "",
//         moduleId: "",
//         reportedBy: "",
//         errorDate: "",
//         solvedDate: ""
//     });

//     // Page size options
//     const pageSizeOptions = [5, 10, 20, 50];

//     // Priority colors
//     const priorityColors = {
//         "High": "danger",
//         "Medium": "warning",
//         "Low": "info"
//     };

//     // Status colors
//     const statusColors = {
//         "Open": "danger",
//         "In Progress": "warning",
//         "Resolved": "success",
//         "Closed": "secondary"
//     };

//     // Status icons
//     const statusIcons = {
//         "Open": <FaExclamationTriangle className="me-1" />,
//         "In Progress": <FaClock className="me-1" />,
//         "Resolved": <FaCheckCircle className="me-1" />,
//         "Closed": <FaCheckCircle className="me-1" />
//     };

//     // 🔍 Fetch Errors with Pagination + Search + Sorting
//     const fetchErrors = async () => {
//         setLoading(true);
//         try {
//             const res = await API.get(
//                 `/errors/smart?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}&search=${search}`
//             );
//             setErrors(res.data.results || []);
//             setTotalPages(res.data.totalPages || 1);
//             setTotalRecords(res.data.totalRecords || 0);
//         } catch (error) {
//             console.error("Error fetching errors:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // 🏗️ Fetch Projects for Dropdown
//     const fetchProjects = async () => {
//         setProjectsLoading(true);
//         try {
//             const res = await API.get('/project/smart?page=1&size=100');
//             setProjects(res.data.results || res.data || []);
//         } catch (error) {
//             console.error("Error fetching projects:", error);
//         } finally {
//             setProjectsLoading(false);
//         }
//     };

//     // 🏗️ Fetch Modules for Dropdown - PROJECT SPECIFIC
//     const fetchModules = async (projectId) => {
//         setModulesLoading(true);
//         try {
//             if (projectId) {
//                 const res = await API.get(`/modules/getByProjectId/${projectId}`);
//                 setModules(res.data.results || res.data || []);
//             } else {
//                 setModules([]);
//             }
//         } catch (error) {
//             console.error("Error fetching modules:", error);
//             setModules([]);
//         } finally {
//             setModulesLoading(false);
//         }
//     };

//     // 👥 Fetch Employees for Dropdown
//     const fetchEmployees = async () => {
//         setEmployeesLoading(true);
//         try {
//             const res = await API.get('/employee/smart?page=1&size=100');
//             setEmployees(res.data.results || res.data || []);
//         } catch (error) {
//             console.error("Error fetching employees:", error);
//         } finally {
//             setEmployeesLoading(false);
//         }
//     };

//     // Project change पर modules fetch करें
//     useEffect(() => {
//         if (formData.projectId) {
//             fetchModules(formData.projectId);
//         } else {
//             setModules([]);
//             setFormData(prev => ({ ...prev, moduleId: "" }));
//         }
//     }, [formData.projectId]);

//     // Initial data fetch
//     useEffect(() => {
//         fetchErrors();
//         fetchProjects();
//         fetchEmployees();
//     }, [page, size, search, sortBy, sortDir]);

//     // 🧾 Handle Input
//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     // 💾 Save Error
//     const handleSave = async () => {
//         try {
//             const formattedData = {
//                 title: formData.title,
//                 description: formData.description,
//                 status: formData.status,
//                 priority: formData.priority,
//                 clientName: formData.clientName,
//                 projectId: formData.projectId ? parseInt(formData.projectId) : null,
//                 moduleId: formData.moduleId ? parseInt(formData.moduleId) : null,
//                 reportedBy: formData.reportedBy ? parseInt(formData.reportedBy) : null,
//                 errorDate: formData.errorDate || new Date().toISOString().split('T')[0],
//                 solvedDate: formData.solvedDate || null
//             };

//             await API.post("/errors/save", formattedData);
//             setShowModal(false);
//             resetForm();
//             fetchErrors();
//         } catch (error) {
//             console.error("Error saving error ticket:", error);
//             alert("Error saving ticket. Please try again.");
//         }
//     };

//     // ✏️ Update Error
//     const handleUpdate = async () => {
//         try {
//             const formattedData = {
//                 title: formData.title,
//                 description: formData.description,
//                 status: formData.status,
//                 priority: formData.priority,
//                 clientName: formData.clientName,
//                 projectId: formData.projectId ? parseInt(formData.projectId) : null,
//                 moduleId: formData.moduleId ? parseInt(formData.moduleId) : null,
//                 reportedBy: formData.reportedBy ? parseInt(formData.reportedBy) : null,
//                 errorDate: formData.errorDate,
//                 solvedDate: formData.solvedDate || null
//             };

//             await API.put(`/errors/update/${selectedError.id}`, formattedData);
//             setShowModal(false);
//             resetForm();
//             setSelectedError(null);
//             fetchErrors();
//         } catch (error) {
//             console.error("Error updating error ticket:", error);
//             alert("Error updating ticket. Please try again.");
//         }
//     };

//     // 🗑️ Delete Error
//     const handleDelete = async () => {
//         try {
//             await API.delete(`/errors/delete/${selectedError.id}`);
//             setShowDeleteModal(false);
//             setSelectedError(null);
//             fetchErrors();
//         } catch (error) {
//             console.error("Error deleting error ticket:", error);
//             alert("Error deleting ticket. Please try again.");
//         }
//     };

//     // Reset form data
//     const resetForm = () => {
//         setFormData({
//             title: "",
//             description: "",
//             status: "Open",
//             priority: "Medium",
//             clientName: "",
//             projectId: "",
//             moduleId: "",
//             reportedBy: "",
//             errorDate: "",
//             solvedDate: ""
//         });
//         setModules([]);
//     };

//     // Modal close handler
//     const handleModalClose = () => {
//         setShowModal(false);
//         resetForm();
//         setSelectedError(null);
//     };

//     // 🔄 Sort Handling
//     const handleSort = (column) => {
//         if (sortBy === column) {
//             setSortDir(sortDir === "asc" ? "desc" : "asc");
//         } else {
//             setSortBy(column);
//             setSortDir("asc");
//         }
//         setPage(1);
//     };

//     // ➕ Add New Error
//     const handleAddNew = () => {
//         resetForm();
//         setFormData(prev => ({
//             ...prev,
//             errorDate: new Date().toISOString().split('T')[0]
//         }));
//         setSelectedError(null);
//         setShowModal(true);
//     };

//     // ✏️ Edit Error
//     const handleEdit = (error) => {
//         setSelectedError(error);
//         setFormData({
//             title: error.title,
//             description: error.description,
//             status: error.status,
//             priority: error.priority,
//             clientName: error.clientName,
//             projectId: error.projectId || "",
//             moduleId: error.moduleId || "",
//             reportedBy: error.reportedBy || "",
//             errorDate: error.errorDate || error.errordate || new Date().toISOString().split('T')[0],
//             solvedDate: error.solvedDate || error.solved || ""
//         });
        
//         // ProjectId है तो उसके modules fetch करें
//         if (error.projectId) {
//             fetchModules(error.projectId);
//         } else {
//             setModules([]);
//         }
        
//         setShowModal(true);
//     };

//     // 👁️ View Error
//     const handleView = (error) => {
//         setSelectedError(error);
//         setShowViewModal(true);
//     };

//     // 🗑️ Confirm Delete
//     const handleConfirmDelete = (error) => {
//         setSelectedError(error);
//         setShowDeleteModal(true);
//     };

//     // Get Sort Icon
//     const getSortIcon = (column) => {
//         if (sortBy !== column) return <FaSort className="ms-1 opacity-50" size={12} />;
//         return sortDir === "asc" ? <FaSortUp className="ms-1" size={12} /> : <FaSortDown className="ms-1" size={12} />;
//     };

//     // Pagination Functions
//     const handlePageChange = (newPage) => {
//         setPage(newPage);
//     };

//     const handlePrevious = () => {
//         setPage(prev => Math.max(1, prev - 1));
//     };

//     const handleNext = () => {
//         setPage(prev => Math.min(totalPages, prev + 1));
//     };

//     const handleSizeChange = (e) => {
//         setSize(parseInt(e.target.value));
//         setPage(1);
//     };

//     // Format date for display
//     const formatDate = (dateString) => {
//         if (!dateString) return 'N/A';
//         return new Date(dateString).toLocaleDateString('en-US', {
//             year: 'numeric',
//             month: 'short',
//             day: 'numeric'
//         });
//     };

//     // Get project name by ID
//     const getProjectName = (projectId) => {
//         if (!projectId) return 'N/A';
//         const project = projects.find(p => p.id === projectId);
//         return project ? project.name : `Project #${projectId}`;
//     };

//     // Get module name by ID
//     const getModuleName = (moduleId) => {
//         if (!moduleId) return 'N/A';
//         const module = modules.find(m => m.id === moduleId);
//         return module ? module.name : `Module #${moduleId}`;
//     };

//     // Get employee name by ID
//     const getEmployeeName = (employeeId) => {
//         if (!employeeId) return 'N/A';
//         const employee = employees.find(e => e.id === employeeId);
//         return employee ? employee.name : `Employee #${employeeId}`;
//     };

//     // Render Pagination Numbers
//     const renderPaginationNumbers = () => {
//         const pages = [];
//         const maxVisiblePages = 5;
//         const startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
//         const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

//         // Previous dots
//         if (startPage > 1) {
//             pages.push(
//                 <button
//                     key={1}
//                     className="btn btn-outline-secondary btn-sm mx-1"
//                     onClick={() => handlePageChange(1)}
//                     style={{ fontSize: '0.8rem' }}
//                 >
//                     1
//                 </button>
//             );
//             if (startPage > 2) {
//                 pages.push(<span key="dots1" className="mx-1 text-muted" style={{ fontSize: '0.8rem' }}>•••</span>);
//             }
//         }

//         // Page numbers
//         for (let i = startPage; i <= endPage; i++) {
//             pages.push(
//                 <button
//                     key={i}
//                     className={`btn btn-sm mx-1 ${page === i ? 'btn-primary' : 'btn-outline-secondary'}`}
//                     onClick={() => handlePageChange(i)}
//                     style={{ fontSize: '0.8rem' }}
//                 >
//                     {i}
//                 </button>
//             );
//         }

//         // Next dots
//         if (endPage < totalPages) {
//             if (endPage < totalPages - 1) {
//                 pages.push(<span key="dots2" className="mx-1 text-muted" style={{ fontSize: '0.8rem' }}>•••</span>);
//             }
//             pages.push(
//                 <button
//                     key={totalPages}
//                     className="btn btn-outline-secondary btn-sm mx-1"
//                     onClick={() => handlePageChange(totalPages)}
//                     style={{ fontSize: '0.8rem' }}
//                 >
//                     {totalPages}
//                 </button>
//             );
//         }

//         return pages;
//     };

//     return (
//         <div className="container-fluid py-3">
//             {/* Card Container */}
//             <Card className="shadow-sm border-0">
//                 {/* Card Header */}
//                 <Card.Header className="bg-white border-0 py-3">
//                     <div className="d-flex justify-content-between align-items-center">
//                         <div>
//                             <h5 className="mb-0 text-dark fw-bold" style={{ fontSize: '1.1rem' }}>Error & Ticket Management</h5>
//                             <small className="text-muted" style={{ fontSize: '0.75rem' }}>Track and resolve issues efficiently</small>
//                         </div>
//                         <Button
//                             variant="primary"
//                             className="d-flex align-items-center gap-2 px-3"
//                             onClick={handleAddNew}
//                             style={{ fontSize: '0.8rem' }}
//                         >
//                             <FaPlus size={12} />
//                             New Ticket
//                         </Button>
//                     </div>
//                 </Card.Header>

//                 <Card.Body className="p-0">
//                     {/* Controls Section */}
//                     <div className="p-3 border-bottom bg-light">
//                         <div className="row g-3 align-items-center">
//                             <div className="col-md-6">
//                                 <InputGroup>
//                                     <Form.Control
//                                         placeholder="Search by title, description, client..."
//                                         value={search}
//                                         onChange={(e) => {
//                                             setSearch(e.target.value);
//                                             setPage(1);
//                                         }}
//                                         style={{ fontSize: '0.8rem' }}
//                                     />
//                                     <InputGroup.Text className="bg-white" style={{ fontSize: '0.8rem' }}>
//                                         <FaSearch className="text-muted" size={12} />
//                                     </InputGroup.Text>
//                                 </InputGroup>
//                             </div>
//                             <div className="col-md-6 d-flex justify-content-end gap-3">
//                                 <div className="d-flex align-items-center gap-2">
//                                     <span className="text-muted" style={{ fontSize: '0.8rem' }}>Show:</span>
//                                     <Form.Select
//                                         value={size}
//                                         onChange={handleSizeChange}
//                                         style={{ width: '70px', fontSize: '0.8rem' }}
//                                     >
//                                         {pageSizeOptions.map(option => (
//                                             <option key={option} value={option}>{option}</option>
//                                         ))}
//                                     </Form.Select>
//                                 </div>
//                                 <Dropdown>
//                                     <Dropdown.Toggle variant="outline-secondary" size="sm" className="d-flex align-items-center gap-2" style={{ fontSize: '0.8rem' }}>
//                                         <FaFilter size={10} />
//                                         Filter
//                                     </Dropdown.Toggle>
//                                     <Dropdown.Menu style={{ fontSize: '0.8rem' }}>
//                                         <Dropdown.Item>Open Tickets</Dropdown.Item>
//                                         <Dropdown.Item>In Progress</Dropdown.Item>
//                                         <Dropdown.Item>Resolved Tickets</Dropdown.Item>
//                                         <Dropdown.Divider />
//                                         <Dropdown.Item>Clear Filters</Dropdown.Item>
//                                     </Dropdown.Menu>
//                                 </Dropdown>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Table Section */}
//                     <div className="table-responsive">
//                         <Table hover className="mb-0">
//                             <thead className="table-light">
//                                 <tr>
//                                     <th
//                                         style={{ cursor: "pointer", width: "70px" }}
//                                         onClick={() => handleSort("id")}
//                                         className="py-2"
//                                     >
//                                         <div className="d-flex align-items-center justify-content-between">
//                                             <span className="fw-semibold text-muted" style={{ fontSize: '0.8rem' }}>ID</span>
//                                             {getSortIcon("id")}
//                                         </div>
//                                     </th>
//                                     <th
//                                         style={{ cursor: "pointer", minWidth: "200px" }}
//                                         onClick={() => handleSort("title")}
//                                         className="py-2"
//                                     >
//                                         <div className="d-flex align-items-center justify-content-between">
//                                             <span className="fw-semibold text-muted" style={{ fontSize: '0.8rem' }}>Error Title</span>
//                                             {getSortIcon("title")}
//                                         </div>
//                                     </th>
//                                     <th
//                                         style={{ cursor: "pointer", minWidth: "120px" }}
//                                         onClick={() => handleSort("priority")}
//                                         className="py-2"
//                                     >
//                                         <div className="d-flex align-items-center justify-content-between">
//                                             <span className="fw-semibold text-muted" style={{ fontSize: '0.8rem' }}>Priority</span>
//                                             {getSortIcon("priority")}
//                                         </div>
//                                     </th>
//                                     <th
//                                         style={{ cursor: "pointer", minWidth: "130px" }}
//                                         onClick={() => handleSort("status")}
//                                         className="py-2"
//                                     >
//                                         <div className="d-flex align-items-center justify-content-between">
//                                             <span className="fw-semibold text-muted" style={{ fontSize: '0.8rem' }}>Status</span>
//                                             {getSortIcon("status")}
//                                         </div>
//                                     </th>
//                                     <th
//                                         style={{ cursor: "pointer", minWidth: "150px" }}
//                                         onClick={() => handleSort("projectId")}
//                                         className="py-2"
//                                     >
//                                         <div className="d-flex align-items-center justify-content-between">
//                                             <span className="fw-semibold text-muted" style={{ fontSize: '0.8rem' }}>Project</span>
//                                             {getSortIcon("projectId")}
//                                         </div>
//                                     </th>
//                                     <th
//                                         style={{ cursor: "pointer", minWidth: "150px" }}
//                                         onClick={() => handleSort("moduleId")}
//                                         className="py-2"
//                                     >
//                                         <div className="d-flex align-items-center justify-content-between">
//                                             <span className="fw-semibold text-muted" style={{ fontSize: '0.8rem' }}>Module</span>
//                                             {getSortIcon("moduleId")}
//                                         </div>
//                                     </th>
//                                     <th
//                                         style={{ cursor: "pointer", minWidth: "150px" }}
//                                         onClick={() => handleSort("clientName")}
//                                         className="py-2"
//                                     >
//                                         <div className="d-flex align-items-center justify-content-between">
//                                             <span className="fw-semibold text-muted" style={{ fontSize: '0.8rem' }}>Client</span>
//                                             {getSortIcon("clientName")}
//                                         </div>
//                                     </th>
//                                     <th style={{ minWidth: "130px" }} className="py-2 fw-semibold text-center text-muted" style={{ fontSize: '0.8rem' }}>Actions</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {loading ? (
//                                     <tr>
//                                         <td colSpan="8" className="text-center py-4">
//                                             <div className="d-flex justify-content-center align-items-center">
//                                                 <Spinner animation="border" variant="primary" size="sm" className="me-2" />
//                                                 <span className="text-muted" style={{ fontSize: '0.8rem' }}>Loading error tickets...</span>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 ) : errors.length > 0 ? (
//                                     errors.map((error) => (
//                                         <tr key={error.id} className="border-bottom">
//                                             <td className="py-2">
//                                                 <span className="text-muted fw-medium" style={{ fontSize: '0.8rem' }}>#{error.id}</span>
//                                             </td>
//                                             <td className="py-2">
//                                                 <div>
//                                                     <div className="fw-semibold text-dark" style={{ fontSize: '0.85rem' }}>{error.title}</div>
//                                                     <small className="text-muted" style={{ fontSize: '0.7rem' }}>
//                                                         {error.description && error.description.length > 50
//                                                             ? `${error.description.substring(0, 50)}...`
//                                                             : error.description}
//                                                     </small>
//                                                 </div>
//                                             </td>
//                                             <td className="py-2">
//                                                 <Badge
//                                                     bg={priorityColors[error.priority] || "secondary"}
//                                                     className="px-2 py-1"
//                                                     style={{ fontWeight: '500', fontSize: '0.75rem' }}
//                                                 >
//                                                     {error.priority}
//                                                 </Badge>
//                                             </td>
//                                             <td className="py-2">
//                                                 <Badge
//                                                     bg={statusColors[error.status] || "secondary"}
//                                                     className="d-flex align-items-center px-2 py-1"
//                                                     style={{ fontWeight: '500', fontSize: '0.75rem', width: 'fit-content' }}
//                                                 >
//                                                     {statusIcons[error.status]}
//                                                     {error.status}
//                                                 </Badge>
//                                             </td>
//                                             <td className="py-2">
//                                                 <span className="text-dark" style={{ fontSize: '0.8rem' }}>
//                                                     {getProjectName(error.projectId)}
//                                                 </span>
//                                             </td>
//                                             <td className="py-2">
//                                                 <span className="text-dark" style={{ fontSize: '0.8rem' }}>
//                                                     {getModuleName(error.moduleId)}
//                                                 </span>
//                                             </td>
//                                             <td className="py-2">
//                                                 <span className="text-dark" style={{ fontSize: '0.8rem' }}>
//                                                     {error.clientName || 'N/A'}
//                                                 </span>
//                                             </td>
//                                             <td className="py-2">
//                                                 <div className="d-flex justify-content-center gap-1">
//                                                     <Button
//                                                         variant="outline-primary"
//                                                         size="sm"
//                                                         className="d-flex align-items-center px-2"
//                                                         onClick={() => handleView(error)}
//                                                         title="View Details"
//                                                         style={{ fontSize: '0.7rem' }}
//                                                     >
//                                                         <FaEye size={10} className="me-1" />
//                                                         View
//                                                     </Button>
//                                                     <Button
//                                                         variant="outline-warning"
//                                                         size="sm"
//                                                         className="d-flex align-items-center px-2"
//                                                         onClick={() => handleEdit(error)}
//                                                         title="Edit"
//                                                         style={{ fontSize: '0.7rem' }}
//                                                     >
//                                                         <FaEdit size={10} className="me-1" />
//                                                         Edit
//                                                     </Button>
//                                                     <Dropdown>
//                                                         <Dropdown.Toggle
//                                                             variant="outline-secondary"
//                                                             size="sm"
//                                                             className="d-flex align-items-center px-1"
//                                                             style={{ fontSize: '0.7rem' }}
//                                                         >
//                                                             <FaEllipsisH size={10} />
//                                                         </Dropdown.Toggle>
//                                                         <Dropdown.Menu style={{ fontSize: '0.8rem' }}>
//                                                             <Dropdown.Item onClick={() => handleView(error)} style={{ fontSize: '0.8rem' }}>
//                                                                 <FaEye className="me-2 text-primary" size={10} />
//                                                                 View Details
//                                                             </Dropdown.Item>
//                                                             <Dropdown.Item onClick={() => handleEdit(error)} style={{ fontSize: '0.8rem' }}>
//                                                                 <FaEdit className="me-2 text-warning" size={10} />
//                                                                 Edit Ticket
//                                                             </Dropdown.Item>
//                                                             <Dropdown.Divider />
//                                                             <Dropdown.Item className="text-danger" onClick={() => handleConfirmDelete(error)} style={{ fontSize: '0.8rem' }}>
//                                                                 <FaTrash className="me-2" size={10} />
//                                                                 Delete
//                                                             </Dropdown.Item>
//                                                         </Dropdown.Menu>
//                                                     </Dropdown>
//                                                 </div>
//                                             </td>
//                                         </tr>
//                                     ))
//                                 ) : (
//                                     <tr>
//                                         <td colSpan="8" className="text-center py-4">
//                                             <div className="text-muted">
//                                                 <FaSearch size={32} className="mb-2 opacity-25" />
//                                                 <h6 className="mb-2" style={{ fontSize: '0.9rem' }}>No error tickets found</h6>
//                                                 <p className="mb-0" style={{ fontSize: '0.8rem' }}>
//                                                     {search ? 'Try adjusting your search terms' : 'Get started by creating your first error ticket'}
//                                                 </p>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 )}
//                             </tbody>
//                         </Table>
//                     </div>

//                     {/* Pagination Section */}
//                     {errors.length > 0 && (
//                         <div className="p-2 border-top bg-light">
//                             <div className="d-flex justify-content-between align-items-center">
//                                 <div>
//                                     <span className="text-muted" style={{ fontSize: '0.75rem' }}>
//                                         Showing <strong>{((page - 1) * size) + 1}-{Math.min(page * size, totalRecords)}</strong> of <strong>{totalRecords}</strong> tickets
//                                     </span>
//                                 </div>

//                                 <div className="d-flex align-items-center gap-1">
//                                     <Button
//                                         variant="outline-secondary"
//                                         size="sm"
//                                         onClick={handlePrevious}
//                                         disabled={page <= 1}
//                                         className="d-flex align-items-center px-2"
//                                         style={{ fontSize: '0.7rem' }}
//                                     >
//                                         <FaChevronLeft size={10} className="me-1" />
//                                         Prev
//                                     </Button>

//                                     <div className="d-flex gap-1 mx-1">
//                                         {renderPaginationNumbers()}
//                                     </div>

//                                     <Button
//                                         variant="outline-secondary"
//                                         size="sm"
//                                         onClick={handleNext}
//                                         disabled={page >= totalPages}
//                                         className="d-flex align-items-center px-2"
//                                         style={{ fontSize: '0.7rem' }}
//                                     >
//                                         Next
//                                         <FaChevronRight size={10} className="ms-1" />
//                                     </Button>
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </Card.Body>
//             </Card>

//             {/* Add/Edit Modal */}
//             <Modal show={showModal} onHide={handleModalClose} centered size="lg">
//                 <Modal.Header closeButton>
//                     <Modal.Title style={{ fontSize: '1rem' }}>
//                         {selectedError ? "Edit Error Ticket" : "Create New Error Ticket"}
//                     </Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <Form>
//                         <div className="row">
//                             <div className="col-md-6">
//                                 <Form.Group className="mb-3">
//                                     <Form.Label style={{ fontSize: '0.85rem' }}>Title <span className="text-danger">*</span></Form.Label>
//                                     <Form.Control
//                                         name="title"
//                                         value={formData.title}
//                                         onChange={handleChange}
//                                         placeholder="Enter error title"
//                                         style={{ fontSize: '0.85rem' }}
//                                         required
//                                     />
//                                 </Form.Group>
//                             </div>
//                             <div className="col-md-6">
//                                 <Form.Group className="mb-3">
//                                     <Form.Label style={{ fontSize: '0.85rem' }}>Priority <span className="text-danger">*</span></Form.Label>
//                                     <Form.Select
//                                         name="priority"
//                                         value={formData.priority}
//                                         onChange={handleChange}
//                                         style={{ fontSize: '0.85rem' }}
//                                         required
//                                     >
//                                         <option value="High">High</option>
//                                         <option value="Medium">Medium</option>
//                                         <option value="Low">Low</option>
//                                     </Form.Select>
//                                 </Form.Group>
//                             </div>
//                         </div>

//                         <Form.Group className="mb-3">
//                             <Form.Label style={{ fontSize: '0.85rem' }}>Description <span className="text-danger">*</span></Form.Label>
//                             <Form.Control
//                                 as="textarea"
//                                 rows={3}
//                                 name="description"
//                                 value={formData.description}
//                                 onChange={handleChange}
//                                 placeholder="Describe the error in detail..."
//                                 style={{ fontSize: '0.85rem' }}
//                                 required
//                             />
//                         </Form.Group>

//                         <div className="row">
//                             <div className="col-md-6">
//                                 <Form.Group className="mb-3">
//                                     <Form.Label style={{ fontSize: '0.85rem' }}>Status</Form.Label>
//                                     <Form.Select
//                                         name="status"
//                                         value={formData.status}
//                                         onChange={handleChange}
//                                         style={{ fontSize: '0.85rem' }}
//                                     >
//                                         <option value="Open">Open</option>
//                                         <option value="In Progress">In Progress</option>
//                                         <option value="Resolved">Resolved</option>
//                                         <option value="Closed">Closed</option>
//                                     </Form.Select>
//                                 </Form.Group>
//                             </div>
//                             <div className="col-md-6">
//                                 <Form.Group className="mb-3">
//                                     <Form.Label style={{ fontSize: '0.85rem' }}>Error Date</Form.Label>
//                                     <Form.Control
//                                         type="date"
//                                         name="errorDate"
//                                         value={formData.errorDate}
//                                         onChange={handleChange}
//                                         style={{ fontSize: '0.85rem' }}
//                                     />
//                                 </Form.Group>
//                             </div>
//                         </div>

//                         <div className="row">
//                             <div className="col-md-6">
//                                 <Form.Group className="mb-3">
//                                     <Form.Label style={{ fontSize: '0.85rem' }}>Project</Form.Label>
//                                     <Form.Select
//                                         name="projectId"
//                                         value={formData.projectId}
//                                         onChange={(e) => {
//                                             const selectedProjectId = e.target.value;
//                                             setFormData({ 
//                                                 ...formData, 
//                                                 projectId: selectedProjectId,
//                                                 moduleId: "" // Module reset करें
//                                             });
//                                             if (selectedProjectId) {
//                                                 fetchModules(selectedProjectId);
//                                             }
//                                         }}
//                                         style={{ fontSize: '0.85rem' }}
//                                         disabled={projectsLoading}
//                                     >
//                                         <option value="">Select Project</option>
//                                         {projects.map((project) => (
//                                             <option key={project.id} value={project.id}>
//                                                 {project.name}
//                                             </option>
//                                         ))}
//                                     </Form.Select>
//                                     {projectsLoading && (
//                                         <small className="text-muted" style={{ fontSize: '0.75rem' }}>
//                                             Loading projects...
//                                         </small>
//                                     )}
//                                 </Form.Group>
//                             </div>
//                             <div className="col-md-6">
//                                 <Form.Group className="mb-3">
//                                     <Form.Label style={{ fontSize: '0.85rem' }}>Module</Form.Label>
//                                     <Form.Select
//                                         name="moduleId"
//                                         value={formData.moduleId}
//                                         onChange={handleChange}
//                                         style={{ fontSize: '0.85rem' }}
//                                         disabled={modulesLoading || !formData.projectId}
//                                     >
//                                         <option value="">Select Module</option>
//                                         {modules.map((module) => (
//                                             <option key={module.id} value={module.id}>
//                                                 {module.name}
//                                             </option>
//                                         ))}
//                                     </Form.Select>
//                                     {modulesLoading && (
//                                         <small className="text-muted" style={{ fontSize: '0.75rem' }}>
//                                             Loading modules...
//                                         </small>
//                                     )}
//                                     {!formData.projectId && !modulesLoading && (
//                                         <small className="text-muted" style={{ fontSize: '0.75rem' }}>
//                                             Please select a project first
//                                         </small>
//                                     )}
//                                 </Form.Group>
//                             </div>
//                         </div>

//                         <div className="row">
//                             <div className="col-md-6">
//                                 <Form.Group className="mb-3">
//                                     <Form.Label style={{ fontSize: '0.85rem' }}>Reported By</Form.Label>
//                                     <Form.Select
//                                         name="reportedBy"
//                                         value={formData.reportedBy}
//                                         onChange={handleChange}
//                                         style={{ fontSize: '0.85rem' }}
//                                         disabled={employeesLoading}
//                                     >
//                                         <option value="">Select Employee</option>
//                                         {employees.map((employee) => (
//                                             <option key={employee.id} value={employee.id}>
//                                                 {employee.name}
//                                             </option>
//                                         ))}
//                                     </Form.Select>
//                                     {employeesLoading && (
//                                         <small className="text-muted" style={{ fontSize: '0.75rem' }}>
//                                             Loading employees...
//                                         </small>
//                                     )}
//                                 </Form.Group>
//                             </div>
//                             <div className="col-md-6">
//                                 <Form.Group className="mb-3">
//                                     <Form.Label style={{ fontSize: '0.85rem' }}>Solved Date</Form.Label>
//                                     <Form.Control
//                                         type="date"
//                                         name="solvedDate"
//                                         value={formData.solvedDate}
//                                         onChange={handleChange}
//                                         style={{ fontSize: '0.85rem' }}
//                                     />
//                                 </Form.Group>
//                             </div>
//                         </div>

//                         <Form.Group className="mb-3">
//                             <Form.Label style={{ fontSize: '0.85rem' }}>Client Name</Form.Label>
//                             <Form.Control
//                                 name="clientName"
//                                 value={formData.clientName}
//                                 onChange={handleChange}
//                                 placeholder="Enter client name"
//                                 style={{ fontSize: '0.85rem' }}
//                             />
//                         </Form.Group>
//                     </Form>
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="outline-secondary" onClick={handleModalClose} style={{ fontSize: '0.8rem' }}>
//                         Cancel
//                     </Button>
//                     <Button
//                         variant="primary"
//                         onClick={selectedError ? handleUpdate : handleSave}
//                         style={{ fontSize: '0.8rem' }}
//                     >
//                         {selectedError ? "Update Ticket" : "Create Ticket"}
//                     </Button>
//                 </Modal.Footer>
//             </Modal>

//             {/* View Modal */}
//             <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered size="lg">
//                 <Modal.Header closeButton>
//                     <Modal.Title style={{ fontSize: '1rem' }}>Error Ticket Details</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     {selectedError && (
//                         <div>
//                             <div className="d-flex justify-content-between align-items-start mb-3">
//                                 <div>
//                                     <h5 className="mb-1" style={{ fontSize: '1rem' }}>{selectedError.title}</h5>
//                                     <div className="d-flex gap-2 mt-2">
//                                         <Badge bg={priorityColors[selectedError.priority]} style={{ fontSize: '0.75rem' }}>
//                                             {selectedError.priority} Priority
//                                         </Badge>
//                                         <Badge bg={statusColors[selectedError.status]} style={{ fontSize: '0.75rem' }}>
//                                             {statusIcons[selectedError.status]}
//                                             {selectedError.status}
//                                         </Badge>
//                                     </div>
//                                 </div>
//                                 <span className="text-muted" style={{ fontSize: '0.8rem' }}>#{selectedError.id}</span>
//                             </div>

//                             <div className="row">
//                                 <div className="col-md-6">
//                                     <div className="mb-3">
//                                         <strong style={{ fontSize: '0.85rem' }}>Description:</strong>
//                                         <p className="mb-0 mt-1" style={{ fontSize: '0.8rem' }}>{selectedError.description}</p>
//                                     </div>
//                                 </div>
//                                 <div className="col-md-6">
//                                     <div className="mb-2" style={{ fontSize: '0.85rem' }}>
//                                         <strong>Client:</strong> {selectedError.clientName || 'N/A'}
//                                     </div>
//                                     <div className="mb-2" style={{ fontSize: '0.85rem' }}>
//                                         <strong>Project:</strong> {getProjectName(selectedError.projectId)}
//                                     </div>
//                                     <div className="mb-2" style={{ fontSize: '0.85rem' }}>
//                                         <strong>Module:</strong> {getModuleName(selectedError.moduleId)}
//                                     </div>
//                                     <div className="mb-2" style={{ fontSize: '0.85rem' }}>
//                                         <strong>Reported By:</strong> {getEmployeeName(selectedError.reportedBy)}
//                                     </div>
//                                     <div className="mb-2" style={{ fontSize: '0.85rem' }}>
//                                         <strong>Error Date:</strong> {formatDate(selectedError.errorDate || selectedError.errordate)}
//                                     </div>
//                                     {selectedError.solvedDate && (
//                                         <div className="mb-2" style={{ fontSize: '0.85rem' }}>
//                                             <strong>Solved Date:</strong> {formatDate(selectedError.solvedDate)}
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="outline-secondary" onClick={() => setShowViewModal(false)} style={{ fontSize: '0.8rem' }}>
//                         Close
//                     </Button>
//                 </Modal.Footer>
//             </Modal>

//             {/* Delete Modal */}
//             <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
//                 <Modal.Header closeButton>
//                     <Modal.Title style={{ fontSize: '1rem' }}>Delete Error Ticket</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     {selectedError && (
//                         <div className="text-center">
//                             <div className="mb-3">
//                                 <FaExclamationTriangle size={40} className="text-danger mb-2" />
//                                 <h6 className="mb-1" style={{ fontSize: '0.9rem' }}>{selectedError.title}</h6>
//                                 <small className="text-muted" style={{ fontSize: '0.8rem' }}>
//                                     Project: {getProjectName(selectedError.projectId)} | Module: {getModuleName(selectedError.moduleId)} | Priority: {selectedError.priority} | Status: {selectedError.status}
//                                 </small>
//                             </div>
//                             <p className="mb-0" style={{ fontSize: '0.85rem' }}>
//                                 Are you sure you want to delete error ticket <strong>#{selectedError.id}</strong>?
//                                 This action cannot be undone.
//                             </p>
//                         </div>
//                     )}
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="outline-secondary" onClick={() => setShowDeleteModal(false)} style={{ fontSize: '0.8rem' }}>
//                         Cancel
//                     </Button>
//                     <Button variant="danger" onClick={handleDelete} style={{ fontSize: '0.8rem' }}>
//                         Delete Ticket
//                     </Button>
//                 </Modal.Footer>
//             </Modal>
//         </div>
//     );
// };

// export default ErrorTicketPage;

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
    ToastContainer,
    Tab,
    Nav
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
    FaExclamationTriangle,
    FaCheckCircle,
    FaClock,
    FaTimesCircle,
    FaProjectDiagram,
    FaUserAlt,
    FaCalendarAlt,
    FaFlag,
    FaBug,
    FaHistory,
    FaRedoAlt,
    FaCheckDouble,
    FaUserCheck
} from "react-icons/fa";

const ErrorTicketPage = () => {
    const [errors, setErrors] = useState([]);
    const [projects, setProjects] = useState([]);
    const [allModules, setAllModules] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [activeEmployees, setActiveEmployees] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedProject, setSelectedProject] = useState("");
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(5);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState(false);
    const [projectsLoading, setProjectsLoading] = useState(false);
    const [modulesLoading, setModulesLoading] = useState(false);
    const [employeesLoading, setEmployeesLoading] = useState(false);

    // Sorting State
    const [sortBy, setSortBy] = useState("id");
    const [sortDir, setSortDir] = useState("desc");

    // Modal States
    const [showModal, setShowModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showReopenModal, setShowReopenModal] = useState(false);
    const [selectedError, setSelectedError] = useState(null);
    const [reopenReason, setReopenReason] = useState("");
    const [reopenAssignee, setReopenAssignee] = useState("");
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        status: "Open",
        priority: "Medium",
        clientName: "",
        projectId: "",
        moduleId: "",
        reportedBy: "",
        assignedTo: "",
        errorDate: "",
        solvedDate: ""
    });
    const [editId, setEditId] = useState(null);
    const [formErrors, setFormErrors] = useState({});

    // Toast States
    const [toast, setToast] = useState({
        show: false,
        message: "",
        type: "success"
    });

    const pageSizeOptions = [5, 10, 20, 50];

    const priorityColors = {
        "High": "danger",
        "Medium": "warning",
        "Low": "info"
    };

    const statusColors = {
        "Open": "danger",
        "In Progress": "warning",
        "Resolved": "success",
        "Closed": "secondary"
    };

    const statusIcons = {
        "Open": <FaExclamationTriangle className="me-1" size={10} />,
        "In Progress": <FaClock className="me-1" size={10} />,
        "Resolved": <FaCheckCircle className="me-1" size={10} />,
        "Closed": <FaCheckCircle className="me-1" size={10} />
    };

    const avatarColors = [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
        'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
    ];

    const getAvatarColor = (index) => avatarColors[index % avatarColors.length];

    const showToast = (message, type = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.title.trim()) errors.title = "Title is required";
        if (!formData.description.trim()) errors.description = "Description is required";
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const getModuleName = (moduleId) => {
        if (!moduleId) return 'N/A';
        const module = allModules.find(m => m.id === moduleId);
        return module ? module.name : `Module #${moduleId}`;
    };

    const getProjectName = (projectId) => {
        if (!projectId) return 'N/A';
        const project = projects.find(p => p.id === projectId);
        return project ? project.name : `Project #${projectId}`;
    };

    const fetchAllModules = async () => {
        try {
            const res = await API.get("/modules/smart?page=1&size=1000");
            setAllModules(res.data.results || res.data || []);
        } catch (error) {
            console.error("Error fetching all modules:", error);
        }
    };

    const fetchModulesByProject = async (projectId) => {
        setModulesLoading(true);
        try {
            if (projectId) {
                const res = await API.get(`/modules/getByProjectId/${projectId}`);
                const projectModules = res.data.results || res.data || [];
                setAllModules(prev => {
                    const existingIds = new Set(prev.map(m => m.id));
                    const newModules = projectModules.filter(m => !existingIds.has(m.id));
                    return [...prev, ...newModules];
                });
                return projectModules;
            }
            return [];
        } catch (error) {
            console.error("Error fetching modules:", error);
            return [];
        } finally {
            setModulesLoading(false);
        }
    };

    const fetchErrors = async () => {
        setLoading(true);
        try {
            let url = `/errors/smart?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`;
            if (search) url += `&search=${search}`;
            
            const res = await API.get(url);
            let allErrors = res.data.results || [];
            
            if (selectedProject) {
                allErrors = allErrors.filter(error => getProjectName(error.projectId) === selectedProject);
            }
            
            setErrors(allErrors);
            setTotalRecords(allErrors.length);
            setTotalPages(Math.ceil(allErrors.length / size));
        } catch (error) {
            console.error("Error fetching errors:", error);
            showToast("Failed to fetch error tickets", "error");
        } finally {
            setLoading(false);
        }
    };

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

    const fetchEmployees = async () => {
        setEmployeesLoading(true);
        try {
            const res = await API.get('/employee/smart?page=1&size=100');
            const allEmps = res.data.results || res.data || [];
            setEmployees(allEmps);
            setActiveEmployees(allEmps.filter(emp => emp.isActive !== false));
        } catch (error) {
            console.error("Error fetching employees:", error);
        } finally {
            setEmployeesLoading(false);
        }
    };

    // ✅ Auto-assign module lead when module is selected
    const handleModuleChange = async (moduleId) => {
        const selectedModule = getProjectModules().find(m => m.id === parseInt(moduleId));
        
        if (selectedModule && selectedModule.moduleLead) {
            // Auto-assign from module lead
            setFormData(prev => ({ 
                ...prev, 
                moduleId: moduleId,
                assignedTo: selectedModule.moduleLead.toString()
            }));
            showToast(`Auto-assigned to module lead: ${getEmployeeName(selectedModule.moduleLead)}`, "info");
        } else {
            setFormData(prev => ({ ...prev, moduleId: moduleId, assignedTo: "" }));
            if (selectedModule && !selectedModule.moduleLead) {
                showToast("No module lead assigned. Please select assignee manually.", "warning");
            }
        }
    };

    // ✅ Handle project change - fetch modules and reset module/assignee
    const handleProjectChange = async (projectId) => {
        setFormData({ 
            ...formData, 
            projectId: projectId, 
            moduleId: "", 
            assignedTo: "" 
        });
        
        if (projectId) {
            await fetchModulesByProject(projectId);
        }
    };

    useEffect(() => {
        fetchErrors();
        fetchProjects();
        fetchEmployees();
        fetchAllModules();
    }, [page, size, search, sortBy, sortDir, selectedProject]);

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            status: "Open",
            priority: "Medium",
            clientName: "",
            projectId: "",
            moduleId: "",
            reportedBy: "",
            assignedTo: "",
            errorDate: "",
            solvedDate: ""
        });
        setFormErrors({});
    };

    const handleModalClose = () => {
        setShowModal(false);
        resetForm();
        setEditId(null);
        setSelectedError(null);
    };

    const handleSave = async () => {
        if (!validateForm()) return;
        
        try {
            const formattedData = {
                title: formData.title,
                description: formData.description,
                status: formData.status,
                priority: formData.priority,
                clientName: formData.clientName,
                projectId: formData.projectId ? parseInt(formData.projectId) : null,
                moduleId: formData.moduleId ? parseInt(formData.moduleId) : null,
                reportedBy: formData.reportedBy ? parseInt(formData.reportedBy) : null,
                assignedTo: formData.assignedTo ? parseInt(formData.assignedTo) : null,
                errorDate: formData.errorDate || new Date().toISOString().split('T')[0],
                solvedDate: formData.solvedDate || null
            };

            if (editId) {
                await API.put(`/errors/update/${editId}`, formattedData);
                showToast("Error ticket updated successfully!", "success");
            } else {
                await API.post("/errors/save", formattedData);
                showToast("Error ticket created successfully!", "success");
            }
            handleModalClose();
            fetchErrors();
        } catch (error) {
            console.error("Error saving error ticket:", error);
            showToast("Failed to save error ticket", "error");
        }
    };

    const handleReopen = async () => {
        if (!reopenReason.trim()) {
            showToast("Please provide a reason for reopening", "error");
            return;
        }
        if (!reopenAssignee) {
            showToast("Please select an assignee for reopening", "error");
            return;
        }
        
        try {
            await API.post(`/errors/reopen/${selectedError.id}?assignedTo=${reopenAssignee}&reason=${encodeURIComponent(reopenReason)}`);
            showToast("Error ticket reopened successfully!", "success");
            setShowReopenModal(false);
            setReopenReason("");
            setReopenAssignee("");
            fetchErrors();
            if (showViewModal) setShowViewModal(false);
        } catch (error) {
            console.error("Error reopening ticket:", error);
            showToast("Failed to reopen error ticket", "error");
        }
    };

    const handleStatusUpdate = async (newStatus) => {
        try {
            const resolvedBy = 1; // TODO: Get from auth context
            await API.put(`/errors/update-status/${selectedError.id}?status=${newStatus}&resolvedBy=${resolvedBy}`);
            showToast(`Status updated to ${newStatus} successfully!`, "success");
            fetchErrors();
            if (showViewModal) setShowViewModal(false);
        } catch (error) {
            console.error("Error updating status:", error);
            showToast("Failed to update status", "error");
        }
    };

    const handleEdit = async (error) => {
        try {
            const res = await API.get(`/errors/getById/${error.id}`);
            const fullError = res.data;
            
            setFormData({
                title: fullError.title || "",
                description: fullError.description || "",
                status: fullError.status || "Open",
                priority: fullError.priority || "Medium",
                clientName: fullError.clientName || "",
                projectId: fullError.projectId || "",
                moduleId: fullError.moduleId || "",
                reportedBy: fullError.reportedBy || "",
                assignedTo: fullError.assignedTo || "",
                errorDate: fullError.errorDate ? fullError.errorDate.split('T')[0] : "",
                solvedDate: fullError.solvedDate ? fullError.solvedDate.split('T')[0] : ""
            });
            
            if (fullError.projectId) await fetchModulesByProject(fullError.projectId);
            
            setEditId(error.id);
            setSelectedError(error);
            setShowModal(true);
        } catch (err) {
            console.error("Error preparing edit form:", err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await API.delete(`/errors/delete/${id}`);
            fetchErrors();
            setShowDeleteModal(false);
            setSelectedError(null);
            showToast("Error ticket deleted successfully!", "success");
        } catch (error) {
            console.error("Error deleting error ticket:", error);
            showToast("Failed to delete error ticket", "error");
        }
    };

    const handleView = async (error) => {
        try {
            const res = await API.get(`/errors/getById/${error.id}`);
            setSelectedError(res.data);
            setShowViewModal(true);
        } catch (err) {
            console.error("Error fetching error details:", err);
            setSelectedError(error);
            setShowViewModal(true);
        }
    };

    const handleConfirmDelete = (error) => {
        setSelectedError(error);
        setShowDeleteModal(true);
    };

    const handleAddNew = () => {
        resetForm();
        setFormData(prev => ({ ...prev, errorDate: new Date().toISOString().split('T')[0] }));
        setEditId(null);
        setSelectedError(null);
        setShowModal(true);
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
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return "Not set";
        return new Date(dateTimeString).toLocaleString();
    };

    const getEmployeeName = (employeeId) => {
        if (!employeeId) return 'N/A';
        const employee = employees.find(e => e.id === employeeId);
        return employee ? employee.name : `Employee #${employeeId}`;
    };

    const getProjectModules = () => {
        if (!formData.projectId) return [];
        return allModules.filter(m => m.projectId === parseInt(formData.projectId));
    };

    const clearProjectFilter = () => {
        setSelectedProject("");
        setPage(1);
    };

    const handlePageChange = (newPage) => setPage(newPage);
    const handlePrevious = () => setPage(prev => Math.max(1, prev - 1));
    const handleNext = () => setPage(prev => Math.min(totalPages, prev + 1));
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
                <button key={1} className="btn btn-outline-secondary btn-sm mx-1" onClick={() => handlePageChange(1)} style={{ fontSize: '0.75rem', minWidth: '35px', borderRadius: '6px' }}>1</button>
            );
            if (startPage > 2) pages.push(<span key="dots1" className="mx-1 text-muted">•••</span>);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button key={i} className={`btn btn-sm mx-1 ${page === i ? 'btn-primary' : 'btn-outline-secondary'}`}
                    onClick={() => handlePageChange(i)} style={{ fontSize: '0.75rem', minWidth: '35px', borderRadius: '6px' }}>
                    {i}
                </button>
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) pages.push(<span key="dots2" className="mx-1 text-muted">•••</span>);
            pages.push(
                <button key={totalPages} className="btn btn-outline-secondary btn-sm mx-1"
                    onClick={() => handlePageChange(totalPages)} style={{ fontSize: '0.75rem', minWidth: '35px', borderRadius: '6px' }}>
                    {totalPages}
                </button>
            );
        }
        return pages;
    };

    return (
        <div className="container-fluid py-3 px-3" style={{ background: '#f8f9fa', minHeight: '100vh' }}>
            
            <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
                <Toast show={toast.show} onClose={() => setToast({ ...toast, show: false })} delay={3000} autohide className="shadow-sm border-0">
                    <Toast.Header className={`${toast.type === 'success' ? 'bg-success' : 'bg-danger'} text-white border-0`}>
                        {toast.type === 'success' ? <FaCheckCircle className="me-2" /> : <FaTimesCircle className="me-2" />}
                        <strong className="me-auto">{toast.type === 'success' ? 'Success!' : 'Error!'}</strong>
                    </Toast.Header>
                    <Toast.Body className="py-2">{toast.message}</Toast.Body>
                </Toast>
            </ToastContainer>

            {/* Page Header */}
            <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <div>
                        <h5 className="mb-0 fw-bold text-dark" style={{ fontSize: '1.1rem' }}>
                            <FaBug className="me-2 text-danger" size={18} />
                            Error & Ticket Management
                        </h5>
                        <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>Track and resolve issues efficiently</p>
                    </div>
                    <Button variant="primary" className="d-flex align-items-center gap-2 px-3 py-1" onClick={handleAddNew} style={{ fontSize: '0.8rem' }}>
                        <FaPlus size={12} /> New Ticket
                    </Button>
                </div>
            </div>

            {/* Main Card */}
            <Card className="shadow-sm border-0" style={{ borderRadius: '10px' }}>
                <Card.Body className="p-2 border-bottom bg-white">
                    <div className="row g-2 align-items-center">
                        <div className="col-md-5">
                            <InputGroup size="sm" style={{ borderRadius: '6px' }}>
                                <Form.Control placeholder="Search by title, description, client..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} style={{ fontSize: '0.75rem' }} />
                                <InputGroup.Text className="bg-white" style={{ fontSize: '0.75rem' }}><FaSearch className="text-muted" size={12} /></InputGroup.Text>
                            </InputGroup>
                        </div>
                        <div className="col-md-4">
                            <Dropdown>
                                <Dropdown.Toggle variant="outline-secondary" size="sm" className="d-flex align-items-center justify-content-between w-100" style={{ fontSize: '0.75rem' }}>
                                    <span className="d-flex align-items-center gap-2"><FaProjectDiagram size={12} />{selectedProject || 'All Projects'}</span>
                                </Dropdown.Toggle>
                                <Dropdown.Menu style={{ fontSize: '0.75rem', width: '100%', maxHeight: '300px', overflowY: 'auto' }}>
                                    <Dropdown.Item onClick={() => { setSelectedProject(""); setPage(1); }}><FaProjectDiagram className="me-2" size={12} />All Projects</Dropdown.Item>
                                    <Dropdown.Divider />
                                    {projectsLoading ? <Dropdown.Item disabled>Loading projects...</Dropdown.Item> : projects.map((project) => (
                                        <Dropdown.Item key={project.id} onClick={() => { setSelectedProject(project.name); setPage(1); }} active={selectedProject === project.name}>{project.name}</Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        <div className="col-md-3 d-flex justify-content-end gap-2">
                            <div className="d-flex align-items-center gap-1">
                                <span className="text-muted" style={{ fontSize: '0.7rem' }}>Show:</span>
                                <Form.Select value={size} onChange={handleSizeChange} size="sm" style={{ width: '65px', fontSize: '0.7rem' }}>
                                    {pageSizeOptions.map(option => (<option key={option} value={option}>{option}</option>))}
                                </Form.Select>
                            </div>
                            {selectedProject && <Button variant="link" size="sm" className="text-danger p-0" onClick={clearProjectFilter} style={{ fontSize: '0.7rem', textDecoration: 'none' }}>Clear</Button>}
                        </div>
                    </div>
                </Card.Body>

                {/* Table Section */}
                <div className="table-responsive">
                    <Table hover className="mb-0" size="sm">
                        <thead className="table-light">
                            <tr>
                                <th style={{ cursor: "pointer", width: "70px" }} onClick={() => handleSort("id")} className="py-2"><div className="d-flex align-items-center gap-1"><span className="fw-semibold text-muted" style={{ fontSize: '0.75rem' }}>ID</span>{getSortIcon("id")}</div></th>
                                <th style={{ cursor: "pointer", minWidth: "220px" }} onClick={() => handleSort("title")} className="py-2"><div className="d-flex align-items-center gap-1"><span className="fw-semibold text-muted" style={{ fontSize: '0.75rem' }}>Error Details</span>{getSortIcon("title")}</div></th>
                                <th style={{ cursor: "pointer", minWidth: "100px" }} onClick={() => handleSort("priority")} className="py-2"><div className="d-flex align-items-center gap-1"><span className="fw-semibold text-muted" style={{ fontSize: '0.75rem' }}>Priority</span>{getSortIcon("priority")}</div></th>
                                <th style={{ cursor: "pointer", minWidth: "120px" }} onClick={() => handleSort("status")} className="py-2"><div className="d-flex align-items-center gap-1"><span className="fw-semibold text-muted" style={{ fontSize: '0.75rem' }}>Status</span>{getSortIcon("status")}</div></th>
                                <th style={{ minWidth: "130px" }} className="py-2"><span className="fw-semibold text-muted" style={{ fontSize: '0.75rem' }}>Project</span></th>
                                <th style={{ minWidth: "120px" }} className="py-2"><span className="fw-semibold text-muted" style={{ fontSize: '0.75rem' }}>Module</span></th>
                                <th style={{ minWidth: "130px" }} className="py-2"><span className="fw-semibold text-muted" style={{ fontSize: '0.75rem' }}>Assigned To</span></th>
                                <th style={{ width: "180px" }} className="text-center py-2"><span className="fw-semibold text-muted" style={{ fontSize: '0.75rem' }}>Actions</span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="8" className="text-center py-4"><Spinner animation="border" variant="primary" size="sm" className="me-2" /><span className="text-muted">Loading error tickets...</span></td></tr>
                            ) : errors.length > 0 ? (
                                errors.map((error, index) => (
                                    <tr key={error.id}>
                                        <td className="py-2"><span className="text-muted">#{error.id}</span></td>
                                        <td className="py-2">
                                            <div className="d-flex align-items-start gap-2">
                                                <div className="rounded-circle d-flex align-items-center justify-content-center text-white shadow-sm flex-shrink-0" style={{ width: '36px', height: '36px', background: getAvatarColor(index), fontSize: '0.8rem', fontWeight: '600', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}><FaBug size={16} /></div>
                                                <div><div className="fw-semibold" style={{ fontSize: '0.85rem' }}>{error.title}</div><small className="text-muted" style={{ fontSize: '0.65rem' }}>{error.description && error.description.length > 50 ? `${error.description.substring(0, 50)}...` : error.description || 'No description'}</small></div>
                                            </div>
                                        </td>
                                        <td className="py-2 align-middle"><Badge bg={priorityColors[error.priority] || "secondary"} className="px-2 py-1" style={{ fontWeight: '500', fontSize: '0.7rem', borderRadius: '6px' }}><FaFlag size={10} className="me-1" />{error.priority || 'Medium'}</Badge></td>
                                        <td className="py-2 align-middle"><Badge bg={statusColors[error.status] || "secondary"} className="d-inline-flex align-items-center px-2 py-1" style={{ fontWeight: '500', fontSize: '0.7rem', borderRadius: '6px' }}>{statusIcons[error.status]}{error.status || 'Open'}</Badge></td>
                                        <td className="py-2 align-middle"><div className="d-flex align-items-center gap-2"><FaProjectDiagram size={12} className="text-muted" /><span style={{ fontSize: '0.8rem' }}>{getProjectName(error.projectId)}</span></div></td>
                                        <td className="py-2 align-middle"><span style={{ fontSize: '0.8rem' }}>{getModuleName(error.moduleId)}</span></td>
                                        <td className="py-2 align-middle"><div className="d-flex align-items-center gap-2"><FaUserCheck size={12} className="text-success" /><span style={{ fontSize: '0.8rem' }}>{getEmployeeName(error.assignedTo)}</span></div></td>
                                        <td className="py-2 align-middle">
                                            <div className="d-flex justify-content-center gap-2">
                                                <Button variant="outline-info" size="sm" className="d-flex align-items-center gap-1 px-2 py-1" onClick={() => handleView(error)} style={{ fontSize: '0.7rem', borderRadius: '6px' }}><FaEye size={11} /><span>View</span></Button>
                                                <Button variant="outline-warning" size="sm" className="d-flex align-items-center gap-1 px-2 py-1" onClick={() => handleEdit(error)} style={{ fontSize: '0.7rem', borderRadius: '6px' }}><FaEdit size={11} /><span>Edit</span></Button>
                                                <Button variant="outline-danger" size="sm" className="d-flex align-items-center gap-1 px-2 py-1" onClick={() => handleConfirmDelete(error)} style={{ fontSize: '0.7rem', borderRadius: '6px' }}><FaTrash size={11} /><span>Delete</span></Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="8" className="text-center py-4"><div className="text-muted"><FaBug size={40} className="mb-2 opacity-25" /><p className="mb-0">No error tickets found</p></div></td></tr>
                            )}
                        </tbody>
                    </Table>
                </div>

                {errors.length > 0 && (
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
            <Modal show={showModal} onHide={handleModalClose} centered size="lg">
                <Modal.Header closeButton className="border-0 pb-0 pt-3 px-4">
                    <div className="d-flex align-items-center gap-2">
                        <div className="rounded-circle p-2" style={{ background: editId ? '#ffc10720' : '#0d6efd20' }}>{editId ? <FaEdit size={20} className="text-warning" /> : <FaPlus size={20} className="text-primary" />}</div>
                        <Modal.Title className="fw-semibold" style={{ fontSize: '1.1rem' }}>{editId ? "Edit Error Ticket" : "Create New Error Ticket"}</Modal.Title>
                    </div>
                </Modal.Header>
                <Modal.Body className="px-4 py-3">
                    <Form>
                        <Form.Group className="mb-3"><Form.Label className="small fw-semibold text-secondary mb-1">Title <span className="text-danger">*</span></Form.Label><Form.Control value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Enter error title" style={{ fontSize: '0.85rem', borderRadius: '8px' }} isInvalid={!!formErrors.title} /><Form.Control.Feedback type="invalid">{formErrors.title}</Form.Control.Feedback></Form.Group>
                        <Form.Group className="mb-3"><Form.Label className="small fw-semibold text-secondary mb-1">Description <span className="text-danger">*</span></Form.Label><Form.Control as="textarea" rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Describe the error in detail..." style={{ fontSize: '0.85rem', borderRadius: '8px' }} isInvalid={!!formErrors.description} /><Form.Control.Feedback type="invalid">{formErrors.description}</Form.Control.Feedback></Form.Group>
                        <div className="row">
                            <div className="col-md-6"><Form.Group className="mb-3"><Form.Label className="small fw-semibold text-secondary mb-1">Priority</Form.Label><Form.Select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} style={{ fontSize: '0.85rem', borderRadius: '8px' }}><option value="High">High</option><option value="Medium">Medium</option><option value="Low">Low</option></Form.Select></Form.Group></div>
                            <div className="col-md-6"><Form.Group className="mb-3"><Form.Label className="small fw-semibold text-secondary mb-1">Status</Form.Label><Form.Select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} style={{ fontSize: '0.85rem', borderRadius: '8px' }}><option value="Open">Open</option><option value="In Progress">In Progress</option><option value="Resolved">Resolved</option><option value="Closed">Closed</option></Form.Select></Form.Group></div>
                        </div>
                        <div className="row">
                            <div className="col-md-6"><Form.Group className="mb-3"><Form.Label className="small fw-semibold text-secondary mb-1">Project</Form.Label><Form.Select value={formData.projectId} onChange={(e) => handleProjectChange(e.target.value)} style={{ fontSize: '0.85rem', borderRadius: '8px' }} disabled={projectsLoading}><option value="">Select Project</option>{projects.map((project) => (<option key={project.id} value={project.id}>{project.name}</option>))}</Form.Select></Form.Group></div>
                            <div className="col-md-6"><Form.Group className="mb-3"><Form.Label className="small fw-semibold text-secondary mb-1">Module</Form.Label><Form.Select value={formData.moduleId} onChange={(e) => handleModuleChange(e.target.value)} style={{ fontSize: '0.85rem', borderRadius: '8px' }} disabled={modulesLoading || !formData.projectId}>
                                <option value="">Select Module</option>
                                {getProjectModules().map((module) => (<option key={module.id} value={module.id}>{module.name} {module.moduleLead ? `(Lead: ${getEmployeeName(module.moduleLead)})` : '(No Lead)'}</option>))}
                            </Form.Select>{!formData.projectId && <small className="text-muted" style={{ fontSize: '0.7rem' }}>Please select a project first</small>}</Form.Group></div>
                        </div>
                        <div className="row">
                            <div className="col-md-6"><Form.Group className="mb-3"><Form.Label className="small fw-semibold text-secondary mb-1">Assign To (Resolver)</Form.Label><Form.Select value={formData.assignedTo} onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })} style={{ fontSize: '0.85rem', borderRadius: '8px' }}><option value="">Select Assignee</option>{activeEmployees.map((emp) => (<option key={emp.id} value={emp.id}>{emp.name}</option>))}</Form.Select></Form.Group></div>
                            <div className="col-md-6"><Form.Group className="mb-3"><Form.Label className="small fw-semibold text-secondary mb-1">Reported By</Form.Label><Form.Select value={formData.reportedBy} onChange={(e) => setFormData({ ...formData, reportedBy: e.target.value })} style={{ fontSize: '0.85rem', borderRadius: '8px' }}><option value="">Select Employee</option>{employees.map((employee) => (<option key={employee.id} value={employee.id}>{employee.name}</option>))}</Form.Select></Form.Group></div>
                        </div>
                        <div className="row">
                            <div className="col-md-6"><Form.Group className="mb-3"><Form.Label className="small fw-semibold text-secondary mb-1">Error Date</Form.Label><Form.Control type="date" value={formData.errorDate} onChange={(e) => setFormData({ ...formData, errorDate: e.target.value })} style={{ fontSize: '0.85rem', borderRadius: '8px' }} /></Form.Group></div>
                            <div className="col-md-6"><Form.Group className="mb-3"><Form.Label className="small fw-semibold text-secondary mb-1">Client Name</Form.Label><Form.Control value={formData.clientName} onChange={(e) => setFormData({ ...formData, clientName: e.target.value })} placeholder="Enter client name" style={{ fontSize: '0.85rem', borderRadius: '8px' }} /></Form.Group></div>
                        </div>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="border-0 pt-0 pb-3 px-4">
                    <Button variant="light" onClick={handleModalClose} size="sm" className="px-3" style={{ fontSize: '0.8rem' }}>Cancel</Button>
                    <Button variant={editId ? "warning" : "primary"} onClick={handleSave} size="sm" className="px-3" style={{ fontSize: '0.8rem' }}>{editId ? "Update Ticket" : "Create Ticket"}</Button>
                </Modal.Footer>
            </Modal>

            {/* View Modal with Tabs */}
            <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered size="lg">
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-semibold" style={{ fontSize: '1rem' }}><FaBug className="me-2 text-danger" size={16} />Error Ticket Details</Modal.Title>
                </Modal.Header>
                <Modal.Body className="pt-0">
                    {selectedError && (
                        <div>
                            <div className="text-center mb-4">
                                <div className="rounded-circle d-flex align-items-center justify-content-center text-white mx-auto mb-2 shadow-sm" style={{ width: '70px', height: '70px', background: getAvatarColor(0), fontSize: '1.5rem', fontWeight: '600' }}><FaBug size={30} /></div>
                                <h5 className="mb-1 fw-bold">{selectedError.title}</h5>
                                <div className="d-flex gap-2 justify-content-center mt-2">
                                    <Badge bg={priorityColors[selectedError.priority] || "secondary"}>{selectedError.priority || 'Medium'} Priority</Badge>
                                    <Badge bg={statusColors[selectedError.status] || "secondary"}>{statusIcons[selectedError.status]} {selectedError.status || 'Open'}</Badge>
                                    {selectedError.reopenCount > 0 && <Badge bg="warning" className="text-dark">Reopened {selectedError.reopenCount} times</Badge>}
                                </div>
                                <p className="text-muted mt-2 mb-0">Ticket ID: {selectedError.id}</p>
                            </div>
                            
                            <Tab.Container defaultActiveKey="details">
                                <Nav variant="tabs" className="mb-3">
                                    <Nav.Item><Nav.Link eventKey="details" className="d-flex align-items-center gap-1"><FaBug size={12} /> Details</Nav.Link></Nav.Item>
                                    <Nav.Item><Nav.Link eventKey="history" className="d-flex align-items-center gap-1"><FaHistory size={12} /> History</Nav.Link></Nav.Item>
                                </Nav>
                                <Tab.Content>
                                    <Tab.Pane eventKey="details">
                                        <div className="row mb-3">
                                            <div className="col-md-6"><div className="bg-light p-3 rounded"><strong>Reported By</strong><p className="mt-2 mb-0">{getEmployeeName(selectedError.reportedBy)}</p></div></div>
                                            <div className="col-md-6"><div className="bg-light p-3 rounded"><strong>Assigned To</strong><p className="mt-2 mb-0">{getEmployeeName(selectedError.assignedTo)}</p></div></div>
                                        </div>
                                        <div className="row mb-3">
                                            <div className="col-md-6"><div className="bg-light p-3 rounded"><strong>Project</strong><p className="mt-2 mb-0">{getProjectName(selectedError.projectId)}</p></div></div>
                                            <div className="col-md-6"><div className="bg-light p-3 rounded"><strong>Module</strong><p className="mt-2 mb-0">{getModuleName(selectedError.moduleId)}</p></div></div>
                                        </div>
                                        <div className="mb-3"><div className="bg-light p-3 rounded"><strong>Description</strong><p className="mt-2 mb-0">{selectedError.description || 'No description available'}</p></div></div>
                                        <div className="row">
                                            <div className="col-md-6"><div className="bg-light p-3 rounded"><strong>Client</strong><p className="mt-2 mb-0">{selectedError.clientName || 'N/A'}</p></div></div>
                                            <div className="col-md-6"><div className="bg-light p-3 rounded"><strong>Resolved By</strong><p className="mt-2 mb-0">{getEmployeeName(selectedError.resolvedBy)}</p></div></div>
                                        </div>
                                        <div className="row mt-3">
                                            <div className="col-md-6"><div className="bg-light p-3 rounded"><strong>Error Date</strong><p className="mt-2 mb-0">{formatDate(selectedError.errorDate)}</p></div></div>
                                            <div className="col-md-6"><div className="bg-light p-3 rounded"><strong>Solved Date</strong><p className="mt-2 mb-0">{formatDate(selectedError.solvedDate)}</p></div></div>
                                        </div>
                                    </Tab.Pane>
                                 <Tab.Pane eventKey="history">
    <div className="table-responsive">
        <Table size="sm" hover>
            <thead className="table-light">
                <tr>
                    <th>Date</th>
                    <th>Action</th>
                    <th>Changed By</th>
                    <th>Description</th>
                    <th>Status Change</th>
                </tr>
            </thead>
            <tbody>
                {selectedError.history && selectedError.history.length > 0 ? (
                    selectedError.history.map((h, idx) => (
                        <tr key={idx}>
                            <td className="text-nowrap" style={{ fontSize: '0.75rem' }}>{formatDateTime(h.changedAt)}</td>
                            <td><Badge bg={h.action === 'CREATED' ? 'primary' : h.action === 'REOPENED' ? 'warning' : h.action === 'RESOLVED' ? 'success' : h.action === 'CLOSED' ? 'secondary' : 'info'} style={{ fontSize: '0.7rem' }}>{h.action}</Badge></td>
                            <td style={{ fontSize: '0.8rem' }}>{getEmployeeName(h.changedBy)}</td>
                            <td style={{ fontSize: '0.8rem' }}>{h.description}</td>
                            <td style={{ fontSize: '0.75rem' }}>{h.oldStatus || '-'} → {h.newStatus || '-'}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="5" className="text-center text-muted py-3">No history available</td>
                    </tr>
                )}
            </tbody>
        </Table>
    </div>
    {selectedError.reopenCount > 0 && <div className="mt-2 text-center"><small className="text-muted">Total reopen count: {selectedError.reopenCount}</small></div>}
</Tab.Pane>
                                </Tab.Content>
                            </Tab.Container>
                            
                            {/* Status Action Buttons */}
                            <div className="mt-3 d-flex justify-content-center gap-2">
                                {selectedError.status !== 'Resolved' && selectedError.status !== 'Closed' && (
                                    <Button variant="success" size="sm" onClick={() => handleStatusUpdate('Resolved')}><FaCheckDouble className="me-1" />Mark Resolved</Button>
                                )}
                                {selectedError.status === 'Resolved' && (
                                    <Button variant="success" size="sm" onClick={() => handleStatusUpdate('Closed')}><FaCheckCircle className="me-1" />Close Ticket</Button>
                                )}
                                {(selectedError.status === 'Resolved' || selectedError.status === 'Closed') && (
                                    <Button variant="warning" size="sm" onClick={() => { setShowViewModal(false); setShowReopenModal(true); }}><FaRedoAlt className="me-1" />Reopen Ticket</Button>
                                )}
                            </div>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer className="border-0">
                    <Button variant="secondary" size="sm" onClick={() => setShowViewModal(false)}>Close</Button>
                </Modal.Footer>
            </Modal>

            {/* Reopen Modal */}
            <Modal show={showReopenModal} onHide={() => { setShowReopenModal(false); setReopenReason(""); setReopenAssignee(""); }} centered>
                <Modal.Header closeButton className="border-0 pb-0">
                    <div className="d-flex align-items-center gap-2"><div className="rounded-circle p-2 bg-warning bg-opacity-10"><FaRedoAlt size={20} className="text-warning" /></div><Modal.Title className="fw-semibold">Reopen Error Ticket</Modal.Title></div>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label className="small fw-semibold text-secondary mb-1">Assign To <span className="text-danger">*</span></Form.Label>
                        <Form.Select value={reopenAssignee} onChange={(e) => setReopenAssignee(e.target.value)} style={{ fontSize: '0.85rem', borderRadius: '8px' }}>
                            <option value="">Select Assignee</option>
                            {activeEmployees.map((emp) => (<option key={emp.id} value={emp.id}>{emp.name}</option>))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label className="small fw-semibold text-secondary mb-1">Reason for Reopening <span className="text-danger">*</span></Form.Label>
                        <Form.Control as="textarea" rows={3} value={reopenReason} onChange={(e) => setReopenReason(e.target.value)} placeholder="Please provide the reason why this error is being reopened..." style={{ fontSize: '0.85rem', borderRadius: '8px' }} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer className="border-0 justify-content-center">
                    <Button variant="light" size="sm" onClick={() => { setShowReopenModal(false); setReopenReason(""); setReopenAssignee(""); }}>Cancel</Button>
                    <Button variant="warning" size="sm" onClick={handleReopen}><FaRedoAlt className="me-1" />Reopen Ticket</Button>
                </Modal.Footer>
            </Modal>

            {/* Delete Modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton className="border-0 pb-0">
                    <div className="d-flex align-items-center gap-2"><div className="rounded-circle p-2 bg-danger bg-opacity-10"><FaTrash size={20} className="text-danger" /></div><Modal.Title className="fw-semibold">Delete Error Ticket</Modal.Title></div>
                </Modal.Header>
                <Modal.Body className="text-center pt-3">
                    {selectedError && (<><div className="rounded-circle d-flex align-items-center justify-content-center text-white mx-auto mb-2 shadow-sm" style={{ width: '50px', height: '50px', background: getAvatarColor(0), fontSize: '1rem' }}><FaBug size={20} /></div><h6 className="mb-1 fw-bold">{selectedError.title}</h6><div className="d-flex gap-2 justify-content-center mb-3"><Badge bg={priorityColors[selectedError.priority] || "secondary"}>{selectedError.priority || 'Medium'}</Badge><Badge bg={statusColors[selectedError.status] || "secondary"}>{selectedError.status || 'Open'}</Badge></div><p className="mb-0">Are you sure you want to delete this error ticket?</p><small className="text-muted">This action cannot be undone.</small></>)}
                </Modal.Body>
                <Modal.Footer className="border-0 justify-content-center">
                    <Button variant="light" size="sm" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
                    <Button variant="danger" size="sm" onClick={() => handleDelete(selectedError?.id)}>Yes, Delete</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ErrorTicketPage;