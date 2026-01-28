// "use client";
// import React, { useEffect, useState } from "react";
// import API from "@/services/api";
// import {
//   Card,
//   Table,
//   Button,
//   Form,
//   InputGroup,
//   Modal,
//   Spinner,
//   Dropdown,
//   Badge
// } from "react-bootstrap";
// import { 
//   FaEdit, 
//   FaEye, 
//   FaTrash, 
//   FaSort, 
//   FaSortUp, 
//   FaSortDown,
//   FaPlus,
//   FaSearch,
//   FaFilter,
//   FaChevronLeft,
//   FaChevronRight,
//   FaEllipsisH,
//   FaCheckCircle,
//   FaClock,
//   FaPlay,
//   FaList
// } from "react-icons/fa";

// const NewModuleTaskPage = () => {
//   const [tasks, setTasks] = useState([]);
//   const [projects, setProjects] = useState([]); // New state for projects dropdown
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const [size, setSize] = useState(5);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [projectsLoading, setProjectsLoading] = useState(false);

//   // Sorting State
//   const [sortBy, setSortBy] = useState("id");
//   const [sortDir, setSortDir] = useState("desc");

//   // Modal States
//   const [showModal, setShowModal] = useState(false);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [selectedTask, setSelectedTask] = useState(null);
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     status: "Pending",
//     projectId: "", // Changed from projectid to projectId to match API
//     employeeid: "",
//     assigneddate: "",
//     completeddate: ""
//   });

//   // Page size options
//   const pageSizeOptions = [5, 10, 20, 50];

//   // Status colors
//   const statusColors = {
//     "Pending": "warning",
//     "In Progress": "info",
//     "Completed": "success",
//     "On Hold": "secondary",
//     "Cancelled": "danger"
//   };

//   // Status icons
//   const statusIcons = {
//     "Pending": <FaClock className="me-1" />,
//     "In Progress": <FaPlay className="me-1" />,
//     "Completed": <FaCheckCircle className="me-1" />,
//     "On Hold": <FaList className="me-1" />,
//     "Cancelled": <FaList className="me-1" />
//   };

//   // 🔍 Fetch Tasks with Pagination + Search + Sorting
//   const fetchTasks = async () => {
//     setLoading(true);
//     try {
//       const res = await API.get(
//         `/modules/smart?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}&search=${search}`
//       );
//       setTasks(res.data.results || []);
//       setTotalPages(res.data.totalPages || 1);
//       setTotalRecords(res.data.totalRecords || 0);
//     } catch (error) {
//       console.error("Error fetching tasks:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🏗️ Fetch Projects for Dropdown
//   const fetchProjects = async () => {
//     setProjectsLoading(true);
//     try {
//       const res = await API.get('/project/smart?page=1&size=100'); // Fetch all projects
//       setProjects(res.data.results || res.data || []);
//     } catch (error) {
//       console.error("Error fetching projects:", error);
//     } finally {
//       setProjectsLoading(false);
//     }
//   };

//   // 📊 Fetch Task Count
//   const fetchTaskCount = async () => {
//     try {
//       const res = await API.get('/modules/count');
//       console.log('Total tasks count:', res.data);
//     } catch (error) {
//       console.error("Error fetching task count:", error);
//     }
//   };

//   useEffect(() => {
//     fetchTasks();
//     fetchProjects(); // Fetch projects on component mount
//     fetchTaskCount();
//   }, [page, size, search, sortBy, sortDir]);

//   // 🧾 Handle Input
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // 💾 Save Task
//   const handleSave = async () => {
//     try {
//       // Format data for API - projectId is now selected from dropdown
//       const formattedData = {
//         title: formData.title,
//         description: formData.description,
//         status: formData.status,
//         projectId: formData.projectId ? parseInt(formData.projectId) : null, // Changed to projectId
//         employeeid: formData.employeeid ? parseInt(formData.employeeid) : null,
//         assigneddate: formData.assigneddate || new Date().toISOString().split('T')[0],
//         completeddate: formData.completeddate || null
//       };
      
//       await API.post("/modules/save", formattedData);
//       setShowModal(false);
//       setFormData({
//         title: "",
//         description: "",
//         status: "Pending",
//         projectId: "", // Reset to empty
//         employeeid: "",
//         assigneddate: "",
//         completeddate: ""
//       });
//       fetchTasks();
//       fetchTaskCount();
//     } catch (error) {
//       console.error("Error saving task:", error);
//     }
//   };

//   // ✏️ Update Task
//   const handleUpdate = async () => {
//     try {
//       const formattedData = {
//         title: formData.title,
//         description: formData.description,
//         status: formData.status,
//         projectId: formData.projectId ? parseInt(formData.projectId) : null, // Changed to projectId
//         employeeid: formData.employeeid ? parseInt(formData.employeeid) : null,
//         completeddate: formData.completeddate || null
//       };
      
//       await API.put(`/modules/update/${selectedTask.id}`, formattedData);
//       setShowModal(false);
//       setFormData({
//         title: "",
//         description: "",
//         status: "Pending",
//         projectId: "",
//         employeeid: "",
//         assigneddate: "",
//         completeddate: ""
//       });
//       setSelectedTask(null);
//       fetchTasks();
//       fetchTaskCount();
//     } catch (error) {
//       console.error("Error updating task:", error);
//     }
//   };

