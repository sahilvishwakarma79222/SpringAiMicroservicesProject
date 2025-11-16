"use client";
import React, { useEffect, useState } from "react";
import API from "@/services/api";
import { Card, Button, Row, Col, Spinner, ProgressBar, Badge } from "react-bootstrap";
import { useRouter } from "next/navigation";
import { 
  FaUsers, 
  FaProjectDiagram, 
  FaTasks, 
  FaArrowUp,
  FaArrowDown,
  FaClock,
  FaCheckCircle
} from "react-icons/fa";

export default function HomePage() {
  const router = useRouter();
  const [counts, setCounts] = useState({
    employees: 0,
    projects: 0,
    tasks: 0,
    completedTasks: 0,
    pendingTasks: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentTasks, setRecentTasks] = useState([]);

  const fetchCounts = async () => {
    try {
      const [empRes, projRes, tasksRes] = await Promise.all([
        API.get("/employee/getEmployeeCount"),
        API.get("/project/getProjectsCount"),
        API.get("/task/all")
      ]);

      const tasks = tasksRes.data?.results || tasksRes.data || [];
      
      // Normalize status values for consistent comparison
      const completedTasks = tasks.filter(task => {
        const status = task.status?.toUpperCase();
        return status === 'COMPLETED' || status === 'DONE';
      }).length;
      
      const pendingTasks = tasks.filter(task => {
        const status = task.status?.toUpperCase();
        return status === 'PENDING' || status === 'IN_PROGRESS' || status === 'ONGOING' || status === 'IN PROGRESS';
      }).length;

      setCounts({
        employees: empRes.data || 0,
        projects: projRes.data || 0,
        tasks: tasks.length,
        completedTasks,
        pendingTasks
      });

      // Set recent tasks with proper field mapping
      setRecentTasks(tasks.slice(0, 5));
    } catch (error) {
      console.error("Error fetching counts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCounts();
  }, []);

  const handleManageClick = (path) => {
    router.push(path);
  };

  const getStatusVariant = (status) => {
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
      default: 
        return 'primary';
    }
  };

  return (
    <div className="container-fluid py-3" style={{ minHeight: 'calc(100vh - 56px)' }}>
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h3 className="text-dark fw-bold mb-1" style={{ fontSize: '1.4rem' }}>Dashboard Overview</h3>
          <p className="text-muted mb-0" style={{ fontSize: '0.875rem' }}>Welcome back! Here's what's happening today.</p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-primary" size="sm" style={{ fontSize: '0.8rem' }}>
            {new Date().toLocaleDateString()}
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center mt-5 py-5">
          <Spinner animation="border" variant="primary" size="sm" />
          <p className="mt-2 text-muted" style={{ fontSize: '0.875rem' }}>Loading dashboard data...</p>
        </div>
      ) : (
        <>
          {/* Stats Cards Row */}
          <Row className="g-3 mb-4">
            {/* Employees Card */}
            <Col xl={3} lg={4} md={6}>
              <Card className="shadow-sm border-0 h-100">
                <Card.Body className="p-3">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 className="text-muted mb-2" style={{ fontSize: '0.8rem' }}>Total Employees</h6>
                      <h3 className="fw-bold text-primary mb-0" style={{ fontSize: '1.8rem' }}>{counts.employees}</h3>
                      <div className="d-flex align-items-center mt-1">
                        <FaArrowUp className="text-success me-1" size={10} />
                        <small className="text-success" style={{ fontSize: '0.75rem' }}>+12% from last month</small>
                      </div>
                    </div>
                    <div className="bg-primary bg-opacity-10 rounded p-2">
                      <FaUsers className="text-primary" size={20} />
                    </div>
                  </div>
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    className="mt-2 w-100"
                    onClick={() => handleManageClick("/employees")}
                    style={{ fontSize: '0.8rem' }}
                  >
                    Manage Employees
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            {/* Projects Card */}
            <Col xl={3} lg={4} md={6}>
              <Card className="shadow-sm border-0 h-100">
                <Card.Body className="p-3">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 className="text-muted mb-2" style={{ fontSize: '0.8rem' }}>Active Projects</h6>
                      <h3 className="fw-bold text-success mb-0" style={{ fontSize: '1.8rem' }}>{counts.projects}</h3>
                      <div className="d-flex align-items-center mt-1">
                        <FaArrowUp className="text-success me-1" size={10} />
                        <small className="text-success" style={{ fontSize: '0.75rem' }}>+5% from last month</small>
                      </div>
                    </div>
                    <div className="bg-success bg-opacity-10 rounded p-2">
                      <FaProjectDiagram className="text-success" size={20} />
                    </div>
                  </div>
                  <Button 
                    variant="outline-success" 
                    size="sm" 
                    className="mt-2 w-100"
                    onClick={() => handleManageClick("/projects")}
                    style={{ fontSize: '0.8rem' }}
                  >
                    View Projects
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            {/* Tasks Card */}
            <Col xl={3} lg={4} md={6}>
              <Card className="shadow-sm border-0 h-100">
                <Card.Body className="p-3">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 className="text-muted mb-2" style={{ fontSize: '0.8rem' }}>Total Tasks</h6>
                      <h3 className="fw-bold text-warning mb-0" style={{ fontSize: '1.8rem' }}>{counts.tasks}</h3>
                      <div className="d-flex align-items-center mt-1">
                        <FaArrowDown className="text-danger me-1" size={10} />
                        <small className="text-danger" style={{ fontSize: '0.75rem' }}>-3% from last week</small>
                      </div>
                    </div>
                    <div className="bg-warning bg-opacity-10 rounded p-2">
                      <FaTasks className="text-warning" size={20} />
                    </div>
                  </div>
                  <Button 
                    variant="outline-warning" 
                    size="sm" 
                    className="mt-2 w-100"
                    onClick={() => handleManageClick("/tasks")}
                    style={{ fontSize: '0.8rem' }}
                  >
                    View Tasks
                  </Button>
                </Card.Body>
              </Card>
            </Col>

            {/* Completion Rate Card */}
            <Col xl={3} lg={4} md={6}>
              <Card className="shadow-sm border-0 h-100">
                <Card.Body className="p-3">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 className="text-muted mb-2" style={{ fontSize: '0.8rem' }}>Completion Rate</h6>
                      <h3 className="fw-bold text-info mb-0" style={{ fontSize: '1.8rem' }}>
                        {counts.tasks > 0 ? Math.round((counts.completedTasks / counts.tasks) * 100) : 0}%
                      </h3>
                      <div className="mt-1">
                        <ProgressBar 
                          now={counts.tasks > 0 ? (counts.completedTasks / counts.tasks) * 100 : 0} 
                          variant="info"
                          style={{ height: '4px' }}
                        />
                      </div>
                    </div>
                    <div className="bg-info bg-opacity-10 rounded p-2">
                      <FaCheckCircle className="text-info" size={20} />
                    </div>
                  </div>
                  <div className="mt-2">
                    <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                      {counts.completedTasks} of {counts.tasks} tasks completed
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Second Row - Recent Tasks Full Width */}
          <Row className="g-3">
            {/* Recent Tasks - Full Width */}
            <Col xl={12} lg={12}>
              <Card className="shadow-sm border-0 h-100">
                <Card.Header className="bg-white border-0 py-2">
                  <h5 className="mb-0 d-flex align-items-center gap-2" style={{ fontSize: '1rem' }}>
                    <FaClock className="text-warning" size={16} />
                    Recent Tasks
                  </h5>
                </Card.Header>
                <Card.Body className="p-0">
                  {recentTasks.length > 0 ? (
                    <div className="list-group list-group-flush">
                      {recentTasks.map((task, index) => (
                        <div 
                          key={task.id || index} 
                          className="list-group-item border-0 px-3 py-2"
                        >
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1">
                              <h6 className="mb-1" style={{ fontSize: '0.85rem' }}>{task.title}</h6>
                              <div className="d-flex align-items-center gap-2 flex-wrap">
                                <Badge bg={getStatusVariant(task.status)} style={{ fontSize: '0.7rem' }}>
                                  {task.status}
                                </Badge>
                                <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                                  Assigned to: {task.employeeName || 'Unassigned'}
                                </small>
                                <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                                  {task.assignedDate ? new Date(task.assignedDate).toLocaleDateString() : 'No date'}
                                </small>
                              </div>
                            </div>
                            <div className="text-end">
                              <small className="text-muted d-block" style={{ fontSize: '0.7rem' }}>#{task.id}</small>
                              <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                                {task.projectName || 'No project'}
                              </small>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <FaTasks size={28} className="text-muted mb-2" />
                      <p className="text-muted mb-0" style={{ fontSize: '0.875rem' }}>No recent tasks</p>
                    </div>
                  )}
                  <div className="p-2 border-top">
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      className="w-100"
                      onClick={() => handleManageClick("/tasks")}
                      style={{ fontSize: '0.8rem' }}
                    >
                      View All Tasks
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </div>
  );
}