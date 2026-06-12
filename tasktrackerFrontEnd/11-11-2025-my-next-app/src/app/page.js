"use client";
import React, { useEffect, useState } from "react";
import API from "@/services/api";
import { Card, Button, Row, Col, Spinner, Badge, Table } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { 
  FaUsers, 
  FaProjectDiagram, 
  FaTasks, 
  FaBug,
  FaEye,
  FaArrowRight,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
  FaSpinner
} from "react-icons/fa";

export default function HomePage() {
  const router = useRouter();
  const [counts, setCounts] = useState({
    employees: 0,
    projects: 0,
    tasks: 0,
    openErrors: 0,
    completedTasks: 0,
    inProgressTasks: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentTasks, setRecentTasks] = useState([]);
  const [recentErrors, setRecentErrors] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);

  const fetchData = async () => {
    try {
      const [empRes, projRes, tasksRes, errorsRes] = await Promise.all([
        API.get("/employee/smart?page=1&size=100"),
        API.get("/project/smart?page=1&size=100"),
        API.get("/task/smart?page=1&size=100"),
        API.get("/errors/smart?page=1&size=100")
      ]);

      const employees = empRes.data?.results || empRes.data || [];
      const projectsData = projRes.data?.results || projRes.data || [];
      const tasks = tasksRes.data?.results || tasksRes.data || [];
      const errors = errorsRes.data?.results || errorsRes.data || [];

      const completedTasks = tasks.filter(t => {
        const status = t.status?.toUpperCase();
        return status === 'COMPLETED' || status === 'DONE';
      }).length;

      const inProgressTasks = tasks.filter(t => {
        const status = t.status?.toUpperCase();
        return status === 'IN_PROGRESS' || status === 'ONGOING';
      }).length;

      const openErrors = errors.filter(e => {
        const status = e.status?.toUpperCase();
        return status === 'OPEN';
      }).length;

      setCounts({
        employees: employees.length,
        projects: projectsData.length,
        tasks: tasks.length,
        openErrors: openErrors,
        completedTasks: completedTasks,
        inProgressTasks: inProgressTasks
      });

      setRecentProjects(projectsData.slice(0, 5));
      setRecentTasks(tasks.slice(0, 5));
      setRecentErrors(errors.slice(0, 5));
      
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleNavigate = (path, id) => {
    if (id) {
      router.push(`${path}?id=${id}`);
    } else {
      router.push(path);
    }
  };

  const getStatusBadge = (status) => {
    const s = status?.toUpperCase();
    if (s === 'COMPLETED' || s === 'DONE' || s === 'RESOLVED') return 'success';
    if (s === 'IN_PROGRESS' || s === 'ONGOING') return 'warning';
    if (s === 'PENDING') return 'danger';
    if (s === 'OPEN') return 'danger';
    if (s === 'ACTIVE') return 'success';
    if (s === 'PLANNING') return 'secondary';
    return 'secondary';
  };

  const getProjectName = (projectId) => {
    const project = recentProjects.find(p => p.id === projectId);
    return project ? project.name : `Project #${projectId}`;
  };

  const shortenText = (text, maxLength = 30) => {
    if (!text) return '—';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const completionRate = counts.tasks > 0 ? Math.round((counts.completedTasks / counts.tasks) * 100) : 0;

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 56px)', background: '#f0f2f5' }}>
        <Spinner animation="border" variant="primary" size="lg" />
      </div>
    );
  }

  return (
    <div style={{ background: '#f0f2f5', minHeight: 'calc(100vh - 56px)' }}>
      <div className="px-4 py-4">
        
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h4 className="mb-0 fw-bold" style={{ color: '#1a1a2e' }}>Dashboard</h4>
            <small className="text-secondary">System overview</small>
          </div>
          <div className="d-flex align-items-center gap-2 text-secondary">
            <FaCalendarAlt size={13} />
            <small>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</small>
          </div>
        </div>

        {/* Stats Cards - 6 cards */}
        <div className="row g-3 mb-4">
          <div className="col-xl-2 col-lg-4 col-md-6">
            <Card className="border-0 shadow-sm h-100" style={{ cursor: 'pointer' }} onClick={() => handleNavigate("/employees")}>
              <Card.Body className="p-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <small className="text-secondary text-uppercase">Employees</small>
                    <h3 className="fw-bold mb-0 mt-1" style={{ color: '#3b82f6' }}>{counts.employees}</h3>
                  </div>
                  <div className="rounded p-2" style={{ background: '#3b82f610' }}>
                    <FaUsers size={22} color="#3b82f6" />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
          <div className="col-xl-2 col-lg-4 col-md-6">
            <Card className="border-0 shadow-sm h-100" style={{ cursor: 'pointer' }} onClick={() => handleNavigate("/projects")}>
              <Card.Body className="p-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <small className="text-secondary text-uppercase">Projects</small>
                    <h3 className="fw-bold mb-0 mt-1" style={{ color: '#10b981' }}>{counts.projects}</h3>
                  </div>
                  <div className="rounded p-2" style={{ background: '#10b98110' }}>
                    <FaProjectDiagram size={22} color="#10b981" />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
          <div className="col-xl-2 col-lg-4 col-md-6">
            <Card className="border-0 shadow-sm h-100" style={{ cursor: 'pointer' }} onClick={() => handleNavigate("/tasks")}>
              <Card.Body className="p-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <small className="text-secondary text-uppercase">Tasks</small>
                    <h3 className="fw-bold mb-0 mt-1" style={{ color: '#f59e0b' }}>{counts.tasks}</h3>
                  </div>
                  <div className="rounded p-2" style={{ background: '#f59e0b10' }}>
                    <FaTasks size={22} color="#f59e0b" />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
          <div className="col-xl-2 col-lg-4 col-md-6">
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="p-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <small className="text-secondary text-uppercase">Completed</small>
                    <h3 className="fw-bold mb-0 mt-1" style={{ color: '#22c55e' }}>{counts.completedTasks}</h3>
                  </div>
                  <div className="rounded p-2" style={{ background: '#22c55e10' }}>
                    <FaCheckCircle size={22} color="#22c55e" />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
          <div className="col-xl-2 col-lg-4 col-md-6">
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="p-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <small className="text-secondary text-uppercase">In Progress</small>
                    <h3 className="fw-bold mb-0 mt-1" style={{ color: '#eab308' }}>{counts.inProgressTasks}</h3>
                  </div>
                  <div className="rounded p-2" style={{ background: '#eab30810' }}>
                    <FaSpinner size={22} color="#eab308" />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
          <div className="col-xl-2 col-lg-4 col-md-6">
            <Card className="border-0 shadow-sm h-100" style={{ cursor: 'pointer' }} onClick={() => handleNavigate("/errors")}>
              <Card.Body className="p-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <small className="text-secondary text-uppercase">Open Errors</small>
                    <h3 className="fw-bold mb-0 mt-1" style={{ color: '#ef4444' }}>{counts.openErrors}</h3>
                  </div>
                  <div className="rounded p-2" style={{ background: '#ef444410' }}>
                    <FaBug size={22} color="#ef4444" />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-3 shadow-sm p-3 mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div>
              <span className="fw-semibold" style={{ fontSize: '0.85rem' }}>Overall Completion</span>
              <Badge bg="success" className="ms-2">{completionRate}%</Badge>
            </div>
            <small className="text-muted">{counts.completedTasks} / {counts.tasks} tasks</small>
          </div>
          <div className="progress" style={{ height: '6px' }}>
            <div className="progress-bar bg-success" style={{ width: `${completionRate}%` }}></div>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-white rounded-3 shadow-sm mb-4">
          <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2">
              <FaProjectDiagram size={18} color="#10b981" />
              <h6 className="fw-semibold mb-0">Recent Projects</h6>
              <Badge bg="light" text="dark" className="ms-2">{recentProjects.length}</Badge>
            </div>
            <Button variant="link" size="sm" className="p-0 text-decoration-none" onClick={() => handleNavigate("/projects")}>
              View All <FaArrowRight size={12} className="ms-1" />
            </Button>
          </div>
          <div className="table-responsive">
            <Table hover className="mb-0 align-middle" size="sm" style={{ fontSize: '0.8rem' }}>
              <thead className="bg-light">
                <tr>
                  <th className="ps-3 py-2" style={{ width: '15%' }}>ID</th>
                  <th className="py-2" style={{ width: '40%' }}>Name</th>
                  <th className="py-2" style={{ width: '25%' }}>Head</th>
                  <th className="py-2" style={{ width: '20%' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentProjects.length > 0 ? (
                  recentProjects.map((project) => (
                    <tr key={project.id} style={{ cursor: 'pointer' }} onClick={() => handleNavigate("/projects", project.id)}>
                      <td className="ps-3 py-2 text-secondary">#{project.id}</td>
                      <td className="py-2 fw-medium">{shortenText(project.name, 35)}</td>
                      <td className="py-2">{shortenText(project.projecthead, 20)}</td>
                      <td className="py-2"><Badge bg={getStatusBadge(project.status)}>{project.status || 'Planning'}</Badge></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-secondary">No projects found</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="bg-white rounded-3 shadow-sm mb-4">
          <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2">
              <FaTasks size={18} color="#f59e0b" />
              <h6 className="fw-semibold mb-0">Recent Tasks</h6>
              <Badge bg="light" text="dark" className="ms-2">{recentTasks.length}</Badge>
            </div>
            <Button variant="link" size="sm" className="p-0 text-decoration-none" onClick={() => handleNavigate("/tasks")}>
              View All <FaArrowRight size={12} className="ms-1" />
            </Button>
          </div>
          <div className="table-responsive">
            <Table hover className="mb-0 align-middle" size="sm" style={{ fontSize: '0.8rem' }}>
              <thead className="bg-light">
                <tr>
                  <th className="ps-3 py-2" style={{ width: '12%' }}>ID</th>
                  <th className="py-2" style={{ width: '33%' }}>Title</th>
                  <th className="py-2" style={{ width: '25%' }}>Project</th>
                  <th className="py-2" style={{ width: '15%' }}>Status</th>
                  <th className="pe-3 py-2 text-center" style={{ width: '15%' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentTasks.length > 0 ? (
                  recentTasks.map((task) => (
                    <tr key={task.id} style={{ cursor: 'pointer' }} onClick={() => handleNavigate("/tasks", task.id)}>
                      <td className="ps-3 py-2 text-secondary">#{task.id}</td>
                      <td className="py-2 fw-medium">{shortenText(task.title, 35)}</td>
                      <td className="py-2">{shortenText(task.projectName, 25)}</td>
                      <td className="py-2"><Badge bg={getStatusBadge(task.status)}>{task.status || 'Assigned'}</Badge></td>
                      <td className="pe-3 py-2 text-center"><FaEye size={14} className="text-secondary" /></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-secondary">No tasks found</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </div>

        {/* Recent Errors */}
        <div className="bg-white rounded-3 shadow-sm">
          <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2">
              <FaBug size={18} color="#ef4444" />
              <h6 className="fw-semibold mb-0">Recent Errors</h6>
              <Badge bg="light" text="dark" className="ms-2">{recentErrors.length}</Badge>
            </div>
            <Button variant="link" size="sm" className="p-0 text-decoration-none" onClick={() => handleNavigate("/errors")}>
              View All <FaArrowRight size={12} className="ms-1" />
            </Button>
          </div>
          <div className="table-responsive">
            <Table hover className="mb-0 align-middle" size="sm" style={{ fontSize: '0.8rem' }}>
              <thead className="bg-light">
                <tr>
                  <th className="ps-3 py-2" style={{ width: '12%' }}>ID</th>
                  <th className="py-2" style={{ width: '38%' }}>Title</th>
                  <th className="py-2" style={{ width: '25%' }}>Project</th>
                  <th className="py-2" style={{ width: '15%' }}>Status</th>
                  <th className="pe-3 py-2 text-center" style={{ width: '10%' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentErrors.length > 0 ? (
                  recentErrors.map((error) => (
                    <tr key={error.id} style={{ cursor: 'pointer' }} onClick={() => handleNavigate("/errors", error.id)}>
                      <td className="ps-3 py-2 text-secondary">#{error.id}</td>
                      <td className="py-2 fw-medium">{shortenText(error.title, 35)}</td>
                      <td className="py-2">{shortenText(getProjectName(error.projectId), 25)}</td>
                      <td className="py-2"><Badge bg={getStatusBadge(error.status)}>{error.status || 'Open'}</Badge></td>
                      <td className="pe-3 py-2 text-center"><FaEye size={14} className="text-secondary" /></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-4 text-secondary">No errors found</td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}