//   // 🗑️ Delete Task
//   const handleDelete = async () => {
//     try {
//       await API.delete(`/modules/delete/${selectedTask.id}`);
//       setShowDeleteModal(false);
//       setSelectedTask(null);
//       fetchTasks();
//       fetchTaskCount();
//     } catch (error) {
//       console.error("Error deleting task:", error);
//     }
//   };

//   // 🔄 Sort Handling
//   const handleSort = (column) => {
//     if (sortBy === column) {
//       setSortDir(sortDir === "asc" ? "desc" : "asc");
//     } else {
//       setSortBy(column);
//       setSortDir("asc");
//     }
//     setPage(1);
//   };

//   // ➕ Add New Task
//   const handleAddNew = () => {
//     setFormData({
//       title: "",
//       description: "",
//       status: "Pending",
//       projectId: "",
//       employeeid: "",
//       assigneddate: new Date().toISOString().split('T')[0],
//       completeddate: ""
//     });
//     setSelectedTask(null);
//     setShowModal(true);
//   };

//   // ✏️ Edit Task
//   const handleEdit = (task) => {
//     setSelectedTask(task);
//     setFormData({
//       title: task.title,
//       description: task.description,
//       status: task.status,
//       projectId: task.projectId || task.projectid || "", // Handle both cases
//       employeeid: task.employeeid || "",
//       assigneddate: task.assigneddate,
//       completeddate: task.completeddate || ""
//     });
//     setShowModal(true);
//   };

//   // 👁️ View Task
//   const handleView = (task) => {
//     setSelectedTask(task);
//     setShowViewModal(true);
//   };

//   // 🗑️ Confirm Delete
//   const handleConfirmDelete = (task) => {
//     setSelectedTask(task);
//     setShowDeleteModal(true);
//   };

//   // Get Sort Icon
//   const getSortIcon = (column) => {
//     if (sortBy !== column) return <FaSort className="ms-1 opacity-50" size={12} />;
//     return sortDir === "asc" ? <FaSortUp className="ms-1" size={12} /> : <FaSortDown className="ms-1" size={12} />;
//   };

//   // Pagination Functions
//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const handlePrevious = () => {
//     setPage(prev => Math.max(1, prev - 1));
//   };

//   const handleNext = () => {
//     setPage(prev => Math.min(totalPages, prev + 1));
//   };

//   const handleSizeChange = (e) => {
//     setSize(parseInt(e.target.value));
//     setPage(1);
//   };

//   // Format date for display
//   const formatDate = (dateString) => {
//     if (!dateString) return 'Not set';
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   // Get project name by ID
//   const getProjectName = (projectId) => {
//     if (!projectId) return 'N/A';
//     const project = projects.find(p => p.id === projectId);
//     return project ? project.name : `Project #${projectId}`;
//   };

//   // Render Pagination Numbers
//   const renderPaginationNumbers = () => {
//     const pages = [];
//     const maxVisiblePages = 5;
//     const startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
//     const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

//     // Previous dots
//     if (startPage > 1) {
//       pages.push(
//         <button
//           key={1}
//           className="btn btn-outline-secondary btn-sm mx-1"
//           onClick={() => handlePageChange(1)}
//           style={{ fontSize: '0.8rem' }}
//         >
//           1
//         </button>
//       );
//       if (startPage > 2) {
//         pages.push(<span key="dots1" className="mx-1 text-muted" style={{ fontSize: '0.8rem' }}>•••</span>);
//       }
//     }

//     // Page numbers
//     for (let i = startPage; i <= endPage; i++) {
//       pages.push(
//         <button
//           key={i}
//           className={`btn btn-sm mx-1 ${page === i ? 'btn-primary' : 'btn-outline-secondary'}`}
//           onClick={() => handlePageChange(i)}
//           style={{ fontSize: '0.8rem' }}
//         >
//           {i}
//         </button>
//       );
//     }

//     // Next dots
//     if (endPage < totalPages) {
//       if (endPage < totalPages - 1) {
//         pages.push(<span key="dots2" className="mx-1 text-muted" style={{ fontSize: '0.8rem' }}>•••</span>);
//       }
//       pages.push(
//         <button
//           key={totalPages}
//           className="btn btn-outline-secondary btn-sm mx-1"
//           onClick={() => handlePageChange(totalPages)}
//           style={{ fontSize: '0.8rem' }}
//         >
//           {totalPages}
//         </button>
//       );
//     }

//     return pages;
//   };

//   return (
//     <div className="container-fluid py-3">
//       {/* Card Container */}
//       <Card className="shadow-sm border-0">
//         {/* Card Header */}
//         <Card.Header className="bg-white border-0 py-3">
//           <div className="d-flex justify-content-between align-items-center">
//             <div>
//               <h5 className="mb-0 text-dark fw-bold" style={{ fontSize: '1.1rem' }}>Module Task Management</h5>
//               <small className="text-muted" style={{ fontSize: '0.75rem' }}>Manage and track module development tasks</small>
//             </div>
//             <Button 
//               variant="primary" 
//               className="d-flex align-items-center gap-2 px-3"
//               onClick={handleAddNew}
//               style={{ fontSize: '0.8rem' }}
//             >
//               <FaPlus size={12} />
//               New Task
//             </Button>
//           </div>
//         </Card.Header>

