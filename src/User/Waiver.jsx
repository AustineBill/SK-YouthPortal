import React, { useState, useRef } from 'react';
import { Container,  Table } from 'react-bootstrap';
import SignatureCanvas from 'react-signature-canvas';


const Waiver = () => {
  const [signatureImage, setSignatureImage] = useState('');
  const [isDrawingMode, setIsDrawingMode] = useState(true);
  const signaturePadRef = useRef();

  const clearSignature = () => {
    signaturePadRef.current.clear();
    setSignatureImage('');
  };

  const saveSignature = () => {
    const image = signaturePadRef.current.toDataURL();
    setSignatureImage(image);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignatureImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please upload a valid image file.');
    }
  };


  return (
    <div className="container-fluid">
      <div className="text-center text-lg-start m-4 mv-8 mb-3">
        <h1 className="Maintext animated slideInRight">Waiver</h1>
        <p className="Subtext">BORROWER'S SLIP</p>
      </div>

      <Container>
        <h3> Borrower's Name: </h3>  
        <h3> Date:  </h3> 

        <h4>Pledge of Responsibility for Borrowed Items</h4>

        <div className="terms-and-conditions overflow-auto" style={{ maxHeight: '400px' }}>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>No. of Items</th>
              <th>Item/s</th>
              <th>Date Returned</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td></td>
            </tr>
          </tbody>
        </Table>
          <p>
            I hereby acknowledge the receipt of the items listed above, borrowed from the office of the Sangguniang Kabataan of Western Bicutan. I affirm that all items are correct and in good condition at the time of receipt.
            I understand and agree to the following terms:
          </p>

          <h6>1. I will take all necessary precautions to ensure that the borrowed items are handled with due care and maintained in good condition throughout the period of use.</h6>
          <h6>2. In the event that any item is damaged, I acknowledge that I will be held liable for the actual repair or replacement of the damaged item. The corresponding value will be determined based on the current market value or the purchase price of the item, whichever is higher.</h6>
          <h6>3. In the event that any item is lost, I acknowledge that I will be responsible for reimbursing the full cost of the lost item. The corresponding price will be determined based on the current market value or the purchase price of the lost item, whichever is higher.</h6>
          <h6>4. All borrowed items must be returned to the office of the Sangguniang Kabataan of Western Bicutan by the agreed-upon date. Failure to return the items on time may result in a fine or other penalties.</h6>
          <h6>5. I affirm that the borrowed items will only be used for the agreed-upon purpose and that I will not be allowed to borrow any items in the future if any of the terms and conditions are violated.</h6>
          <h6>6. By signing below, I agree to these terms and accept full responsibility for the borrowed items.</h6>
        </div>

        <h2>{isDrawingMode ? 'Sign Here:' : 'Upload Your Signature Image:'}</h2>
        {isDrawingMode ? (
          <SignatureCanvas
            ref={signaturePadRef}
            backgroundColor="white"
            penColor="black"
            canvasProps={{ width: 500, height: 200, className: 'signature-canvas' }}
          />
        ) : (
          <input type="file" accept="image/*" onChange={handleFileChange} />
        )}
        <div>
          <button onClick={() => setIsDrawingMode(!isDrawingMode)}>
            Switch to {isDrawingMode ? 'Image Upload' : 'Drawing Mode'}
          </button>
          <button onClick={clearSignature}>Clear</button>
          <button onClick={saveSignature}>Save Signature</button>
        </div>
        {signatureImage && (
          <div>
            <h3>Your Signature:</h3>
            <img src={signatureImage} alt="Signature" width="300" />
          </div>
        )}
      </Container>
    </div>
  );
};

export default Waiver;
