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
//     const [search, setSearch] = useState("");
//     const [page, setPage] = useState(1);
//     const [size, setSize] = useState(5);
//     const [totalPages, setTotalPages] = useState(1);
//     const [totalRecords, setTotalRecords] = useState(0);
//     const [loading, setLoading] = useState(false);

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
//         errordate: "",
//         solved: "",
//         projectId: "",
//         priority: "Medium",
//         clientName: ""
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

//     useEffect(() => {
//         fetchErrors();
//     }, [page, size, search, sortBy, sortDir]);

//     // 🧾 Handle Input
//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     // 💾 Save Error
//     const handleSave = async () => {
//         try {
//             // Format date to YYYY-MM-DD
//             const formattedData = {
//                 ...formData,
//                 errordate: formData.errordate || new Date().toISOString().split('T')[0],
//                 projectId: formData.projectId ? parseInt(formData.projectId) : null,
//                 solved: formData.solved || null
//             };

//             await API.post("/errors/save", formattedData);
//             setShowModal(false);
//             setFormData({
//                 title: "",
//                 description: "",
//                 status: "Open",
//                 errordate: "",
//                 solved: "",
//                 projectId: "",
//                 priority: "Medium",
//                 clientName: ""
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
//                 ...formData,
//                 projectId: formData.projectId ? parseInt(formData.projectId) : null,
//                 solved: formData.solved || null
//             };

//             await API.put(`/errors/update/${selectedError.id}`, formattedData);
//             setShowModal(false);
//             setFormData({
//                 title: "",
//                 description: "",
//                 status: "Open",
//                 errordate: "",
//                 solved: "",
//                 projectId: "",
//                 priority: "Medium",
//                 clientName: ""
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
//             errordate: new Date().toISOString().split('T')[0],
//             solved: "",
//             projectId: "",
//             priority: "Medium",
//             clientName: ""
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
//             errordate: error.errordate,
//             solved: error.solved || "",
//             projectId: error.projectId || "",
//             priority: error.priority,
//             clientName: error.clientName
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
//                                         style={{ cursor: "pointer", minWidth: "120px" }}
//                                         onClick={() => handleSort("errordate")}
//                                         className="py-2"
//                                     >
//                                         <div className="d-flex align-items-center justify-content-between">
//                                             <span className="fw-semibold text-muted" style={{ fontSize: '0.8rem' }}>Reported Date</span>
//                                             {getSortIcon("errordate")}
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
//                                         <td colSpan="7" className="text-center py-4">
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
//                                                     {formatDate(error.errordate)}
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
//                                         <td colSpan="7" className="text-center py-4">
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
//                                         name="errordate"
//                                         value={formData.errordate}
//                                         onChange={handleChange}
//                                         style={{ fontSize: '0.85rem' }}
//                                     />
//                                 </Form.Group>
//                             </div>
//                         </div>

//                         <div className="row">
//                             <div className="col-md-6">
//                                 <Form.Group className="mb-3">
//                                     <Form.Label style={{ fontSize: '0.85rem' }}>Solved Date</Form.Label>
//                                     <Form.Control
//                                         type="date"
//                                         name="solved"
//                                         value={formData.solved}
//                                         onChange={handleChange}
//                                         style={{ fontSize: '0.85rem' }}
//                                     />
//                                 </Form.Group>
//                             </div>
//                             <div className="col-md-6">
//                                 <Form.Group className="mb-3">
//                                     <Form.Label style={{ fontSize: '0.85rem' }}>Project ID</Form.Label>
//                                     <Form.Control
//                                         type="number"
//                                         name="projectId"
//                                         value={formData.projectId}
//                                         onChange={handleChange}
//                                         placeholder="Enter project ID"
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
//                                         <strong>Project ID:</strong> {selectedError.projectId || 'N/A'}
//                                     </div>
//                                     <div className="mb-2" style={{ fontSize: '0.85rem' }}>
//                                         <strong>Reported Date:</strong> {formatDate(selectedError.errordate)}
//                                     </div>
//                                     {selectedError.solved && (
//                                         <div className="mb-2" style={{ fontSize: '0.85rem' }}>
//                                             <strong>Solved Date:</strong> {formatDate(selectedError.solved)}
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
//                                     Priority: {selectedError.priority} | Status: {selectedError.status}
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
    FaEllipsisH,
    FaExclamationTriangle,
    FaCheckCircle,
    FaClock
} from "react-icons/fa";