//         <Card.Body className="p-0">
//           {/* Controls Section */}
//           <div className="p-3 border-bottom bg-light">
//             <div className="row g-3 align-items-center">
//               <div className="col-md-6">
//                 <InputGroup>
//                   <Form.Control
//                     placeholder="Search by title, description..."
//                     value={search}
//                     onChange={(e) => {
//                       setSearch(e.target.value);
//                       setPage(1);
//                     }}
//                     style={{ fontSize: '0.8rem' }}
//                   />
//                   <InputGroup.Text className="bg-white" style={{ fontSize: '0.8rem' }}>
//                     <FaSearch className="text-muted" size={12} />
//                   </InputGroup.Text>
//                 </InputGroup>
//               </div>
//               <div className="col-md-6 d-flex justify-content-end gap-3">
//                 <div className="d-flex align-items-center gap-2">
//                   <span className="text-muted" style={{ fontSize: '0.8rem' }}>Show:</span>
//                   <Form.Select 
//                     value={size} 
//                     onChange={handleSizeChange}
//                     style={{ width: '70px', fontSize: '0.8rem' }}
//                   >
//                     {pageSizeOptions.map(option => (
//                       <option key={option} value={option}>{option}</option>
//                     ))}
//                   </Form.Select>
//                 </div>
//                 <Dropdown>
//                   <Dropdown.Toggle variant="outline-secondary" size="sm" className="d-flex align-items-center gap-2" style={{ fontSize: '0.8rem' }}>
//                     <FaFilter size={10} />
//                     Filter
//                   </Dropdown.Toggle>
//                   <Dropdown.Menu style={{ fontSize: '0.8rem' }}>
//                     <Dropdown.Item>Pending Tasks</Dropdown.Item>
//                     <Dropdown.Item>In Progress</Dropdown.Item>
//                     <Dropdown.Item>Completed Tasks</Dropdown.Item>
//                     <Dropdown.Divider />
//                     <Dropdown.Item>Clear Filters</Dropdown.Item>
//                   </Dropdown.Menu>
//                 </Dropdown>
//               </div>
//             </div>
//           </div>

