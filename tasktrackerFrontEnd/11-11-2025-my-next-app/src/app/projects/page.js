// "use client";
// import React, { useState, useEffect } from "react";
// import { 
//   Card,
//   Table, 
//   Button, 
//   Modal, 
//   Form, 
//   InputGroup, 
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
//   FaEllipsisH
// } from "react-icons/fa";
// import API from "@/services/api";

// export default function ProjectsPage() {
//   const [projects, setProjects] = useState([]);
//   const [search, setSearch] = useState("");
//   const [page, setPage] = useState(1);
//   const [size, setSize] = useState(10);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [loading, setLoading] = useState(false);
  
//   // Sorting State
//   const [sortBy, setSortBy] = useState("id");
//   const [sortDir, setSortDir] = useState("asc");

//   // Modal States
//   const [showModal, setShowModal] = useState(false);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [selectedProject, setSelectedProject] = useState(null);
//   const [formData, setFormData] = useState({ 
//     name: "", 
//     description: "" 
//   });
//   const [editId, setEditId] = useState(null);

//   // Page size options
//   const pageSizeOptions = [5, 10, 20, 50];

//   // Color palette for avatar backgrounds
//   const avatarColors = [
//     'bg-primary', 'bg-success', 'bg-warning', 'bg-info',
//     'bg-danger', 'bg-secondary', 'bg-dark'
//   ];

//   // Get random color for avatar
//   const getAvatarColor = (index) => {
//     return avatarColors[index % avatarColors.length];
//   };

//   // Get initials from name
//   const getInitials = (name) => {
//     return name ? name.charAt(0).toUpperCase() : 'P';
//   };

//   // 🔍 Fetch Projects with Pagination + Search + Sorting
//   const fetchProjects = async () => {
//     setLoading(true);
//     try {
//       const res = await API.get(
//         `/project/smart?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}&search=${search}`
//       );
//       setProjects(res.data.results || res.data || []);
//       setTotalPages(res.data.totalPages || 1);
//       setTotalRecords(res.data.totalRecords || 0);
//     } catch (err) {
//       console.error("Error fetching projects:", err);
//       // Fallback to simple getAll if smart endpoint doesn't exist
//       try {
//         const res = await API.get("/project/getAllProjects");
//         setProjects(res.data || []);
//         setTotalPages(1);
//         setTotalRecords(res.data?.length || 0);
//       } catch (fallbackError) {
//         console.error("Error in fallback fetch:", fallbackError);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProjects();
//   }, [page, size, search, sortBy, sortDir]);

//   const handleShow = () => setShowModal(true);
//   const handleClose = () => {
//     setShowModal(false);
//     setFormData({ name: "", description: "" });
//     setEditId(null);
//     setSelectedProject(null);
//   };

//   const handleSave = async () => {
//     try {
//       if (editId) {
//         await API.put(`/project/update/${editId}`, formData);
//       } else {
//         await API.post("/project/save", formData);
//       }
//       fetchProjects();
//       handleClose();
//     } catch (err) {
//       console.error("Error saving project:", err);
//     }
//   };

//   const handleEdit = (project) => {
//     setFormData(project);
//     setEditId(project.id);
//     setSelectedProject(project);
//     setShowModal(true);
//   };

//   const handleDelete = async (id) => {
//     try {
//       await API.delete(`/project/delete/${id}`);
//       fetchProjects();
//       setShowDeleteModal(false);
//       setSelectedProject(null);
//     } catch (err) {
//       console.error("Error deleting project:", err);
//     }
//   };

//   const handleView = (project) => {
//     setSelectedProject(project);
//     setShowViewModal(true);
//   };

