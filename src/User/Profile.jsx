import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Breadcrumb,
  ListGroup,
  Form,
} from 'react-bootstrap';
import Avatar from 'react-avatar';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileInfo, setProfileInfo] = useState({
    fullName: 'Johnatan Smith',
    email: 'example@example.com',
    phone: '(097) 234-5678',
    mobile: '(098) 765-4321',
    address: 'Bay Area, San Francisco, CA',
    facebook: 'https://mdbootstrap.com',
    twitter: 'mdbootstrap',
    instagram: '@mdbootstrap',
    linkedin: 'mdbootstrap',
  });
  const navigate = useNavigate();

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileInfo({
      ...profileInfo,
      [name]: value,
    });
  };

  return (
    <section style={{ backgroundColor: '#eee' }}>
      <Container className="py-5">
        <Row>
          <Col>
            <Breadcrumb className="bg-light rounded-3 p-3 mb-4">
              <Breadcrumb.Item onClick={() => navigate('/Dashboard')} >Home</Breadcrumb.Item>
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
                  <Button variant="outline-primary btn-block" className="ms-1">Change password</Button>
                  <Button variant="outline-secondary btn-block" className="ms-1" onClick={handleEditClick}>
                    {isEditing ? 'Cancel' : 'Edit information'}
                  </Button>
                </div>
              </Card.Body>
            </Card>

            <Card className="mb-4 mb-lg-0">
              <Card.Body className="p-0">
                <ListGroup variant="flush">
                  <ListGroup.Item className="d-flex justify-content-between align-items-center p-3">
                    <i className="bi bi-facebook fs-1"></i>
                    {isEditing ? (
                      <Form.Control
                        type="text"
                        name="facebook"
                        value={profileInfo.facebook}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <Card.Text>{profileInfo.facebook}</Card.Text>
                    )}
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between align-items-center p-3">
                    <i className="bi bi-twitter-x fs-1"></i>
                    {isEditing ? (
                      <Form.Control
                        type="text"
                        name="twitter"
                        value={profileInfo.twitter}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <Card.Text>{profileInfo.twitter}</Card.Text>
                    )}
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between align-items-center p-3">
                    <i className="bi bi-instagram fs-1"></i>
                    {isEditing ? (
                      <Form.Control
                        type="text"
                        name="instagram"
                        value={profileInfo.instagram}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <Card.Text>{profileInfo.instagram}</Card.Text>
                    )}
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between align-items-center p-3">
                    <i className="bi bi-linkedin fs-1"></i>
                    {isEditing ? (
                      <Form.Control
                        type="text"
                        name="linkedin"
                        value={profileInfo.linkedin}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <Card.Text>{profileInfo.linkedin}</Card.Text>
                    )}
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
                      <Card.Text className="text-muted">{profileInfo.fullName}</Card.Text>
                    </Col>
                  </Row>
                  <hr />
                  <Row>
                    <Col sm="3">
                      <Card.Text>Email</Card.Text>
                    </Col>
                    <Col sm="9">
                      <Card.Text className="text-muted">{profileInfo.email}</Card.Text>
                    </Col>
                  </Row>
                  <hr />
                  <Row>
                    <Col sm="3">
                      <Card.Text>Phone</Card.Text>
                    </Col>
                    <Col sm="9">
                      <Card.Text className="text-muted">{profileInfo.phone}</Card.Text>
                    </Col>
                  </Row>
                  <hr />
                  <Row>
                    <Col sm="3">
                      <Card.Text>Mobile</Card.Text>
                    </Col>
                    <Col sm="9">
                      <Card.Text className="text-muted">{profileInfo.mobile}</Card.Text>
                    </Col>
                  </Row>
                  <hr />
                  <Row>
                    <Col sm="3">
                      <Card.Text>Address</Card.Text>
                    </Col>
                    <Col sm="9">
                      <Card.Text className="text-muted">{profileInfo.address}</Card.Text>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </fieldset>

            <fieldset className="border rounded mb-4 p-3">
              <legend className=" p-2 rounded">More Information</legend>
              <Card className="mb-4">
                <Card.Body>
                  <Row>
                    <Col sm="3">
                      <Card.Text>Full Name</Card.Text>
                    </Col>
                    <Col sm="9">
                      {isEditing ? (
                        <Form.Control
                          type="text"
                          name="fullName"
                          value={profileInfo.fullName}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <Card.Text className="text-muted">{profileInfo.fullName}</Card.Text>
                      )}
                    </Col>
                  </Row>
                  <hr />
                  <Row>
                    <Col sm="3">
                      <Card.Text>Email</Card.Text>
                    </Col>
                    <Col sm="9">
                      {isEditing ? (
                        <Form.Control
                          type="email"
                          name="email"
                          value={profileInfo.email}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <Card.Text className="text-muted">{profileInfo.email}</Card.Text>
                      )}
                    </Col>
                  </Row>
                  <hr />
                  <Row>
                    <Col sm="3">
                      <Card.Text>Phone</Card.Text>
                    </Col>
                    <Col sm="9">
                      {isEditing ? (
                        <Form.Control
                          type="text"
                          name="phone"
                          value={profileInfo.phone}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <Card.Text className="text-muted">{profileInfo.phone}</Card.Text>
                      )}
                    </Col>
                  </Row>
                  <hr />
                  <Row>
                    <Col sm="3">
                      <Card.Text>Mobile</Card.Text>
                    </Col>
                    <Col sm="9">
                      {isEditing ? (
                        <Form.Control
                          type="text"
                          name="mobile"
                          value={profileInfo.mobile}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <Card.Text className="text-muted">{profileInfo.mobile}</Card.Text>
                      )}
                    </Col>
                  </Row>
                  <hr />
                  <Row>
                    <Col sm="3">
                      <Card.Text>Address</Card.Text>
                    </Col>
                    <Col sm="9">
                      {isEditing ? (
                        <Form.Control
                          type="text"
                          name="address"
                          value={profileInfo.address}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <Card.Text className="text-muted">{profileInfo.address}</Card.Text>
                      )}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </fieldset>

            {isEditing && (
              <div className="d-flex justify-content-end mt-3 pe-3">
                <Button
                  className="me-3"
                  variant="primary"
                  size="lg"
                  onClick={() => setIsEditing(false)}
                >
                  Save
                </Button>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default ProfilePage;