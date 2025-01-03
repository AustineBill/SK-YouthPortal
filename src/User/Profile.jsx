import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Breadcrumb,
  Modal,
  Form,
  Alert,
} from 'react-bootstrap';
import Avatar from 'react-avatar';

const ProfilePage = () => {;
  const [profileInfo, setProfileInfo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const { username } = useParams(); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const username = sessionStorage.getItem('username');
      //console.log('Fetching profile for:', username);
      try {
        const response = await fetch(`http://localhost:5000/Profile/${username}`);
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const userData = await response.json();
        setProfileInfo(userData);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
  
    if (username) fetchProfile();
  }, [username]);

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setMessage('New password and confirm password do not match.');
      return;
    }
  
    try {
      const id = sessionStorage.getItem('userId'); // Ensure user ID is stored in sessionStorage during login
      const response = await fetch('http://localhost:5000/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, oldPassword, newPassword }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        setMessage(data.message || 'Error updating password');
      } else {
        setMessage('Password updated successfully');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error updating password:', error);
      setMessage('Error updating password');
    }
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


  if (!profileInfo && profileInfo !== null) {
    return <div>Loading...</div>; // While waiting for profileInfo to load
  }

  const ChangeModal = () => {
    setShowModal(true); // This triggers the modal to open
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
                  <Button variant="outline-primary btn-block" className="ms-1" onClick={ChangeModal} >Change password</Button>
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
                      <Card.Text className="text-muted">{profileInfo?.province} {profileInfo?.region} 
                      </Card.Text>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </fieldset>
          </Col>
        </Row>
      </Container>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {message && <Alert variant="danger">{message}</Alert>}
          <Form>
            <Form.Group controlId="oldPassword">
              <Form.Label>Old Password</Form.Label>
              <Form.Control
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="newPassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="confirmPassword">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Form.Group>
          </Form>
          <div className="mt-3 text-center">
            <Button variant="link" onClick={() => navigate('/forgot-password')}>
              Forgot Password?
            </Button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handlePasswordChange}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>


    </section>
  );
};

export default ProfilePage;