//   const handleConfirmDelete = (project) => {
//     setSelectedProject(project);
//     setShowDeleteModal(true);
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
//               <h5 className="mb-0 text-dark fw-bold" style={{ fontSize: '1.1rem' }}>Projects Management</h5>
//               <small className="text-muted" style={{ fontSize: '0.75rem' }}>Manage your organization's projects</small>
//             </div>
//             <Button 
//               variant="primary" 
//               className="d-flex align-items-center gap-2 px-3"
//               onClick={handleShow}
//               style={{ fontSize: '0.8rem' }}
//             >
//               <FaPlus size={12} />
//               Add Project
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
//                     placeholder="Search projects by name or description..."
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
//                     <Dropdown.Item>Active Projects</Dropdown.Item>
//                     <Dropdown.Item>Completed Projects</Dropdown.Item>
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
//                     style={{ cursor: "pointer", minWidth: "180px" }} 
//                     onClick={() => handleSort("name")}
//                     className="py-2"
//                   >
//                     <div className="d-flex align-items-center justify-content-between">
//                       <span className="fw-semibold text-muted" style={{ fontSize: '0.8rem' }}>Project</span>
//                       {getSortIcon("name")}
//                     </div>
//                   </th>
//                   <th 
//                     style={{ cursor: "pointer", minWidth: "280px" }} 
//                     onClick={() => handleSort("description")}
//                     className="py-2"
//                   >
//                     <div className="d-flex align-items-center justify-content-between">
//                       <span className="fw-semibold text-muted" style={{ fontSize: '0.8rem' }}>Description</span>
//                       {getSortIcon("description")}
//                     </div>
//                   </th>
//                   <th style={{ minWidth: "130px" }} className="py-2 fw-semibold text-center text-muted" style={{ fontSize: '0.8rem' }}>Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {loading ? (
//                   <tr>
//                     <td colSpan="4" className="text-center py-4">
//                       <div className="d-flex justify-content-center align-items-center">
//                         <Spinner animation="border" variant="primary" size="sm" className="me-2" />
//                         <span className="text-muted" style={{ fontSize: '0.8rem' }}>Loading projects...</span>
//                       </div>
//                     </td>
//                   </tr>
//                 ) : projects.length > 0 ? (
//                   projects.map((p, index) => (
//                     <tr key={p.id} className="border-bottom">
//                       <td className="py-2">
//                         <span className="text-muted fw-medium" style={{ fontSize: '0.8rem' }}>{p.id}</span>
//                       </td>
//                       <td className="py-2">
//                         <div className="d-flex align-items-center">
//                           <div className={`rounded-circle d-flex align-items-center justify-content-center text-white me-2 ${getAvatarColor(index)}`}
//                                style={{ width: '32px', height: '32px', fontSize: '0.8rem', fontWeight: '600' }}>
//                             {getInitials(p.name)}
//                           </div>
//                           <div>
//                             <div className="fw-semibold text-dark" style={{ fontSize: '0.85rem' }}>{p.name}</div>
//                             {/* <small className="text-muted" style={{ fontSize: '0.7rem' }}>Project</small> */}
//                           </div>
//                         </div>
//                       </td>
//                       <td className="py-2">
//                         <div className="text-dark" style={{ fontSize: '0.8rem' }}>
//                           {p.description && p.description.length > 100 
//                             ? `${p.description.substring(0, 100)}...` 
//                             : p.description || 'No description'
//                           }
//                         </div>
//                         <small className="text-muted" style={{ fontSize: '0.7rem' }}>
//                           {p.description && p.description.length > 100 ? 'Full description in view' : ''}
//                         </small>
//                       </td>
//                       <td className="py-2">
//                         <div className="d-flex justify-content-center gap-1">
//                           <Button
//                             variant="outline-primary"
//                             size="sm"
//                             className="d-flex align-items-center px-2"
//                             onClick={() => handleView(p)}
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
//                             onClick={() => handleEdit(p)}
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
//                               <Dropdown.Item onClick={() => handleView(p)} style={{ fontSize: '0.8rem' }}>
//                                 <FaEye className="me-2 text-primary" size={10} />
//                                 View Details
//                               </Dropdown.Item>
//                               <Dropdown.Item onClick={() => handleEdit(p)} style={{ fontSize: '0.8rem' }}>
//                                 <FaEdit className="me-2 text-warning" size={10} />
//                                 Edit Project
//                               </Dropdown.Item>
//                               <Dropdown.Divider />
//                               <Dropdown.Item className="text-danger" onClick={() => handleConfirmDelete(p)} style={{ fontSize: '0.8rem' }}>
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
//                     <td colSpan="4" className="text-center py-4">
//                       <div className="text-muted">
//                         <FaSearch size={32} className="mb-2 opacity-25" />
//                         <h6 className="mb-2" style={{ fontSize: '0.9rem' }}>No projects found</h6>
//                         <p className="mb-0" style={{ fontSize: '0.8rem' }}>
//                           {search ? 'Try adjusting your search terms' : 'Get started by adding your first project'}
//                         </p>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </Table>
//           </div>

