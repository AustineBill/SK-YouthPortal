import React, { useState, useRef, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';

const SignatureComponent = () => {
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

  const pdfUrl = '/Asset/[TEENBAYAN] WAIVER AND CONTRACT.pdf';


  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = '/assets/pdf.worker.min.js'; // Path to your local worker file
  }, []);


  return (
    <div>
      <h2>PDF Viewer</h2>
      <Document file={pdfUrl}>
        <Page pageNumber={1} />
      </Document>

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
    </div>
  );
};

export default SignatureComponent;