//           {/* Table Section */}
//           <div className="table-responsive">
//             <Table hover className="mb-0">
//               <thead className="table-light">
//                 <tr>
//                   <th 
//                     style={{ cursor: "pointer", width: "70px" }} 
//                     onClick={() => handleSort("id")}
//                     className="py-2"
//                   >
//                     <div className="d-flex align-items-center justify-content-between">
//                       <span className="fw-semibold text-muted" style={{ fontSize: '0.8rem' }}>ID</span>
//                       {getSortIcon("id")}
//                     </div>
//                   </th>
//                   <th 
//                     style={{ cursor: "pointer", minWidth: "200px" }} 
//                     onClick={() => handleSort("title")}
//                     className="py-2"
//                   >
//                     <div className="d-flex align-items-center justify-content-between">
//                       <span className="fw-semibold text-muted" style={{ fontSize: '0.8rem' }}>Task Title</span>
//                       {getSortIcon("title")}
//                     </div>
//                   </th>
//                   <th 
//                     style={{ cursor: "pointer", minWidth: "130px" }} 
//                     onClick={() => handleSort("status")}
//                     className="py-2"
//                   >
//                     <div className="d-flex align-items-center justify-content-between">
//                       <span className="fw-semibold text-muted" style={{ fontSize: '0.8rem' }}>Status</span>
//                       {getSortIcon("status")}
//                     </div>
//                   </th>
//                   <th 
//                     style={{ cursor: "pointer", minWidth: "150px" }} 
//                     onClick={() => handleSort("projectId")}
//                     className="py-2"
//                   >
//                     <div className="d-flex align-items-center justify-content-between">
//                       <span className="fw-semibold text-muted" style={{ fontSize: '0.8rem' }}>Project</span>
//                       {getSortIcon("projectId")}
//                     </div>
//                   </th>
//                   <th 
//                     style={{ cursor: "pointer", minWidth: "120px" }} 
//                     onClick={() => handleSort("employeeid")}
//                     className="py-2"
//                   >
//                     <div className="d-flex align-items-center justify-content-between">
//                       <span className="fw-semibold text-muted" style={{ fontSize: '0.8rem' }}>Employee ID</span>
//                       {getSortIcon("employeeid")}
//                     </div>
//                   </th>
//                   <th 
//                     style={{ cursor: "pointer", minWidth: "120px" }} 
//                     onClick={() => handleSort("assigneddate")}
//                     className="py-2"
//                   >
//                     <div className="d-flex align-items-center justify-content-between">
//                       <span className="fw-semibold text-muted" style={{ fontSize: '0.8rem' }}>Assigned Date</span>
//                       {getSortIcon("assigneddate")}
//                     </div>
//                   </th>
//                   <th style={{ minWidth: "130px" }} className="py-2 fw-semibold text-center text-muted" style={{ fontSize: '0.8rem' }}>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {loading ? (
//                   <tr>
//                     <td colSpan="7" className="text-center py-4">
//                       <div className="d-flex justify-content-center align-items-center">
//                         <Spinner animation="border" variant="primary" size="sm" className="me-2" />
//                         <span className="text-muted" style={{ fontSize: '0.8rem' }}>Loading tasks...</span>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : tasks.length > 0 ? (
//                   tasks.map((task) => (
//                     <tr key={task.id} className="border-bottom">
//                       <td className="py-2">
//                         <span className="text-muted fw-medium" style={{ fontSize: '0.8rem' }}>#{task.id}</span>
//                       </td>
//                       <td className="py-2">
//                         <div>
//                           <div className="fw-semibold text-dark" style={{ fontSize: '0.85rem' }}>{task.title}</div>
//                           <small className="text-muted" style={{ fontSize: '0.7rem' }}>
//                             {task.description && task.description.length > 50 
//                               ? `${task.description.substring(0, 50)}...` 
//                               : task.description}
//                           </small>
//                         </div>
//                       </td>
//                       <td className="py-2">
//                         <Badge 
//                           bg={statusColors[task.status] || "secondary"}
//                           className="d-flex align-items-center px-2 py-1"
//                           style={{ fontWeight: '500', fontSize: '0.75rem', width: 'fit-content' }}
//                         >
//                           {statusIcons[task.status]}
//                           {task.status}
//                         </Badge>
//                       </td>
//                       <td className="py-2">
//                         <span className="text-dark" style={{ fontSize: '0.8rem' }}>
//                           {getProjectName(task.projectId || task.projectid)}
//                         </span>
//                       </td>
//                       <td className="py-2">
//                         <span className="text-dark" style={{ fontSize: '0.8rem' }}>
//                           {task.employeeid || 'N/A'}
//                         </span>
//                       </td>
//                       <td className="py-2">
//                         <span className="text-dark" style={{ fontSize: '0.8rem' }}>
//                           {formatDate(task.assigneddate)}
//                         </span>
//                       </td>
//                       <td className="py-2">
//                         <div className="d-flex justify-content-center gap-1">
//                           <Button
//                             variant="outline-primary"
//                             size="sm"
//                             className="d-flex align-items-center px-2"
//                             onClick={() => handleView(task)}
//                             title="View Details"
//                             style={{ fontSize: '0.7rem' }}
//                           >
//                             <FaEye size={10} className="me-1" />
//                             View
//                           </Button>
//                           <Button
//                             variant="outline-warning"
//                             size="sm"
//                             className="d-flex align-items-center px-2"
//                             onClick={() => handleEdit(task)}
//                             title="Edit"
//                             style={{ fontSize: '0.7rem' }}
//                           >
//                             <FaEdit size={10} className="me-1" />
//                             Edit
//                           </Button>
//                           <Dropdown>
//                             <Dropdown.Toggle 
//                               variant="outline-secondary" 
//                               size="sm" 
//                               className="d-flex align-items-center px-1"
//                               style={{ fontSize: '0.7rem' }}
//                             >
//                               <FaEllipsisH size={10} />
//                             </Dropdown.Toggle>
//                             <Dropdown.Menu style={{ fontSize: '0.8rem' }}>
//                               <Dropdown.Item onClick={() => handleView(task)} style={{ fontSize: '0.8rem' }}>
//                                 <FaEye className="me-2 text-primary" size={10} />
//                                 View Details
//                               </Dropdown.Item>
//                               <Dropdown.Item onClick={() => handleEdit(task)} style={{ fontSize: '0.8rem' }}>
//                                 <FaEdit className="me-2 text-warning" size={10} />
//                                 Edit Task
//                               </Dropdown.Item>
//                               <Dropdown.Divider />
//                               <Dropdown.Item className="text-danger" onClick={() => handleConfirmDelete(task)} style={{ fontSize: '0.8rem' }}>
//                                 <FaTrash className="me-2" size={10} />
//                                 Delete
//                               </Dropdown.Item>
//                             </Dropdown.Menu>
//                           </Dropdown>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="7" className="text-center py-4">
//                       <div className="text-muted">
//                         <FaSearch size={32} className="mb-2 opacity-25" />
//                         <h6 className="mb-2" style={{ fontSize: '0.9rem' }}>No tasks found</h6>
//                         <p className="mb-0" style={{ fontSize: '0.8rem' }}>
//                           {search ? 'Try adjusting your search terms' : 'Get started by creating your first task'}
//                         </p>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </Table>
//           </div>

//           {/* Pagination Section */}
//           {tasks.length > 0 && (
//             <div className="p-2 border-top bg-light">
//               <div className="d-flex justify-content-between align-items-center">
//                 <div>
//                   <span className="text-muted" style={{ fontSize: '0.75rem' }}>
//                     Showing <strong>{((page - 1) * size) + 1}-{Math.min(page * size, totalRecords)}</strong> of <strong>{totalRecords}</strong> tasks
//                   </span>
//                 </div>
                