//           {/* Pagination Section */}
//           {projects.length > 0 && (
//             <div className="p-2 border-top bg-light">
//               <div className="d-flex justify-content-between align-items-center">
//                 <div>
//                   <span className="text-muted" style={{ fontSize: '0.75rem' }}>
//                     Showing <strong>{((page - 1) * size) + 1}-{Math.min(page * size, totalRecords)}</strong> of <strong>{totalRecords}</strong> projects
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

//       {/* ➕ Add/Edit Project Modal */}
//       <Modal show={showModal} onHide={handleClose} centered>
//         <Modal.Header closeButton>
//           <Modal.Title style={{ fontSize: '1rem' }}>
//             {editId ? "Edit Project" : "Add Project"}
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Form.Group className="mb-3">
//               <Form.Label style={{ fontSize: '0.85rem' }}>Project Name</Form.Label>
//               <Form.Control
//                 placeholder="Enter project name"
//                 value={formData.name}
//                 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                 style={{ fontSize: '0.85rem' }}
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label style={{ fontSize: '0.85rem' }}>Description</Form.Label>
//               <Form.Control
//                 as="textarea"
//                 rows={3}
//                 placeholder="Enter project description"
//                 value={formData.description}
//                 onChange={(e) => setFormData({ ...formData, description: e.target.value })}
//                 style={{ fontSize: '0.85rem' }}
//               />
//             </Form.Group>
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="outline-secondary" onClick={handleClose} style={{ fontSize: '0.8rem' }}>
//             Cancel
//           </Button>
//           <Button variant="primary" onClick={handleSave} style={{ fontSize: '0.8rem' }}>
//             {editId ? "Update Project" : "Add Project"}
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* 👁️ View Project Modal */}
//       <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered>
//         <Modal.Header closeButton>
//           <Modal.Title style={{ fontSize: '1rem' }}>Project Details</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {selectedProject && (
//             <div className="text-center">
//               <div className={`rounded-circle d-flex align-items-center justify-content-center text-white mx-auto mb-2 ${getAvatarColor(0)}`}
//                    style={{ width: '60px', height: '60px', fontSize: '1.2rem', fontWeight: '600' }}>
//                 {getInitials(selectedProject.name)}
//               </div>
//               <h5 className="mb-1" style={{ fontSize: '1rem' }}>{selectedProject.name}</h5>
//               <p className="text-muted mb-2" style={{ fontSize: '0.8rem' }}>Project</p>
              
//               <div className="text-start">
//                 <div className="mb-2" style={{ fontSize: '0.85rem' }}>
//                   <strong>Project ID:</strong> {selectedProject.id}
//                 </div>
//                 <div className="mb-2" style={{ fontSize: '0.85rem' }}>
//                   <strong>Description:</strong> 
//                   <p className="mt-1 mb-0 text-muted" style={{ fontSize: '0.8rem' }}>{selectedProject.description}</p>
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

