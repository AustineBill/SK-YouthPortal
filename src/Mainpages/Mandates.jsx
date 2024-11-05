import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb } from 'react-bootstrap';

const Mandate = () => {
  const navigate = useNavigate();
  return (
    <div className="container-fluid">
      <Breadcrumb className="ms-5">
          <Breadcrumb.Item onClick={() => navigate('/About')}>About</Breadcrumb.Item>
            <Breadcrumb.Item active>Mandate</Breadcrumb.Item>
        </Breadcrumb>
      <div className="text-center text-lg-start m-4 mv-8">
        <h1 className="Maintext animated slideInRight">Mandate</h1>
          <p className='Subtext'>Lorem ipsum</p> 
      </div>

      <div className="text-center text-lg-start m-5">
        <h1 className="man-maintext animated slideInRight">Mission</h1>
          <p className='man-subtext'>Lorem ipsum</p> 
      </div>

      <div className="text-center text-lg-end m-5">
        <h1 className="man-maintext animated slideInLeft">Vision</h1>
          <p className='man-subtext'>Lorem ipsum</p> 
      </div>

      <div className="text-center text-lg-start m-5">
        <h1 className="man-maintext animated slideInRight">Objective</h1>
          <p className='man-subtext'>Lorem ipsum</p> 
      </div>  
  </div>


  )
}
  

export default Mandate;