//                 <div className="d-flex align-items-center gap-1">
//                   <Button
//                     variant="outline-secondary"
//                     size="sm"
//                     onClick={handlePrevious}
//                     disabled={page <= 1}
//                     className="d-flex align-items-center px-2"
//                     style={{ fontSize: '0.7rem' }}
//                   >
//                     <FaChevronLeft size={10} className="me-1" />
//                     Prev
//                   </Button>

//                   <div className="d-flex gap-1 mx-1">
//                     {renderPaginationNumbers()}
//                   </div>

//                   <Button
//                     variant="outline-secondary"
//                     size="sm"
//                     onClick={handleNext}
//                     disabled={page >= totalPages}
//                     className="d-flex align-items-center px-2"
//                     style={{ fontSize: '0.7rem' }}
//                   >
//                     Next
//                     <FaChevronRight size={10} className="ms-1" />
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </Card.Body>
//       </Card>

//       {/* Modals */}
//       <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title style={{ fontSize: '1rem' }}>
//             {selectedTask ? "Edit Task" : "Create New Task"}
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Form.Group className="mb-3">
//               <Form.Label style={{ fontSize: '0.85rem' }}>Title <span className="text-danger">*</span></Form.Label>
//               <Form.Control
//                 name="title"
//                 value={formData.title}
//                 onChange={handleChange}
//                 placeholder="Enter task title"
//                 style={{ fontSize: '0.85rem' }}
//               />
//             </Form.Group>

//             <Form.Group className="mb-3">
//               <Form.Label style={{ fontSize: '0.85rem' }}>Description <span className="text-danger">*</span></Form.Label>
//               <Form.Control
//                 as="textarea"
//                 rows={3}
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 placeholder="Describe the task in detail..."
//                 style={{ fontSize: '0.85rem' }}
//               />
//             </Form.Group>

//             <div className="row">
//               <div className="col-md-6">
//                 <Form.Group className="mb-3">
//                   <Form.Label style={{ fontSize: '0.85rem' }}>Status</Form.Label>
//                   <Form.Select
//                     name="status"
//                     value={formData.status}
//                     onChange={handleChange}
//                     style={{ fontSize: '0.85rem' }}
//                   >
//                     <option value="Pending">Pending</option>
//                     <option value="In Progress">In Progress</option>
//                     <option value="Completed">Completed</option>
//                     <option value="On Hold">On Hold</option>
//                     <option value="Cancelled">Cancelled</option>
//                   </Form.Select>
//                 </Form.Group>
//               </div>
//               <div className="col-md-6">
//                 <Form.Group className="mb-3">
//                   <Form.Label style={{ fontSize: '0.85rem' }}>Assigned Date</Form.Label>
//                   <Form.Control
//                     type="date"
//                     name="assigneddate"
//                     value={formData.assigneddate}
//                     onChange={handleChange}
//                     style={{ fontSize: '0.85rem' }}
//                   />
//                 </Form.Group>
//               </div>
//             </div>

//             <div className="row">
//               <div className="col-md-6">
//                 <Form.Group className="mb-3">
//                   <Form.Label style={{ fontSize: '0.85rem' }}>Project <span className="text-danger">*</span></Form.Label>
//                   <Form.Select
//                     name="projectId"
//                     value={formData.projectId}
//                     onChange={handleChange}
//                     style={{ fontSize: '0.85rem' }}
//                     disabled={projectsLoading}
//                   >
//                     <option value="">Select Project</option>
//                     {projects.map((project) => (
//                       <option key={project.id} value={project.id}>
//                         {project.name}
//                       </option>
//                     ))}
//                   </Form.Select>
//                   {projectsLoading && (
//                     <small className="text-muted" style={{ fontSize: '0.75rem' }}>
//                       Loading projects...
//                     </small>
//                   )}
//                 </Form.Group>
//               </div>
//               <div className="col-md-6">
//                 <Form.Group className="mb-3">
//                   <Form.Label style={{ fontSize: '0.85rem' }}>Completed Date</Form.Label>
//                   <Form.Control
//                     type="date"
//                     name="completeddate"
//                     value={formData.completeddate}
//                     onChange={handleChange}
//                     style={{ fontSize: '0.85rem' }}
//                   />
//                 </Form.Group>
//               </div>
//             </div>

//             <Form.Group className="mb-3">
//               <Form.Label style={{ fontSize: '0.85rem' }}>Employee ID</Form.Label>
//               <Form.Control
//                 type="number"
//                 name="employeeid"
//                 value={formData.employeeid}
//                 onChange={handleChange}
//                 placeholder="Enter employee ID"
//                 style={{ fontSize: '0.85rem' }}
//               />
//             </Form.Group>
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="outline-secondary" onClick={() => setShowModal(false)} style={{ fontSize: '0.8rem' }}>
//             Cancel
//           </Button>
//           <Button 
//             variant="primary" 
//             onClick={selectedTask ? handleUpdate : handleSave}
//             style={{ fontSize: '0.8rem' }}
//           >
//             {selectedTask ? "Update Task" : "Create Task"}
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered size="lg">
//         <Modal.Header closeButton>
//           <Modal.Title style={{ fontSize: '1rem' }}>Task Details</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {selectedTask && (
//             <div>
//               <div className="d-flex justify-content-between align-items-start mb-3">
//                 <div>
//                   <h5 className="mb-1" style={{ fontSize: '1rem' }}>{selectedTask.title}</h5>
//                   <div className="mt-2">
//                     <Badge bg={statusColors[selectedTask.status]} style={{ fontSize: '0.75rem' }}>
//                       {statusIcons[selectedTask.status]}
//                       {selectedTask.status}
//                     </Badge>
//                   </div>
//                 </div>
//                 <span className="text-muted" style={{ fontSize: '0.8rem' }}>#{selectedTask.id}</span>
//               </div>