//       {/* 🗑️ Delete Confirmation Modal */}
//       <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
//         <Modal.Header closeButton>
//           <Modal.Title style={{ fontSize: '1rem' }}>Delete Project</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {selectedProject && (
//             <div className="text-center">
//               <div className="mb-3">
//                 <div className={`rounded-circle d-flex align-items-center justify-content-center text-white mx-auto mb-2 ${getAvatarColor(0)}`}
//                      style={{ width: '50px', height: '50px', fontSize: '1rem', fontWeight: '600' }}>
//                   {getInitials(selectedProject.name)}
//                 </div>
//                 <h6 className="mb-1" style={{ fontSize: '0.9rem' }}>{selectedProject.name}</h6>
//               </div>
//               <p className="mb-0" style={{ fontSize: '0.85rem' }}>
//                 Are you sure you want to delete project <strong>"{selectedProject.name}"</strong>?
//                 This action cannot be undone.
//               </p>
//             </div>
//           )}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="outline-secondary" onClick={() => setShowDeleteModal(false)} style={{ fontSize: '0.8rem' }}>
//             Cancel
//           </Button>
//           <Button variant="danger" onClick={() => handleDelete(selectedProject?.id)} style={{ fontSize: '0.8rem' }}>
//             Delete Project
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// }
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
  FaEllipsisH,
  FaCheckCircle,
  FaClock,
  FaPauseCircle,
  FaCalendarAlt,
  FaUserTie,
  FaUserCog,
  FaHourglassHalf,
  FaBan,
  FaCheck,
  FaStopCircle
} from "react-icons/fa";
import API from "@/services/api";

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
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
    status: "planning",  // ✅ Default changed to 'planning'
    startDate: "",
    endDate: ""
  });
  const [editId, setEditId] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // Page size options
  const pageSizeOptions = [5, 10, 20, 50];

  // ✅ NEW: Status options as per requirement - EXACT case-sensitive values
  const statusOptions = [
    "planning",
    "active", 
    "onHold",
    "completed",
    "cancelled"
  ];

  // ✅ Status colors and icons
  const statusColors = {
    "planning": "secondary",
    "active": "success",
    "onHold": "warning",
    "completed": "primary",
    "cancelled": "danger"
  };

  const statusIcons = {
    "planning": <FaHourglassHalf className="me-1" />,
    "active": <FaCheckCircle className="me-1" />,
    "onHold": <FaClock className="me-1" />,
    "completed": <FaCheck className="me-1" />,
    "cancelled": <FaBan className="me-1" />
  };

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
    return name ? name.charAt(0).toUpperCase() : 'P';
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

  // Format status for display (capitalize first letter)
  const formatStatus = (status) => {
    if (!status) return 'planning';
    
    // Special case for onHold -> On Hold
    if (status === 'onHold') return 'On Hold';
    
    // Capitalize first letter
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = "Project name is required";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // 🔍 Fetch Projects with Pagination + Search + Sorting
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

  const handleShow = () => setShowModal(true);
  
  const handleClose = () => {
    setShowModal(false);
    setFormData({ 
      name: "", 
      description: "", 
      projecthead: "",
      projectmanager: "",
      status: "planning",  // ✅ Default 'planning'
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
      const projectData = {
        ...formData,
        ...(!editId && { status: "planning" })  // ✅ New projects default to 'planning'
      };

      if (editId) {
        await API.put(`/project/update/${editId}`, projectData);
      } else {
        await API.post("/project/save", projectData);
      }
      fetchProjects();
      handleClose();
    } catch (err) {
      console.error("Error saving project:", err);
    }
  };

  const handleEdit = (project) => {
    setFormData({
      name: project.name,
      description: project.description || "",
      projecthead: project.projecthead || "",
      projectmanager: project.projectmanager || "",
      status: project.status || "planning",  // ✅ Default to 'planning'
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
    } catch (err) {
      console.error("Error deleting project:", err);
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
          style={{ fontSize: '0.8rem' }}
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
          style={{ fontSize: '0.8rem' }}
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
      <Card className="shadow-sm border-0">
        <Card.Header className="bg-white border-0 py-3">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="mb-0 text-dark fw-bold" style={{ fontSize: '1.1rem' }}>Projects Management</h5>
              <small className="text-muted" style={{ fontSize: '0.75rem' }}>Manage your organization's projects</small>
            </div>
            <Button 
              variant="primary" 
              className="d-flex align-items-center gap-2 px-3"
              onClick={handleShow}
              style={{ fontSize: '0.8rem' }}
            >
              <FaPlus size={12} />
              Add Project
            </Button>
          </div>
        </Card.Header>

        <Card.Body className="p-0">
          <div className="p-3 border-bottom bg-light">
            <div className="row g-3 align-items-center">
              <div className="col-md-6">
                <InputGroup>
                  <Form.Control
                    placeholder="Search projects by name, head, manager..."
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
          </div>

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
                      <span className="fw-semibold text-muted" style={{ fontSize: '0.8rem' }}>Project</span>
                      {getSortIcon("name")}
                    </div>
                  </th>
                  <th style={{ minWidth: "150px" }} className="py-2 fw-semibold text-muted">
                    <FaUserTie className="me-1" size={12} />
                    Project Head
                  </th>
                  <th style={{ minWidth: "150px" }} className="py-2 fw-semibold text-muted">
                    <FaUserCog className="me-1" size={12} />
                    Project Manager
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
                  <th style={{ minWidth: "200px" }} className="py-2 fw-semibold text-muted text-center">Timeline</th>
                  <th style={{ minWidth: "130px" }} className="py-2 fw-semibold text-center text-muted">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      <div className="d-flex justify-content-center align-items-center">
                        <Spinner animation="border" variant="primary" size="sm" className="me-2" />
                        <span className="text-muted" style={{ fontSize: '0.8rem' }}>Loading projects...</span>
                      </div>
                    </td>
                  </tr>
                ) : projects.length > 0 ? (
                  projects.map((p, index) => (
                    <tr key={p.id} className="border-bottom">
                      <td className="py-2">
                        <span className="text-muted fw-medium" style={{ fontSize: '0.8rem' }}>{p.id}</span>
                      </td>
                      <td className="py-2">
                        <div className="d-flex align-items-center">
                          <div className={`rounded-circle d-flex align-items-center justify-content-center text-white me-2 ${getAvatarColor(index)}`}
                               style={{ width: '32px', height: '32px', fontSize: '0.8rem', fontWeight: '600' }}>
                            {getInitials(p.name)}
                          </div>
                          <div>
                            <div className="fw-semibold text-dark" style={{ fontSize: '0.85rem' }}>{p.name}</div>
                            <small className="text-muted" style={{ fontSize: '0.7rem' }}>ID: {p.id}</small>
                          </div>
                        </div>
                      </td>
                      <td className="py-2">
                        <div className="d-flex align-items-center">
                          <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-2"
                               style={{ width: '28px', height: '28px' }}>
                            <FaUserTie size={14} className="text-secondary" />
                          </div>
                          <span style={{ fontSize: '0.8rem' }}>
                            {p.projecthead || '—'}
                          </span>
                        </div>
                      </td>
                      <td className="py-2">
                        <div className="d-flex align-items-center">
                          <div className="bg-light rounded-circle d-flex align-items-center justify-content-center me-2"
                               style={{ width: '28px', height: '28px' }}>
                            <FaUserCog size={14} className="text-secondary" />
                          </div>
                          <span style={{ fontSize: '0.8rem' }}>
                            {p.projectmanager || '—'}
                          </span>
                        </div>
                      </td>
                      <td className="py-2">
                        <Badge 
                          bg={statusColors[p.status] || "secondary"}
                          className="d-flex align-items-center px-2 py-1"
                          style={{ fontWeight: '500', fontSize: '0.75rem', width: 'fit-content' }}
                        >
                          {statusIcons[p.status]}
                          {formatStatus(p.status)}
                        </Badge>
                      </td>
                      <td className="py-2">
                        <div className="d-flex flex-column" style={{ fontSize: '0.75rem' }}>
                          <div className="d-flex align-items-center text-muted mb-1">
                            <FaCalendarAlt className="me-1" size={10} />
                            <span>Start: {formatDate(p.startDate)}</span>
                          </div>
                          <div className="d-flex align-items-center text-muted">
                            <FaCalendarAlt className="me-1" size={10} />
                            <span>End: {formatDate(p.endDate)}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-2">
                        <div className="d-flex justify-content-center gap-1">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="d-flex align-items-center px-2"
                            onClick={() => handleView(p)}
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
                            onClick={() => handleEdit(p)}
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
                              <Dropdown.Item onClick={() => handleView(p)} style={{ fontSize: '0.8rem' }}>
                                <FaEye className="me-2 text-primary" size={10} />
                                View Details
                              </Dropdown.Item>
                              <Dropdown.Item onClick={() => handleEdit(p)} style={{ fontSize: '0.8rem' }}>
                                <FaEdit className="me-2 text-warning" size={10} />
                                Edit Project
                              </Dropdown.Item>
                              <Dropdown.Divider />
                              <Dropdown.Item className="text-danger" onClick={() => handleConfirmDelete(p)} style={{ fontSize: '0.8rem' }}>
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
                        <h6 className="mb-2" style={{ fontSize: '0.9rem' }}>No projects found</h6>
                        <p className="mb-0" style={{ fontSize: '0.8rem' }}>
                          {search ? 'Try adjusting your search terms' : 'Get started by adding your first project'}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>

          {projects.length > 0 && (
            <div className="p-2 border-top bg-light">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                    Showing <strong>{((page - 1) * size) + 1}-{Math.min(page * size, totalRecords)}</strong> of <strong>{totalRecords}</strong> projects
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

      {/* ➕ Add/Edit Project Modal */}
      <Modal show={showModal} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '1rem' }}>
            {editId ? "Edit Project" : "Add Project"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label style={{ fontSize: '0.85rem' }}>Project Name <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter project name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{ fontSize: '0.85rem' }}
                isInvalid={!!formErrors.name}
              />
              <Form.Control.Feedback type="invalid" style={{ fontSize: '0.75rem' }}>
                {formErrors.name}
              </Form.Control.Feedback>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label style={{ fontSize: '0.85rem' }}>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Enter project description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                style={{ fontSize: '0.85rem' }}
              />
            </Form.Group>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontSize: '0.85rem' }}>
                    <FaUserTie className="me-1" size={12} />
                    Project Head
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter project head name"
                    value={formData.projecthead}
                    onChange={(e) => setFormData({ ...formData, projecthead: e.target.value })}
                    style={{ fontSize: '0.85rem' }}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontSize: '0.85rem' }}>
                    <FaUserCog className="me-1" size={12} />
                    Project Manager
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter project manager name"
                    value={formData.projectmanager}
                    onChange={(e) => setFormData({ ...formData, projectmanager: e.target.value })}
                    style={{ fontSize: '0.85rem' }}
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontSize: '0.85rem' }}>
                    <FaCalendarAlt className="me-1" size={12} />
                    Start Date
                  </Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    style={{ fontSize: '0.85rem' }}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label style={{ fontSize: '0.85rem' }}>
                    <FaCalendarAlt className="me-1" size={12} />
                    End Date
                  </Form.Label>
                  <Form.Control
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    style={{ fontSize: '0.85rem' }}
                  />
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label style={{ fontSize: '0.85rem' }}>Status</Form.Label>
              <Form.Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                style={{ fontSize: '0.85rem' }}
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>
                    {formatStatus(status)}
                  </option>
                ))}
              </Form.Select>
              {!editId && (
                <Form.Text className="text-muted" style={{ fontSize: '0.75rem' }}>
                  New projects are created with 'Planning' status
                </Form.Text>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClose} style={{ fontSize: '0.8rem' }}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave} style={{ fontSize: '0.8rem' }}>
            {editId ? "Update Project" : "Add Project"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* 👁️ View Project Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '1rem' }}>Project Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProject && (
            <div>
              <div className="text-center mb-4">
                <div className={`rounded-circle d-flex align-items-center justify-content-center text-white mx-auto mb-2 ${getAvatarColor(0)}`}
                     style={{ width: '70px', height: '70px', fontSize: '1.5rem', fontWeight: '600' }}>
                  {getInitials(selectedProject.name)}
                </div>
                <h5 className="mb-1" style={{ fontSize: '1.1rem' }}>{selectedProject.name}</h5>
                <div className="mb-2">
                  <Badge bg={statusColors[selectedProject.status]} style={{ fontSize: '0.8rem' }}>
                    {statusIcons[selectedProject.status]}
                    {formatStatus(selectedProject.status)}
                  </Badge>
                </div>
                <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>Project ID: {selectedProject.id}</p>
              </div>
              
              <div className="row mb-3">
                <div className="col-md-6">
                  <div className="bg-light p-3 rounded">
                    <div className="d-flex align-items-center mb-2">
                      <FaUserTie size={16} className="text-primary me-2" />
                      <strong style={{ fontSize: '0.85rem' }}>Project Head</strong>
                    </div>
                    <p className="mb-0" style={{ fontSize: '0.9rem' }}>
                      {selectedProject.projecthead || 'Not assigned'}
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="bg-light p-3 rounded">
                    <div className="d-flex align-items-center mb-2">
                      <FaUserCog size={16} className="text-success me-2" />
                      <strong style={{ fontSize: '0.85rem' }}>Project Manager</strong>
                    </div>
                    <p className="mb-0" style={{ fontSize: '0.9rem' }}>
                      {selectedProject.projectmanager || 'Not assigned'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-12">
                  <div className="bg-light p-3 rounded">
                    <strong style={{ fontSize: '0.85rem' }}>Description</strong>
                    <p className="mt-2 mb-0" style={{ fontSize: '0.85rem' }}>
                      {selectedProject.description || 'No description available'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="bg-light p-3 rounded">
                    <strong style={{ fontSize: '0.85rem' }}>Timeline</strong>
                    <div className="mt-2">
                      <div className="d-flex align-items-center mb-2">
                        <FaCalendarAlt className="me-2 text-muted" size={12} />
                        <span style={{ fontSize: '0.85rem' }}>Start: {formatDate(selectedProject.startDate)}</span>
                      </div>
                      <div className="d-flex align-items-center">
                        <FaCalendarAlt className="me-2 text-muted" size={12} />
                        <span style={{ fontSize: '0.85rem' }}>End: {formatDate(selectedProject.endDate)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="bg-light p-3 rounded">
                    <strong style={{ fontSize: '0.85rem' }}>Additional Info</strong>
                    <div className="mt-2">
                      <div className="d-flex align-items-center mb-2">
                        <span className="text-muted me-2" style={{ fontSize: '0.8rem' }}>Created:</span>
                        <span style={{ fontSize: '0.8rem' }}>Recently</span>
                      </div>
                      <div className="d-flex align-items-center">
                        <span className="text-muted me-2" style={{ fontSize: '0.8rem' }}>Last Updated:</span>
                        <span style={{ fontSize: '0.8rem' }}>Recently</span>
                      </div>
                    </div>
                  </div>
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

      {/* 🗑️ Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '1rem' }}>Delete Project</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProject && (
            <div className="text-center">
              <div className="mb-3">
                <div className={`rounded-circle d-flex align-items-center justify-content-center text-white mx-auto mb-2 ${getAvatarColor(0)}`}
                     style={{ width: '50px', height: '50px', fontSize: '1rem', fontWeight: '600' }}>
                  {getInitials(selectedProject.name)}
                </div>
                <h6 className="mb-1" style={{ fontSize: '0.9rem' }}>{selectedProject.name}</h6>
                <Badge bg={statusColors[selectedProject.status]} style={{ fontSize: '0.7rem' }}>
                  {statusIcons[selectedProject.status]}
                  {formatStatus(selectedProject.status)}
                </Badge>
                {selectedProject.projecthead && (
                  <div className="mt-2">
                    <small className="text-muted d-block" style={{ fontSize: '0.75rem' }}>
                      <FaUserTie className="me-1" size={10} />
                      Head: {selectedProject.projecthead}
                    </small>
                  </div>
                )}
              </div>
              <p className="mb-0" style={{ fontSize: '0.85rem' }}>
                Are you sure you want to delete project <strong>"{selectedProject.name}"</strong>?
                This action cannot be undone.
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowDeleteModal(false)} style={{ fontSize: '0.8rem' }}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => handleDelete(selectedProject?.id)} style={{ fontSize: '0.8rem' }}>
            Delete Project
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProjectsPage;