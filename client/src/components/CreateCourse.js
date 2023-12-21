import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useUser } from '../context/UserContext';
// import { api } from '../utilities/apiHelper';
import ErrorsDisplay from './ErrorsDisplay';

function CreateCourse () {
  const { authUser: user } = useUser();
  const navigate = useNavigate();

  // State for storing form data and validation errors
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    estimatedTime: '',
    materialsNeeded: '',
    userId: user.id
  });
  const [errors, setErrors] = useState([]);

  // Function to handle form data changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5001/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${btoa(`${user.emailAddress}:${user.password}`)}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 201) {
        // If course creation is successful, navigate to the homepage
        navigate('/');
      } else if (response.status === 400) {
        // If there are validation errors, set the errors state
        const data = await response.json();
        setErrors(data.errors);
      } else {
        // If an unexpected error occurs, navigate to the error route
        navigate('/error');
      }
    } catch (error) {
      console.error('Error creating course:', error);
    }
  };

  // Function to handle cancel button click
  const handleCancel = () => {
    navigate('/');
  };

  return (
    <main>
       <div className="wrap">
        <h2>Create Course</h2>
        <ErrorsDisplay errors={errors} />       
        <form onSubmit={handleSubmit}>
          <div className="main--flex">
            <div>
              <label htmlFor="courseTitle">Course Title</label>
              <input id="courseTitle" name="title" type="text" onChange={handleChange} />

              <p>By {user ? `${user.firstName} ${user.lastName}` : 'Unknown User'}</p>

              <label htmlFor="courseDescription">Course Description</label>
              <textarea id="courseDescription" name="description" onChange={handleChange}></textarea>
            </div>
            <div>
              <label htmlFor="estimatedTime">Estimated Time</label>
              <input id="estimatedTime" name="estimatedTime" type="text" onChange={handleChange} />

              <label htmlFor="materialsNeeded">Materials Needed</label>
              <textarea id="materialsNeeded" name="materialsNeeded" onChange={handleChange}></textarea>
            </div>
          </div>
          <button className="button" type="submit">Create Course</button>
          <button className="button button-secondary" onClick={handleCancel}>Cancel</button>
        </form>
      </div>
    </main>
  )
};

export default CreateCourse;