//               <div className="row">
//                 <div className="col-md-6">
//                   <div className="mb-3">
//                     <strong style={{ fontSize: '0.85rem' }}>Description:</strong>
//                     <p className="mb-0 mt-1" style={{ fontSize: '0.8rem' }}>{selectedTask.description}</p>
//                   </div>
//                 </div>
//                 <div className="col-md-6">
//                   <div className="mb-2" style={{ fontSize: '0.85rem' }}>
//                     <strong>Project:</strong> {getProjectName(selectedTask.projectId || selectedTask.projectid)}
//                   </div>
//                   <div className="mb-2" style={{ fontSize: '0.85rem' }}>
//                     <strong>Employee ID:</strong> {selectedTask.employeeid || 'N/A'}
//                   </div>
//                   <div className="mb-2" style={{ fontSize: '0.85rem' }}>
//                     <strong>Assigned Date:</strong> {formatDate(selectedTask.assigneddate)}
//                   </div>
//                   {selectedTask.completeddate && (
//                     <div className="mb-2" style={{ fontSize: '0.85rem' }}>
//                       <strong>Completed Date:</strong> {formatDate(selectedTask.completeddate)}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="outline-secondary" onClick={() => setShowViewModal(false)} style={{ fontSize: '0.8rem' }}>
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
//         <Modal.Header closeButton>
//           <Modal.Title style={{ fontSize: '1rem' }}>Delete Task</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {selectedTask && (
//             <div className="text-center">
//               <div className="mb-3">
//                 <FaList size={40} className="text-danger mb-2" />
//                 <h6 className="mb-1" style={{ fontSize: '0.9rem' }}>{selectedTask.title}</h6>
//                 <small className="text-muted" style={{ fontSize: '0.8rem' }}>
//                   Project: {getProjectName(selectedTask.projectId || selectedTask.projectid)} | Status: {selectedTask.status}
//                 </small>
//               </div>
//               <p className="mb-0" style={{ fontSize: '0.85rem' }}>
//                 Are you sure you want to delete task <strong>#{selectedTask.id}</strong>?
//                 This action cannot be undone.
//               </p>
//             </div>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="outline-secondary" onClick={() => setShowDeleteModal(false)} style={{ fontSize: '0.8rem' }}>
//             Cancel
//           </Button>
//           <Button variant="danger" onClick={handleDelete} style={{ fontSize: '0.8rem' }}>
//             Delete Task
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default NewModuleTaskPage;




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
  FaCheckCircle,
  FaClock,
  FaPlay,
  FaList
} from "react-icons/fa";

