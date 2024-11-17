import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  const [profileInfo, setProfileInfo] = useState(null);
  const { username } = useParams(); // Corrected useParams invocation
  const navigate = useNavigate();

  console.log("Fetching profile for username:", username);

  useEffect(() => {

    const fetchProfile = async () => {
      try {
        console.log('Fetching profile for username:', username); // Add logging here
        const response = await fetch(`http://localhost:5000/Profile/${username}?_=${new Date().getTime()}`);
        console.log('Response Status:', response.status); // Check response status
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const userData = await response.json();
        //console.log('Fetched User Data:', userData); // Log the response data
        setProfileInfo(userData);
      } catch (error) {
        console.error('Error fetching profile:', error); // Handle any errors here
      }
    };
    if (username) fetchProfile();
  }, [username]);

  
  if (!profileInfo && profileInfo !== null) {
    return <div>Loading...</div>; // While waiting for profileInfo to load
  }

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  return (
    <section style={{ backgroundColor: '#eee' }}>
      <Container className="py-5">
        <Row>
          <Col>
            <Breadcrumb className="bg-light rounded-3 p-3 mb-4">
              <Breadcrumb.Item onClick={() => navigate('/Dashboard')}>Home</Breadcrumb.Item>
              <Breadcrumb.Item active>User Profile</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>

        <Row>
          <Col lg="4">
            <Card className="mb-4 text-center">
              <Card.Body>
                <Avatar className="m-2" name={profileInfo?.username} round={true} size="150" />
                <Card.Text className="m-2 fs-2">{profileInfo?.username}</Card.Text>
                <Card.Text className="text-muted mb-1">Full Stack Developer</Card.Text>
                <Card.Text className="text-muted mb-4">{profileInfo?.address}</Card.Text>
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
                        defaultValue={profileInfo?.facebook}
                      />
                    ) : (
                      <Card.Text>{profileInfo?.facebook}</Card.Text>
                    )}
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between align-items-center p-3">
                    <i className="bi bi-twitter-x fs-1"></i>
                    {isEditing ? (
                      <Form.Control
                        type="text"
                        name="twitter"
                        defaultValue={profileInfo?.twitter}
                      />
                    ) : (
                      <Card.Text>{profileInfo?.twitter}</Card.Text>
                    )}
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between align-items-center p-3">
                    <i className="bi bi-instagram fs-1"></i>
                    {isEditing ? (
                      <Form.Control
                        type="text"
                        name="instagram"
                        defaultValue={profileInfo?.instagram}
                      />
                    ) : (
                      <Card.Text>{profileInfo?.instagram}</Card.Text>
                    )}
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between align-items-center p-3">
                    <i className="bi bi-linkedin fs-1"></i>
                    {isEditing ? (
                      <Form.Control
                        type="text"
                        name="linkedin"
                        defaultValue={profileInfo?.linkedin}
                      />
                    ) : (
                      <Card.Text>{profileInfo?.linkedin}</Card.Text>
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
                      <Card.Text className="text-muted">{profileInfo?.username}</Card.Text>
                    </Col>
                  </Row>
                  <hr />
                  <Row>
                    <Col sm="3">
                      <Card.Text>Age</Card.Text>
                    </Col>
                    <Col sm="9">
                      <Card.Text className="text-muted">{profileInfo?.age}</Card.Text>
                    </Col>
                  </Row>
                  <hr />
                  <Row>
                    <Col sm="3">
                      <Card.Text>Sex</Card.Text>
                    </Col>
                    <Col sm="9">
                      <Card.Text className="text-muted">{profileInfo?.sex}</Card.Text>
                    </Col>
                  </Row>
                  <hr />
                  <Row>
                    <Col sm="3">
                      <Card.Text>Email</Card.Text>
                    </Col>
                    <Col sm="9">
                      <Card.Text className="text-muted">{profileInfo?.email}</Card.Text>
                    </Col>
                  </Row>
                  <hr />
                  <Row>
                    <Col sm="3">
                      <Card.Text>Phone</Card.Text>
                    </Col>
                    <Col sm="9">
                      <Card.Text className="text-muted">{profileInfo?.contact_number}</Card.Text>
                    </Col>
                  </Row>
                  <hr />
                  <Row>
                    <Col sm="3">
                      <Card.Text>Country</Card.Text>
                    </Col>
                    <Col sm="9">
                      <Card.Text className="text-muted">{profileInfo?.country}</Card.Text>
                    </Col>
                  </Row>
                  <hr />
                  <Row>
                    <Col sm="3">
                      <Card.Text>Address</Card.Text>
                    </Col>
                    <Col sm="9">
                      <Card.Text className="text-muted">{profileInfo?.address}</Card.Text>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </fieldset>




            <fieldset className="border rounded mb-4 p-3">
              <legend className="p-2 rounded">More Information</legend>
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
                          name="username"
                          defaultValue={profileInfo?.username}
                        />
                      ) : (
                        <Card.Text className="text-muted">{profileInfo?.username}</Card.Text>
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
                          defaultValue={profileInfo?.email}
                        />
                      ) : (
                        <Card.Text className="text-muted">{profileInfo?.email}</Card.Text>
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
                          defaultValue={profileInfo?.phone}
                        />
                      ) : (
                        <Card.Text className="text-muted">{profileInfo?.phone}</Card.Text>
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
                          defaultValue={profileInfo?.mobile}
                        />
                      ) : (
                        <Card.Text className="text-muted">{profileInfo?.mobile}</Card.Text>
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
                          defaultValue={profileInfo?.address}
                        />
                      ) : (
                        <Card.Text className="text-muted">{profileInfo?.address}</Card.Text>
                      )}
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
};

export default ProfilePage;


