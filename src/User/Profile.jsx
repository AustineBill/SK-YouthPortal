import React from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Breadcrumb,
  ListGroup,
} from 'react-bootstrap';
import Avatar from 'react-avatar';


export default function ProfilePage() {
  return (
    <section style={{ backgroundColor: '#eee' }}>
      <Container className="py-5">
        <Row>
          <Col>
            <Breadcrumb className="bg-light rounded-3 p-3 mb-4">
              <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
              <Breadcrumb.Item href="#">User</Breadcrumb.Item>
              <Breadcrumb.Item active>User Profile</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>

        <Row>
          <Col lg="4">
            <Card className="mb-4 text-center">
              <Card.Body>
                <Avatar className="m-2" name="Wim Mostmans" round={true} size="150" />
                <Card.Text className="m-2 fs-2">Full Stack Developer</Card.Text>
                <Card.Text className="text-muted mb-1">Full Stack Developer</Card.Text>
                <Card.Text className="text-muted mb-4">Bay Area, San Francisco, CA</Card.Text>
                <div className="d-flex justify-content-center mb-2">
                  <Button variant="outline-primary btn-block" className="ms-1" >Change password</Button>
                  <Button variant="outline-secondary btn-block" className="ms-1">Edit information</Button>
                </div>
              </Card.Body>
            </Card>

            <Card className="mb-4 mb-lg-0">
              <Card.Body className="p-0">
                <ListGroup variant="flush">
                  <ListGroup.Item className="d-flex justify-content-between align-items-center p-3">
                  <i class="bi bi-facebook fs-1" ></i>
                    <Card.Text>https://mdbootstrap.com</Card.Text>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between align-items-center p-3">
                  <i class="bi bi-twitter-x fs-1" ></i>
                    <Card.Text>mdbootstrap</Card.Text>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between align-items-center p-3">
                  <i class="bi bi-instagram fs-1" ></i>
                    <Card.Text>@mdbootstrap</Card.Text>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between align-items-center p-3">
                  <i class="bi bi-linkedin fs-1" ></i>
                    <Card.Text>mdbootstrap</Card.Text>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>

          <Col lg="8">
          <fieldset className="border p-2">
            <legend className="w-auto">Profile Details</legend>
            <Card className="mb-4">
              <Card.Body>
                <Row>
                  <Col sm="3">
                    <Card.Text>Full Name</Card.Text>
                  </Col>
                  <Col sm="9">
                    <Card.Text className="text-muted">Johnatan Smith</Card.Text>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col sm="3">
                    <Card.Text>Email</Card.Text>
                  </Col>
                  <Col sm="9">
                    <Card.Text className="text-muted">example@example.com</Card.Text>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col sm="3">
                    <Card.Text>Phone</Card.Text>
                  </Col>
                  <Col sm="9">
                    <Card.Text className="text-muted">(097) 234-5678</Card.Text>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col sm="3">
                    <Card.Text>Mobile</Card.Text>
                  </Col>
                  <Col sm="9">
                    <Card.Text className="text-muted">(098) 765-4321</Card.Text>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col sm="3">
                    <Card.Text>Address</Card.Text>
                  </Col>
                  <Col sm="9">
                    <Card.Text className="text-muted">Bay Area, San Francisco, CA</Card.Text>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </fieldset>

            <fieldset className="border p-2">
              <legend className="w-auto">Profile Details</legend>
              <Card className="mb-4">
                <Card.Body>
                  <Row>
                    <Col sm="3">
                      <Card.Text>Full Name</Card.Text>
                    </Col>
                    <Col sm="9">
                      <Card.Text className="text-muted">Johnatan Smith</Card.Text>
                    </Col>
                  </Row>
                  <hr />
                  <Row>
                    <Col sm="3">
                      <Card.Text>Email</Card.Text>
                    </Col>
                    <Col sm="9">
                      <Card.Text className="text-muted">example@example.com</Card.Text>
                    </Col>
                  </Row>
                  <hr />
                  <Row>
                    <Col sm="3">
                      <Card.Text>Phone</Card.Text>
                    </Col>
                    <Col sm="9">
                      <Card.Text className="text-muted">(097) 234-5678</Card.Text>
                    </Col>
                  </Row>
                  <hr />
                  <Row>
                    <Col sm="3">
                      <Card.Text>Mobile</Card.Text>
                    </Col>
                    <Col sm="9">
                      <Card.Text className="text-muted">(098) 765-4321</Card.Text>
                    </Col>
                  </Row>
                  <hr />
                  <Row>
                    <Col sm="3">
                      <Card.Text>Address</Card.Text>
                    </Col>
                    <Col sm="9">
                      <Card.Text className="text-muted">Bay Area, San Francisco, CA</Card.Text>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </fieldset>


          </Col>
        </Row>
      </Container>
    </section>
  );
}
