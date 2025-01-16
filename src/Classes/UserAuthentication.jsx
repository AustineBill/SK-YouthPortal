import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../WebStructure/AuthContext";
import axios from "axios";
import "../WebStyles/Admin-CSS.css";

const { DecryptionCode } = require("../WebStructure/Codex");

const UserAuthentication = () => {
  const [view, setView] = useState("signIn");
  const [showAccountActivationFields, setShowAccountActivationFields] =
    useState(false);
  const [showChangePasswordField, setShowChangePasswordField] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [activationCode, setActivationCode] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerificationCodeCorrect, setIsVerificationCodeCorrect] =
    useState(false);
  const [showModal, setShowModal] = useState(false); // Modal visibility
  const [modalMessage, setModalMessage] = useState(""); // Modal message

  const { login, adminlogin } = useContext(AuthContext);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const currentView = queryParams.get("view");
    if (currentView === "signIn" || currentView === "signUp") {
      setView(currentView);
    }
  }, [location.search]);

  const handleModalClose = () => {
    setShowModal(false);
    navigate("/userauth"); // Example redirection
  };

  const handleSendChangePasswordEmail = async () => {
    if (email.trim() === "") {
      setModalMessage("Email cannot be blank!");
      setShowModal(true);
      return;
    }
    try {
      // Check if email exists in the database
      const response = await axios.post(
        "https://isked-backend.onrender.com/check-email",
        {
          email,
        }
      );

      if (response.data.success) {
        setModalMessage(
          "Email found. A verification code has been sent to your email."
        );
        setShowModal(true);
        setShowChangePasswordField(true); // Hide the change password form
      } else {
        alert(response.data.message); // Email not found, show the error message
      }
    } catch (error) {
      console.error("Error checking email:", error);
      setModalMessage("An error occurred while checking the email.");
      setShowModal(true);
    }
  };

  // Validate the verification code entered by the user
  const handleVerifyCode = async () => {
    if (verificationCode.trim() === "") {
      setModalMessage("Please enter the verification code.");
      setShowModal(true);
      return;
    }

    try {
      // Send the verification code to the server for validation
      const response = await axios.post(
        "https://isked-backend.onrender.com/verify-code",
        {
          email,
          verificationCode,
        }
      );

      if (response.data.success) {
        setModalMessage(
          "Verification code is correct. You can now change your password."
        );
        setShowModal(true);
        setIsVerificationCodeCorrect(true);
        setShowChangePasswordField(true); // Show the password change form
      } else {
        setModalMessage("Incorrect verification code.");
        setShowModal(true);
        setIsVerificationCodeCorrect(false); // Mark the code as invalid
      }
    } catch (error) {
      console.error("Error verifying code:", error);
      setModalMessage("An error occurred while verifying the code.");
    }
  };

  // Handle the change password request
  const handleChangePassword = async () => {
    if (newPassword.trim() === "") {
      setModalMessage("Please enter a new password.");
      setShowModal(true);
      return;
    }

    try {
      // Send the new password to the server for update
      const response = await axios.post(
        "https://isked-backend.onrender.com/change-password",
        {
          email,
          newPassword,
        }
      );

      if (response.data.success) {
        setModalMessage("Your password has been changed successfully.");
        setShowModal(true);
        setShowChangePasswordField(false);
        setIsVerificationCodeCorrect(false);
        setEmail("");
        setNewPassword("");
        setVerificationCode("");
        setView("signIn");
      } else {
        setModalMessage(response.data.message);
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setModalMessage("An error occurred while changing the password.");
      setShowModal(true);
    }
  };

  const handleShowAccountActivationFields = () => {
    if (activationCode.trim() === "") {
      setModalMessage("Activation code cannot be blank!");
      setShowModal(true);
      return;
    }

    const decryptedCode = DecryptionCode(activationCode);
    console.log("Decrypted Activation Code:", decryptedCode);

    if (decryptedCode.length !== 11) {
      setModalMessage("Activation code is Invalid!");
      setShowModal(true);
      return;
    }

    sessionStorage.setItem("decryptedCode", decryptedCode);

    // Send decrypted code to backend for validation
    fetch("https://isked-backend.onrender.com/ValidateCode", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activationCode: decryptedCode }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (
          data.message ===
          "Activation code validated. Please change your username and password."
        ) {
          // Set the username and password returned from the server
          setSignupUsername(data.username);
          setSignupPassword(data.password);
          setModalMessage(
            "Activation code validated. Please change your username and password."
          );
          setShowModal(true);

          setShowAccountActivationFields(true);
        } else {
          setModalMessage(data.message || "Invalid Activation Code");
          setShowModal(true);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred during validation.");
      });
  };

  const handleAccountUpdate = async (e) => {
    e.preventDefault();

    const decryptedCode = sessionStorage.getItem("decryptedCode"); // Retrieve the decrypted code from sessionStorage

    if (!decryptedCode) {
      setModalMessage(
        "Session expired. Please validate the activation code again."
      );
      setShowModal(true);
      return;
    }

    if (signupUsername === "User") {
      setModalMessage("Username must be changed before proceeding.");
      setShowModal(true);
      return;
    }

    try {
      // Send updated account details along with the decryptedCode to the server
      const response = await axios.post(
        "https://isked-backend.onrender.com/UpdateAccount",
        {
          username: signupUsername,
          password: signupPassword,
          decryptedCode, // Send the decryptedCode to the backend
        }
      );

      setModalMessage(response.data.message);
      setShowModal(true);
      sessionStorage.removeItem("decryptedCode"); // Remove decryptedCode from sessionStorage after successful update
      setView("signIn"); // Redirect to sign in after account update
    } catch (error) {
      console.error(
        "Update Error:",
        error.response?.data?.message || "An error occurred"
      );
      setModalMessage(
        error.response?.data?.message ||
          "An error occurred while updating your account"
      );
      setShowModal(true);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    try {
      // Make a request to the backend to verify the credentials
      const response = await fetch("https://isked-backend.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const { id, username, role } = data.user;
        sessionStorage.setItem("userId", id);
        login("isAuthenticated", username); // Call the login method from your context

        if (role === "admin") {
          adminlogin("isAdmin");
          navigate("/admin");
        } else {
          navigate("/Dashboard");
        }
      } else {
        setModalMessage(data.message || "Invalid user credentials");
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error during login:", error);
      setModalMessage("An error occurred. Please try again.");
      setShowModal(true);
    }
  };

  return (
    <div className="user-authentication-contents d-flex justify-content-center">
      <div className="left-side-responsive text-left-container">
        <div className=" d-flex flex-column justify-content-center text-center text-lg-center">
          <h1 className="middle-part">
            Lagi't lagi para sa Kabataan, Barangay at sa Bayan{" "}
          </h1>
          <h2 className="bottom-part fst-italic">Sangguniang Kabataan</h2>
          <p className="SK-location">WESTERN BICUTAN</p>
        </div>
      </div>

      <div className="right-side-contents-container d-flex justify-content-center">
        {view === "signIn" && (
          <div className="sign-in-details-container d-flex justify-content-center rounded">
            <form className="sign-in-details-group" onSubmit={handleLogin}>
              <h1 className="sign-in-welcome fw-bold fst-italic">
                Welcome back!
              </h1>

              <div className="user-auth-sign-in-form d-flex flex-column">
                <label className="sign-in-label">Username</label>
                <input type="text" name="username" required />
              </div>

              <div className="user-auth-sign-in-form d-flex flex-column">
                <label className="sign-in-label">Password</label>
                <input type="password" name="password" required />
              </div>

              <div>
                <Link
                  to="/"
                  onClick={(e) => {
                    e.preventDefault();
                    setView("forgotPassword");
                  }}
                  className="forgot-password-link  text-decoration-none"
                >
                  Forgot your password?
                </Link>
              </div>

              <button
                type="submit"
                className="sign-in-button fw-bold rounded-pill"
              >
                Sign In
              </button>

              <div className="sign-in-form-bottom">
                <p className="no-account-p text-black">
                  Don't have an account?
                </p>
                <Link
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/userauth?view=signUp");
                  }}
                  className="sign-up-link text-decoration-none"
                >
                  Sign up
                </Link>
              </div>
            </form>
          </div>
        )}

        {view === "forgotPassword" && (
          <div className="forgot-password-details-container d-flex justify-content-center rounded">
            <form className="forgot-password-details-group d-flex text-center">
              {!showChangePasswordField && !isVerificationCodeCorrect && (
                <>
                  <div className="fp-group-container">
                    <h1 className="forgot-password-fp fw-bold fst-italic">
                      Change Password
                    </h1>
                    <p className="forgot-password-email-description">
                      Enter your email address to receive a verification code to
                      change your password.
                    </p>
                  </div>

                  <div className="user-auth-forgot-password-form d-flex flex-column text-left">
                    <label className="forgot-password-label">Email</label>
                    <input
                      type="email"
                      name="forgot-password-email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleSendChangePasswordEmail} // Send change password email
                    className="fp-proceed-button fw-bold rounded-pill"
                  >
                    Proceed
                  </button>
                </>
              )}

              {!isVerificationCodeCorrect && showChangePasswordField && (
                <>
                  <h1 className="forgot-password-fp fw-bold fst-italic">
                    Enter Verification Code
                  </h1>

                  <div className="user-auth-forgot-password-form d-flex flex-column text-left">
                    <label className="forgot-password-label">
                      Verification Code
                    </label>
                    <input
                      type="text"
                      name="verification-code"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleVerifyCode} // Verify the code
                    className="fp-submit-button fw-bold rounded-pill"
                  >
                    Verify Code
                  </button>
                </>
              )}

              {isVerificationCodeCorrect && (
                <>
                  <h1 className="forgot-password-fp fw-bold fst-italic">
                    Change Password
                  </h1>

                  <div className="user-auth-forgot-password-form d-flex flex-column text-left">
                    <label className="forgot-password-label">
                      New Password
                    </label>
                    <input
                      type="password"
                      name="new-password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleChangePassword} // Submit change password
                    className="fp-submit-button fw-bold rounded-pill"
                  >
                    Submit
                  </button>
                </>
              )}
            </form>
          </div>
        )}

        {view === "signUp" && (
          <div className="sign-up-details-container d-flex justify-content-center rounded">
            <form className="sign-up-details-group d-flex text-center">
              {!showAccountActivationFields && (
                <>
                  <h1 className="sign-up-su fw-bold fst-italic">
                    Account Activation
                  </h1>

                  <div className="user-auth-sign-up-form d-flex flex-column text-left">
                    <label className="sign-up-label">Activation Code</label>
                    <input
                      type="text"
                      name="activation-code"
                      value={activationCode}
                      onChange={(e) => setActivationCode(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleShowAccountActivationFields}
                    className="su-proceed-button fw-bold rounded-pill"
                  >
                    Validate Code
                  </button>
                </>
              )}

              {showAccountActivationFields && (
                <>
                  <div className="aa-group-container">
                    <h1 className="sign-up-su fw-bold fst-italic">
                      Account Activation
                    </h1>
                    <p className="sign-up-description">Set up your account</p>
                  </div>

                  <div className="user-auth-sign-up-form d-flex flex-column text-left">
                    <label className="sign-up-label">Username:</label>
                    <input
                      type="text"
                      name="signup-username"
                      value={signupUsername}
                      onChange={(e) => setSignupUsername(e.target.value)}
                      required
                    />
                  </div>

                  <div className="user-auth-sign-up-form d-flex flex-column text-left">
                    <label className="sign-up-label">Password</label>
                    <input
                      type="password"
                      name="signup-password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                    />
                  </div>

                  <p className="sign-up-description">
                    Kindly Change your Username and Password Before Signing Up
                  </p>

                  <button
                    type="submit"
                    onClick={handleAccountUpdate}
                    className="su-submit-button fw-bold rounded-pill"
                  >
                    Create Account
                  </button>
                </>
              )}
            </form>
          </div>
        )}

        {showModal && (
          <div className="ModalOverlayStyles">
            <div className="ModalStyles large">
              <button
                className="closeButton"
                onClick={handleModalClose}
                aria-label="Close"
              >
                <i className="bi bi-x-circle"></i>
              </button>
              <div className="text-center">
                <h2 className="mt-3 mb-3">{modalMessage}</h2>
              </div>
              <div className="d-flex justify-content-center mt-3">
                <button className="small btn-db" onClick={handleModalClose}>
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAuthentication;