const ErrorTicketPage = () => {
    const [errors, setErrors] = useState([]);
    const [projects, setProjects] = useState([]);
    const [modules, setModules] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [search, setSearch] = useState("");
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
    const [selectedError, setSelectedError] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        status: "Open",
        priority: "Medium",
        clientName: "",
        projectId: "",
        moduleId: "",
        reportedBy: "",
        errorDate: "",
        solvedDate: ""
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
        "Open": "danger",
        "In Progress": "warning",
        "Resolved": "success",
        "Closed": "secondary"
    };

    // Status icons
    const statusIcons = {
        "Open": <FaExclamationTriangle className="me-1" />,
        "In Progress": <FaClock className="me-1" />,
        "Resolved": <FaCheckCircle className="me-1" />,
        "Closed": <FaCheckCircle className="me-1" />
    };

    // 🔍 Fetch Errors with Pagination + Search + Sorting
    const fetchErrors = async () => {
        setLoading(true);
        try {
            const res = await API.get(
                `/errors/smart?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}&search=${search}`
            );
            setErrors(res.data.results || []);
            setTotalPages(res.data.totalPages || 1);
            setTotalRecords(res.data.totalRecords || 0);
        } catch (error) {
            console.error("Error fetching errors:", error);
        } finally {
            setLoading(false);
        }
    };

    // 🏗️ Fetch Projects for Dropdown
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

    // 🏗️ Fetch Modules for Dropdown
    const fetchModules = async () => {
        setModulesLoading(true);
        try {
            const res = await API.get('/modules/smart?page=1&size=100');
            setModules(res.data.results || res.data || []);
        } catch (error) {
            console.error("Error fetching modules:", error);
        } finally {
            setModulesLoading(false);
        }
    };

    // 👥 Fetch Employees for Dropdown
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
        fetchErrors();
        fetchProjects();
        fetchModules();
        fetchEmployees();
    }, [page, size, search, sortBy, sortDir]);

    // 🧾 Handle Input
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 💾 Save Error
    const handleSave = async () => {
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
                errorDate: formData.errorDate || new Date().toISOString().split('T')[0],
                solvedDate: formData.solvedDate || null
            };

            await API.post("/errors/save", formattedData);
            setShowModal(false);
            setFormData({
                title: "",
                description: "",
                status: "Open",
                priority: "Medium",
                clientName: "",
                projectId: "",
                moduleId: "",
                reportedBy: "",
                errorDate: "",
                solvedDate: ""
            });
            fetchErrors();
        } catch (error) {
            console.error("Error saving error ticket:", error);
        }
    };

    // ✏️ Update Error
    const handleUpdate = async () => {
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
                errorDate: formData.errorDate,
                solvedDate: formData.solvedDate || null
            };

            await API.put(`/errors/update/${selectedError.id}`, formattedData);
            setShowModal(false);
            setFormData({
                title: "",
                description: "",
                status: "Open",
                priority: "Medium",
                clientName: "",
                projectId: "",
                moduleId: "",
                reportedBy: "",
                errorDate: "",
                solvedDate: ""
            });
            setSelectedError(null);
            fetchErrors();
        } catch (error) {
            console.error("Error updating error ticket:", error);
        }
    };

    // 🗑️ Delete Error
    const handleDelete = async () => {
        try {
            await API.delete(`/errors/delete/${selectedError.id}`);
            setShowDeleteModal(false);
            setSelectedError(null);
            fetchErrors();
        } catch (error) {
            console.error("Error deleting error ticket:", error);
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

    // ➕ Add New Error
    const handleAddNew = () => {
        setFormData({
            title: "",
            description: "",
            status: "Open",
            priority: "Medium",
            clientName: "",
            projectId: "",
            moduleId: "",
            reportedBy: "",
            errorDate: new Date().toISOString().split('T')[0],
            solvedDate: ""
        });
        setSelectedError(null);
        setShowModal(true);
    };

    // ✏️ Edit Error
    const handleEdit = (error) => {
        setSelectedError(error);
        setFormData({
            title: error.title,
            description: error.description,
            status: error.status,
            priority: error.priority,
            clientName: error.clientName,
            projectId: error.projectId || "",
            moduleId: error.moduleId || "",
            reportedBy: error.reportedBy || "",
            errorDate: error.errorDate || error.errordate || "",
            solvedDate: error.solvedDate || error.solved || ""
        });
        setShowModal(true);
    };

    // 👁️ View Error
    const handleView = (error) => {
        setSelectedError(error);
        setShowViewModal(true);
    };

    // 🗑️ Confirm Delete
    const handleConfirmDelete = (error) => {
        setSelectedError(error);
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

    // Format date for display
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
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
                            <h5 className="mb-0 text-dark fw-bold" style={{ fontSize: '1.1rem' }}>Error & Ticket Management</h5>
                            <small className="text-muted" style={{ fontSize: '0.75rem' }}>Track and resolve issues efficiently</small>
                        </div>
                        <Button
                            variant="primary"
                            className="d-flex align-items-center gap-2 px-3"
                            onClick={handleAddNew}
                            style={{ fontSize: '0.8rem' }}
                        >
                            <FaPlus size={12} />
                            New Ticket
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
                                        placeholder="Search by title, description, client..."
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
                                        <Dropdown.Item>Open Tickets</Dropdown.Item>
                                        <Dropdown.Item>In Progress</Dropdown.Item>
                                        <Dropdown.Item>Resolved Tickets</Dropdown.Item>
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
                                        style={{ cursor: "pointer", minWidth: "200px" }}
                                        onClick={() => handleSort("title")}
                                        className="py-2"
                                    >
                                        <div className="d-flex align-items-center justify-content-between">
                                            <span className="fw-semibold text-muted" style={{ fontSize: '0.8rem' }}>Error Title</span>
                                            {getSortIcon("title")}
                                        </div>
                                    </th>
                                    <th
                                        style={{ cursor: "pointer", minWidth: "120px" }}
                                        onClick={() => handleSort("priority")}
                                        className="py-2"
                                    >
                                        <div className="d-flex align-items-center justify-content-between">
                                            <span className="fw-semibold text-muted" style={{ fontSize: '0.8rem' }}>Priority</span>
                                            {getSortIcon("priority")}
                                        </div>
                                    </th>
                                    <th
                                        style={{ cursor: "pointer", minWidth: "130px" }}
                                        onClick={() => handleSort("status")}
                                        className="py-2"
                                    >
                                        <div className="d-flex align-items-center justify-content-between">
                                            <span className="fw-semibold text-muted" style={{ fontSize: '0.8rem' }}>Status</span>
                                            {getSortIcon("status")}
                                        </div>
                                    </th>
                                    <th
                                        style={{ cursor: "pointer", minWidth: "150px" }}
                                        onClick={() => handleSort("projectId")}
                                        className="py-2"
                                    >
                                        <div className="d-flex align-items-center justify-content-between">
                                            <span className="fw-semibold text-muted" style={{ fontSize: '0.8rem' }}>Project</span>
                                            {getSortIcon("projectId")}
                                        </div>
                                    </th>
                                    <th
                                        style={{ cursor: "pointer", minWidth: "150px" }}
                                        onClick={() => handleSort("moduleId")}
                                        className="py-2"
                                    >
                                        <div className="d-flex align-items-center justify-content-between">
                                            <span className="fw-semibold text-muted" style={{ fontSize: '0.8rem' }}>Module</span>
                                            {getSortIcon("moduleId")}
                                        </div>
                                    </th>
                                    <th
                                        style={{ cursor: "pointer", minWidth: "150px" }}
                                        onClick={() => handleSort("clientName")}
                                        className="py-2"
                                    >
                                        <div className="d-flex align-items-center justify-content-between">
                                            <span className="fw-semibold text-muted" style={{ fontSize: '0.8rem' }}>Client</span>
                                            {getSortIcon("clientName")}
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
                                                <span className="text-muted" style={{ fontSize: '0.8rem' }}>Loading error tickets...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : errors.length > 0 ? (
                                    errors.map((error) => (
                                        <tr key={error.id} className="border-bottom">
                                            <td className="py-2">
                                                <span className="text-muted fw-medium" style={{ fontSize: '0.8rem' }}>#{error.id}</span>
                                            </td>
                                            <td className="py-2">
                                                <div>
                                                    <div className="fw-semibold text-dark" style={{ fontSize: '0.85rem' }}>{error.title}</div>
                                                    <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                                                        {error.description && error.description.length > 50
                                                            ? `${error.description.substring(0, 50)}...`
                                                            : error.description}
                                                    </small>
                                                </div>
                                            </td>
                                            <td className="py-2">
                                                <Badge
                                                    bg={priorityColors[error.priority] || "secondary"}
                                                    className="px-2 py-1"
                                                    style={{ fontWeight: '500', fontSize: '0.75rem' }}
                                                >
                                                    {error.priority}
                                                </Badge>
                                            </td>
                                            <td className="py-2">
                                                <Badge
                                                    bg={statusColors[error.status] || "secondary"}
                                                    className="d-flex align-items-center px-2 py-1"
                                                    style={{ fontWeight: '500', fontSize: '0.75rem', width: 'fit-content' }}
                                                >
                                                    {statusIcons[error.status]}
                                                    {error.status}
                                                </Badge>
                                            </td>
                                            <td className="py-2">
                                                <span className="text-dark" style={{ fontSize: '0.8rem' }}>
                                                    {getProjectName(error.projectId)}
                                                </span>
                                            </td>
                                            <td className="py-2">
                                                <span className="text-dark" style={{ fontSize: '0.8rem' }}>
                                                    {getModuleName(error.moduleId)}
                                                </span>
                                            </td>
                                            <td className="py-2">
                                                <span className="text-dark" style={{ fontSize: '0.8rem' }}>
                                                    {error.clientName || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="py-2">
                                                <div className="d-flex justify-content-center gap-1">
                                                    <Button
                                                        variant="outline-primary"
                                                        size="sm"
                                                        className="d-flex align-items-center px-2"
                                                        onClick={() => handleView(error)}
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
                                                        onClick={() => handleEdit(error)}
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
                                                            <Dropdown.Item onClick={() => handleView(error)} style={{ fontSize: '0.8rem' }}>
                                                                <FaEye className="me-2 text-primary" size={10} />
                                                                View Details
                                                            </Dropdown.Item>
                                                            <Dropdown.Item onClick={() => handleEdit(error)} style={{ fontSize: '0.8rem' }}>
                                                                <FaEdit className="me-2 text-warning" size={10} />
                                                                Edit Ticket
                                                            </Dropdown.Item>
                                                            <Dropdown.Divider />
                                                            <Dropdown.Item className="text-danger" onClick={() => handleConfirmDelete(error)} style={{ fontSize: '0.8rem' }}>
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
                                                <h6 className="mb-2" style={{ fontSize: '0.9rem' }}>No error tickets found</h6>
                                                <p className="mb-0" style={{ fontSize: '0.8rem' }}>
                                                    {search ? 'Try adjusting your search terms' : 'Get started by creating your first error ticket'}
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>

                    {/* Pagination Section */}
                    {errors.length > 0 && (
                        <div className="p-2 border-top bg-light">
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                                        Showing <strong>{((page - 1) * size) + 1}-{Math.min(page * size, totalRecords)}</strong> of <strong>{totalRecords}</strong> tickets
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
            <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title style={{ fontSize: '1rem' }}>
                        {selectedError ? "Edit Error Ticket" : "Create New Error Ticket"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label style={{ fontSize: '0.85rem' }}>Title <span className="text-danger">*</span></Form.Label>
                                    <Form.Control
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="Enter error title"
                                        style={{ fontSize: '0.85rem' }}
                                    />
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label style={{ fontSize: '0.85rem' }}>Priority <span className="text-danger">*</span></Form.Label>
                                    <Form.Select
                                        name="priority"
                                        value={formData.priority}
                                        onChange={handleChange}
                                        style={{ fontSize: '0.85rem' }}
                                    >
                                        <option value="High">High</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Low">Low</option>
                                    </Form.Select>
                                </Form.Group>
                            </div>
                        </div>

                        <Form.Group className="mb-3">
                            <Form.Label style={{ fontSize: '0.85rem' }}>Description <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe the error in detail..."
                                style={{ fontSize: '0.85rem' }}
                            />
                        </Form.Group>

                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label style={{ fontSize: '0.85rem' }}>Status</Form.Label>
                                    <Form.Select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        style={{ fontSize: '0.85rem' }}
                                    >
                                        <option value="Open">Open</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Resolved">Resolved</option>
                                        <option value="Closed">Closed</option>
                                    </Form.Select>
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label style={{ fontSize: '0.85rem' }}>Error Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="errorDate"
                                        value={formData.errorDate}
                                        onChange={handleChange}
                                        style={{ fontSize: '0.85rem' }}
                                    />
                                </Form.Group>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label style={{ fontSize: '0.85rem' }}>Project <span className="text-danger">*</span></Form.Label>
                                    <Form.Select
                                        name="projectId"
                                        value={formData.projectId}
                                        onChange={handleChange}
                                        style={{ fontSize: '0.85rem' }}
                                        disabled={projectsLoading}
                                    >
                                        <option value="">Select Project</option>
                                        {projects.map((project) => (
                                            <option key={project.id} value={project.id}>
                                                {project.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    {projectsLoading && (
                                        <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                                            Loading projects...
                                        </small>
                                    )}
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label style={{ fontSize: '0.85rem' }}>Module</Form.Label>
                                    <Form.Select
                                        name="moduleId"
                                        value={formData.moduleId}
                                        onChange={handleChange}
                                        style={{ fontSize: '0.85rem' }}
                                        disabled={modulesLoading}
                                    >
                                        <option value="">Select Module</option>
                                        {modules.map((module) => (
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
                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label style={{ fontSize: '0.85rem' }}>Reported By <span className="text-danger">*</span></Form.Label>
                                    <Form.Select
                                        name="reportedBy"
                                        value={formData.reportedBy}
                                        onChange={handleChange}
                                        style={{ fontSize: '0.85rem' }}
                                        disabled={employeesLoading}
                                    >
                                        <option value="">Select Employee</option>
                                        {employees.map((employee) => (
                                            <option key={employee.id} value={employee.id}>
                                                {employee.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                    {employeesLoading && (
                                        <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                                            Loading employees...
                                        </small>
                                    )}
                                </Form.Group>
                            </div>
                            <div className="col-md-6">
                                <Form.Group className="mb-3">
                                    <Form.Label style={{ fontSize: '0.85rem' }}>Solved Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="solvedDate"
                                        value={formData.solvedDate}
                                        onChange={handleChange}
                                        style={{ fontSize: '0.85rem' }}
                                    />
                                </Form.Group>
                            </div>
                        </div>

                        <Form.Group className="mb-3">
                            <Form.Label style={{ fontSize: '0.85rem' }}>Client Name</Form.Label>
                            <Form.Control
                                name="clientName"
                                value={formData.clientName}
                                onChange={handleChange}
                                placeholder="Enter client name"
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
                        onClick={selectedError ? handleUpdate : handleSave}
                        style={{ fontSize: '0.8rem' }}
                    >
                        {selectedError ? "Update Ticket" : "Create Ticket"}
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title style={{ fontSize: '1rem' }}>Error Ticket Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedError && (
                        <div>
                            <div className="d-flex justify-content-between align-items-start mb-3">
                                <div>
                                    <h5 className="mb-1" style={{ fontSize: '1rem' }}>{selectedError.title}</h5>
                                    <div className="d-flex gap-2 mt-2">
                                        <Badge bg={priorityColors[selectedError.priority]} style={{ fontSize: '0.75rem' }}>
                                            {selectedError.priority} Priority
                                        </Badge>
                                        <Badge bg={statusColors[selectedError.status]} style={{ fontSize: '0.75rem' }}>
                                            {statusIcons[selectedError.status]}
                                            {selectedError.status}
                                        </Badge>
                                    </div>
                                </div>
                                <span className="text-muted" style={{ fontSize: '0.8rem' }}>#{selectedError.id}</span>
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <strong style={{ fontSize: '0.85rem' }}>Description:</strong>
                                        <p className="mb-0 mt-1" style={{ fontSize: '0.8rem' }}>{selectedError.description}</p>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-2" style={{ fontSize: '0.85rem' }}>
                                        <strong>Client:</strong> {selectedError.clientName || 'N/A'}
                                    </div>
                                    <div className="mb-2" style={{ fontSize: '0.85rem' }}>
                                        <strong>Project:</strong> {getProjectName(selectedError.projectId)}
                                    </div>
                                    <div className="mb-2" style={{ fontSize: '0.85rem' }}>
                                        <strong>Module:</strong> {getModuleName(selectedError.moduleId)}
                                    </div>
                                    <div className="mb-2" style={{ fontSize: '0.85rem' }}>
                                        <strong>Reported By:</strong> {getEmployeeName(selectedError.reportedBy)}
                                    </div>
                                    <div className="mb-2" style={{ fontSize: '0.85rem' }}>
                                        <strong>Error Date:</strong> {formatDate(selectedError.errorDate || selectedError.errordate)}
                                    </div>
                                    {selectedError.solvedDate && (
                                        <div className="mb-2" style={{ fontSize: '0.85rem' }}>
                                            <strong>Solved Date:</strong> {formatDate(selectedError.solvedDate)}
                                        </div>
                                    )}
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
                    <Modal.Title style={{ fontSize: '1rem' }}>Delete Error Ticket</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedError && (
                        <div className="text-center">
                            <div className="mb-3">
                                <FaExclamationTriangle size={40} className="text-danger mb-2" />
                                <h6 className="mb-1" style={{ fontSize: '0.9rem' }}>{selectedError.title}</h6>
                                <small className="text-muted" style={{ fontSize: '0.8rem' }}>
                                    Project: {getProjectName(selectedError.projectId)} | Module: {getModuleName(selectedError.moduleId)} | Priority: {selectedError.priority} | Status: {selectedError.status}
                                </small>
                            </div>
                            <p className="mb-0" style={{ fontSize: '0.85rem' }}>
                                Are you sure you want to delete error ticket <strong>#{selectedError.id}</strong>?
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
                        Delete Ticket
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ErrorTicketPage;