const ModulePage = () => {
  const [modules, setModules] = useState([]);
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [projectsLoading, setProjectsLoading] = useState(false);

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
    startDate: "",
    completedDate: ""
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
    "Planning": <FaClock className="me-1" />,
    "Active": <FaPlay className="me-1" />,
    "Complete": <FaCheckCircle className="me-1" />,
    "On Hold": <FaList className="me-1" />
  };

  // 🔍 Fetch Modules with Pagination + Search + Sorting
  const fetchModules = async () => {
    setLoading(true);
    try {
      const res = await API.get(
        `/modules/smart?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}&search=${search}`
      );
      setModules(res.data.results || []);
      setTotalPages(res.data.totalPages || 1);
      setTotalRecords(res.data.totalRecords || 0);
    } catch (error) {
      console.error("Error fetching modules:", error);
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

  useEffect(() => {
    fetchModules();
    fetchProjects();
  }, [page, size, search, sortBy, sortDir]);

  // 🧾 Handle Input
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 💾 Save Module
  const handleSave = async () => {
    try {
      const formattedData = {
        name: formData.name,
        description: formData.description,
        priority: formData.priority,
        status: formData.status,
        clientName: formData.clientName,
        projectId: formData.projectId ? parseInt(formData.projectId) : null,
        startDate: formData.startDate || new Date().toISOString().split('T')[0],
        completedDate: formData.completedDate || null
      };
      
      await API.post("/modules/save", formattedData);
      setShowModal(false);
      setFormData({
        name: "",
        description: "",
        priority: "Medium",
        status: "Active",
        clientName: "",
        projectId: "",
        startDate: "",
        completedDate: ""
      });
      fetchModules();
    } catch (error) {
      console.error("Error saving module:", error);
    }
  };

  // ✏️ Update Module
  const handleUpdate = async () => {
    try {
      const formattedData = {
        name: formData.name,
        description: formData.description,
        priority: formData.priority,
        status: formData.status,
        clientName: formData.clientName,
        projectId: formData.projectId ? parseInt(formData.projectId) : null,
        startDate: formData.startDate,
        completedDate: formData.completedDate || null
      };
      
      await API.put(`/modules/update/${selectedModule.id}`, formattedData);
      setShowModal(false);
      setFormData({
        name: "",
        description: "",
        priority: "Medium",
        status: "Active",
        clientName: "",
        projectId: "",
        startDate: "",
        completedDate: ""
      });
      setSelectedModule(null);
      fetchModules();
    } catch (error) {
      console.error("Error updating module:", error);
    }
  };

  // 🗑️ Delete Module
  const handleDelete = async () => {
    try {
      await API.delete(`/modules/delete/${selectedModule.id}`);
      setShowDeleteModal(false);
      setSelectedModule(null);
      fetchModules();
    } catch (error) {
      console.error("Error deleting module:", error);
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

  // ➕ Add New Module
  const handleAddNew = () => {
    setFormData({
      name: "",
      description: "",
      priority: "Medium",
      status: "Active",
      clientName: "",
      projectId: "",
      startDate: new Date().toISOString().split('T')[0],
      completedDate: ""
    });
    setSelectedModule(null);
    setShowModal(true);
  };

  // ✏️ Edit Module
  const handleEdit = (module) => {
    setSelectedModule(module);
    setFormData({
      name: module.name,
      description: module.description,
      priority: module.priority,
      status: module.status,
      clientName: module.clientName,
      projectId: module.projectId || "",
      startDate: module.startDate,
      completedDate: module.completedDate || ""
    });
    setShowModal(true);
  };

  // 👁️ View Module
  const handleView = (module) => {
    setSelectedModule(module);
    setShowViewModal(true);
  };

  // 🗑️ Confirm Delete
  const handleConfirmDelete = (module) => {
    setSelectedModule(module);
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
    if (!dateString) return 'Not set';
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
              <h5 className="mb-0 text-dark fw-bold" style={{ fontSize: '1.1rem' }}>Module Management</h5>
              <small className="text-muted" style={{ fontSize: '0.75rem' }}>Manage and track project modules</small>
            </div>
            <Button 
              variant="primary" 
              className="d-flex align-items-center gap-2 px-3"
              onClick={handleAddNew}
              style={{ fontSize: '0.8rem' }}
            >
              <FaPlus size={12} />
              New Module
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
                    placeholder="Search by name, description, client..."
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
                    <Dropdown.Item>Active Modules</Dropdown.Item>
                    <Dropdown.Item>Planning Modules</Dropdown.Item>
                    <Dropdown.Item>Completed Modules</Dropdown.Item>
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
                    onClick={() => handleSort("name")}
                    className="py-2"
                  >
                    <div className="d-flex align-items-center justify-content-between">
                      <span className="fw-semibold text-muted" style={{ fontSize: '0.8rem' }}>Module Name</span>
                      {getSortIcon("name")}
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
                    <td colSpan="7" className="text-center py-4">
                      <div className="d-flex justify-content-center align-items-center">
                        <Spinner animation="border" variant="primary" size="sm" className="me-2" />
                        <span className="text-muted" style={{ fontSize: '0.8rem' }}>Loading modules...</span>
                      </div>
                    </td>
                  </tr>
                ) : modules.length > 0 ? (
                  modules.map((module) => (
                    <tr key={module.id} className="border-bottom">
                      <td className="py-2">
                        <span className="text-muted fw-medium" style={{ fontSize: '0.8rem' }}>#{module.id}</span>
                      </td>
                      <td className="py-2">
                        <div>
                          <div className="fw-semibold text-dark" style={{ fontSize: '0.85rem' }}>{module.name}</div>
                          <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                            {module.description && module.description.length > 50 
                              ? `${module.description.substring(0, 50)}...` 
                              : module.description}
                          </small>
                        </div>
                      </td>
                      <td className="py-2">
                        <Badge 
                          bg={priorityColors[module.priority] || "secondary"}
                          className="px-2 py-1"
                          style={{ fontWeight: '500', fontSize: '0.75rem' }}
                        >
                          {module.priority}
                        </Badge>
                      </td>
                      <td className="py-2">
                        <Badge 
                          bg={statusColors[module.status] || "secondary"}
                          className="d-flex align-items-center px-2 py-1"
                          style={{ fontWeight: '500', fontSize: '0.75rem', width: 'fit-content' }}
                        >
                          {statusIcons[module.status]}
                          {module.status}
                        </Badge>
                      </td>
                      <td className="py-2">
                        <span className="text-dark" style={{ fontSize: '0.8rem' }}>
                          {getProjectName(module.projectId)}
                        </span>
                      </td>
                      <td className="py-2">
                        <span className="text-dark" style={{ fontSize: '0.8rem' }}>
                          {module.clientName || 'N/A'}
                        </span>
                      </td>
                      <td className="py-2">
                        <div className="d-flex justify-content-center gap-1">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="d-flex align-items-center px-2"
                            onClick={() => handleView(module)}
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
                            onClick={() => handleEdit(module)}
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
                              <Dropdown.Item onClick={() => handleView(module)} style={{ fontSize: '0.8rem' }}>
                                <FaEye className="me-2 text-primary" size={10} />
                                View Details
                              </Dropdown.Item>
                              <Dropdown.Item onClick={() => handleEdit(module)} style={{ fontSize: '0.8rem' }}>
                                <FaEdit className="me-2 text-warning" size={10} />
                                Edit Module
                              </Dropdown.Item>
                              <Dropdown.Divider />
                              <Dropdown.Item className="text-danger" onClick={() => handleConfirmDelete(module)} style={{ fontSize: '0.8rem' }}>
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
                    <td colSpan="7" className="text-center py-4">
                      <div className="text-muted">
                        <FaSearch size={32} className="mb-2 opacity-25" />
                        <h6 className="mb-2" style={{ fontSize: '0.9rem' }}>No modules found</h6>
                        <p className="mb-0" style={{ fontSize: '0.8rem' }}>
                          {search ? 'Try adjusting your search terms' : 'Get started by creating your first module'}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {/* Pagination Section */}
          {modules.length > 0 && (
            <div className="p-2 border-top bg-light">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                    Showing <strong>{((page - 1) * size) + 1}-{Math.min(page * size, totalRecords)}</strong> of <strong>{totalRecords}</strong> modules
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
            {selectedModule ? "Edit Module" : "Create New Module"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label style={{ fontSize: '0.85rem' }}>Module Name <span className="text-danger">*</span></Form.Label>
              <Form.Control
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter module name"
                style={{ fontSize: '0.85rem' }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ fontSize: '0.85rem' }}>Description <span className="text-danger">*</span></Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the module in detail..."
                style={{ fontSize: '0.85rem' }}
              />
            </Form.Group>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontSize: '0.85rem' }}>Priority</Form.Label>
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
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontSize: '0.85rem' }}>Status</Form.Label>
                  <Form.Select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    style={{ fontSize: '0.85rem' }}
                  >
                    <option value="Planning">Planning</option>
                    <option value="Active">Active</option>
                    <option value="Complete">Complete</option>
                    <option value="On Hold">On Hold</option>
                  </Form.Select>
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
                  <Form.Label style={{ fontSize: '0.85rem' }}>Client Name</Form.Label>
                  <Form.Control
                    name="clientName"
                    value={formData.clientName}
                    onChange={handleChange}
                    placeholder="Enter client name"
                    style={{ fontSize: '0.85rem' }}
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontSize: '0.85rem' }}>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    style={{ fontSize: '0.85rem' }}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontSize: '0.85rem' }}>Completed Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="completedDate"
                    value={formData.completedDate}
                    onChange={handleChange}
                    style={{ fontSize: '0.85rem' }}
                  />
                </Form.Group>
              </div>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowModal(false)} style={{ fontSize: '0.8rem' }}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={selectedModule ? handleUpdate : handleSave}
            style={{ fontSize: '0.8rem' }}
          >
            {selectedModule ? "Update Module" : "Create Module"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '1rem' }}>Module Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedModule && (
            <div>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h5 className="mb-1" style={{ fontSize: '1rem' }}>{selectedModule.name}</h5>
                  <div className="d-flex gap-2 mt-2">
                    <Badge bg={priorityColors[selectedModule.priority]} style={{ fontSize: '0.75rem' }}>
                      {selectedModule.priority} Priority
                    </Badge>
                    <Badge bg={statusColors[selectedModule.status]} style={{ fontSize: '0.75rem' }}>
                      {statusIcons[selectedModule.status]}
                      {selectedModule.status}
                    </Badge>
                  </div>
                </div>
                <span className="text-muted" style={{ fontSize: '0.8rem' }}>#{selectedModule.id}</span>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <strong style={{ fontSize: '0.85rem' }}>Description:</strong>
                    <p className="mb-0 mt-1" style={{ fontSize: '0.8rem' }}>{selectedModule.description}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-2" style={{ fontSize: '0.85rem' }}>
                    <strong>Client:</strong> {selectedModule.clientName || 'N/A'}
                  </div>
                  <div className="mb-2" style={{ fontSize: '0.85rem' }}>
                    <strong>Project:</strong> {getProjectName(selectedModule.projectId)}
                  </div>
                  <div className="mb-2" style={{ fontSize: '0.85rem' }}>
                    <strong>Start Date:</strong> {formatDate(selectedModule.startDate)}
                  </div>
                  {selectedModule.completedDate && (
                    <div className="mb-2" style={{ fontSize: '0.85rem' }}>
                      <strong>Completed Date:</strong> {formatDate(selectedModule.completedDate)}
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
          <Modal.Title style={{ fontSize: '1rem' }}>Delete Module</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedModule && (
            <div className="text-center">
              <div className="mb-3">
                <FaList size={40} className="text-danger mb-2" />
                <h6 className="mb-1" style={{ fontSize: '0.9rem' }}>{selectedModule.name}</h6>
                <small className="text-muted" style={{ fontSize: '0.8rem' }}>
                  Project: {getProjectName(selectedModule.projectId)} | Priority: {selectedModule.priority} | Status: {selectedModule.status}
                </small>
              </div>
              <p className="mb-0" style={{ fontSize: '0.85rem' }}>
                Are you sure you want to delete module <strong>#{selectedModule.id}</strong>?
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
            Delete Module
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ModulePage;