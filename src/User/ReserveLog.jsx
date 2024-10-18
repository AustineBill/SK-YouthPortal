import React from 'react';
import { Row, Col, Table, Button, Breadcrumb, Container } from 'react-bootstrap';
import { FaCalendarAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ReservationLog = () => {
  const navigate = useNavigate();

  return (
    <div className="container-fluid">
      <Breadcrumb className="ms-5">
        <Breadcrumb.Item onClick={() => navigate('/Dashboard')}>Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Reservation Log</Breadcrumb.Item>
      </Breadcrumb>

      <div className="text-center text-lg-start m-4 mv-8 mb-3">
        <h1 className="Maintext animated slideInRight">Reservation Log</h1>
        <p className="Subtext">Don't Miss out, Explore now</p> 
      </div> 

      
      <Container> 
        <Row className="mb-4">
          <Col className="d-flex justify-content-end">
            <Button variant="outline-secondary" onClick={() => navigate('/UserProgram')}>
              <FaCalendarAlt /> 00/00/0000
            </Button>
          </Col>
        </Row>

        <Table striped bordered hover className="mt-4">
          <thead>
            <tr>
              <th>Date</th>
              <th>Programs</th>
              <th>Status</th>
              <th style={{ width: '120px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {/* Placeholder rows with action buttons */}
            {[...Array(1)].map((_, index) => (
              <tr key={index}>
                <td>00/00/0000</td>
                <td>Program {index + 1}</td>
                <td>Pending</td>
                <td className="d-flex justify-content-center">
                  <Button variant="primary" size="sm" onClick={() => navigate('/ReservationDetails')}>
                    View
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </div>
  );
};

export default ReservationLog;
