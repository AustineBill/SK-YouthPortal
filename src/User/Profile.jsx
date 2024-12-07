import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Breadcrumb,
  Form,
} from 'react-bootstrap';
import Avatar from 'react-avatar';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileInfo, setProfileInfo] = useState(null);
  const { username } = useParams(); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const username = sessionStorage.getItem('username');
      console.log('Fetching profile for:', username);
  
      try {
        const response = await fetch(`http://localhost:5000/Profile/${username}`);
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const userData = await response.json();
        console.log('Profile Data:', userData);
  
        setProfileInfo(userData);
      } catch (error) {
        console.error('Error fetching profile:', error);
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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"; // Handle null or undefined dates
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(date);
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
                <Avatar className="m-2" name={profileInfo?.username} round={true} size="150"  style={{ text: "40px"}}/> 
                <Card.Text className="m-2 fs-2">{profileInfo?.username}</Card.Text>
                <Card.Text className="text-muted mb-1">{profileInfo?.educational_background}</Card.Text>
                

                <div className="d-flex justify-content-center mb-2">
                  <Button variant="outline-primary btn-block" className="ms-1">Change password</Button>
                  <Button variant="outline-secondary btn-block" className="ms-1" onClick={handleEditClick}>
                    {isEditing ? 'Cancel' : 'Edit information'}
                  </Button>
                </div>
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
                      <Card.Text className="text-muted">{profileInfo?.firstname} {profileInfo?.lastname}</Card.Text>
                    </Col>
                  </Row>
                  <hr />
                  <Row>
                    <Col sm="3">
                      <Card.Text>Age</Card.Text>
                    </Col>
                    <Col sm="3">
                      <Card.Text className="text-muted">{profileInfo?.age}</Card.Text>
                    </Col>
                    <Col sm="3">
                      <Card.Text>Sex</Card.Text>
                    </Col>
                    <Col sm="3">
                      <Card.Text className="text-muted">{profileInfo?.sex}</Card.Text>
                    </Col>
                  </Row>
                  <hr />
                  <Row>
                  <Col sm="3">
                      <Card.Text>Birthday</Card.Text>
                    </Col>
                    <Col sm="3">
                      <Card.Text className="text-muted">{formatDate(profileInfo?.birthday)}</Card.Text>
                    </Col>
                    <Col sm="3">
                      <Card.Text>Phone</Card.Text>
                    </Col>
                    <Col sm="3">
                      <Card.Text className="text-muted">{profileInfo?.contact_number}</Card.Text>
                    </Col>
                  </Row>
                  <hr />
                  <Row>
                    <Col sm="3">
                      <Card.Text>Civil Status</Card.Text>
                    </Col>
                    <Col sm="3">
                      <Card.Text className="text-muted">{profileInfo?.civil_status}</Card.Text>
                    </Col>
                    <Col sm="3">
                      <Card.Text>Work Status</Card.Text>
                    </Col>
                    <Col sm="3">
                      <Card.Text className="text-muted">{profileInfo?.work_status}</Card.Text>
                    </Col>
                  </Row>
                  <hr />
                  <Row>
                    <Col sm="3">
                      <Card.Text> Youth Age Group</Card.Text>
                    </Col>
                    <Col sm="3">
                      <Card.Text className="text-muted">{profileInfo?.youth_age_group}</Card.Text>
                    </Col>
                    <Col sm="5">
                      <Card.Text>Registered SK Voter</Card.Text>
                    </Col>
                    <Col sm="3">
                      <Card.Text className="text-muted">{profileInfo?.registered_sk_voter}</Card.Text>
                    </Col>
                  </Row>
                  <hr />
                  <Row>
                    <Col sm="3">
                      <Card.Text>Email</Card.Text>
                    </Col>
                    <Col sm="9">
                      <Card.Text className="text-muted">{profileInfo?.email_address}</Card.Text>
                    </Col>
                  </Row>
                  <hr />
                  <Row>
                    <Col sm="3">
                      <Card.Text>Address</Card.Text>
                    </Col>
                    <Col sm="9">
                      <Card.Text className="text-muted"> {profileInfo?.barangay} {profileInfo?.city} {profileInfo?.zone} 
                      </Card.Text>
                    </Col>
                  </Row>
                  <hr />
                  <Row>
                    <Col sm="3">
                      <Card.Text>Province</Card.Text>
                    </Col>
                    <Col sm="9">
                      <Card.Text className="text-muted">{profileInfo?.province} {profileInfo?.regiopn} 
                      </Card.Text>
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


