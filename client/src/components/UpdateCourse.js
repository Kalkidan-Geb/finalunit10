import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import ErrorsDisplay from "./ErrorsDisplay.js";
import { useUser } from "../context/UserContext.js";

const UpdateCourse = () => {
  const { authUser: user } = useUser();
  const { id } = useParams();
  const navigate = useNavigate();

  // State for storing form data and validation errors
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    estimatedTime: '',
    materialsNeeded: '',
  });
  const [errors, setErrors] = useState([]);

  // Effect hook to fetch the course details on component mount
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/courses/${id}`);
        const data = await response.json();

        // If course is not found, navigate to notfound route
        if (response.status === 404) {
          navigate('/notfound');
        } else if (user.id !== data.userId) {
          // If the current user is not the owner, navigate to forbidden route
          navigate('/forbidden');
        } else {
          setFormData(data);
        }
      } catch (error) {
        console.error('Error fetching course details:', error);
      }
    };

    fetchCourse();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user, navigate]);

  // Function to handle form data changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:5001/api/courses/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${btoa(`${user.emailAddress}:${user.password}`)}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 204) {
        // If course update is successful, navigate to the course details
        navigate(`/courses/${id}`);
      } else if (response.status === 400) {
        // If there are validation errors, set the errors state
        const data = await response.json();
        setErrors(data.errors);
      } else if (response.status === 403) {
        // If user is not authorized, navigate to forbidden route
        navigate('/forbidden');
      } else {
        // If an unexpected error occurs, navigate to the error route
        navigate('/error');
      }
    } catch (error) {
      console.error('Error updating course:', error);
    }
  };

  // Function to handle cancel button click
  const handleCancel = () => {
    navigate(`/courses/${id}`);
  };

  return (
    <main>
      <div className="wrap">
        <h2>Update Course</h2>
        <ErrorsDisplay errors={errors} />
        <form onSubmit={handleSubmit}>
          <div className="main--flex">
            <div>
              <label htmlFor="courseTitle">Course Title</label>
              <input id="courseTitle" name="title" type="text" value={formData.title} onChange={handleChange} />

              <p>By: {formData.User ? `${formData.User.firstName} ${formData.User.lastName}` : "Unknown User"} </p>

              <label htmlFor="courseDescription">Course Description</label>
              <textarea id="courseDescription" name="description" value={formData.description} onChange={handleChange}></textarea>
            </div>
            <div>
              <label htmlFor="estimatedTime">Estimated Time</label>
              <input id="estimatedTime" name="estimatedTime" type="text" value={formData.estimatedTime} onChange={handleChange} />

              <label htmlFor="materialsNeeded">Materials Needed</label>
              <textarea id="materialsNeeded" name="materialsNeeded" value={formData.materialsNeeded} onChange={handleChange}></textarea>
            </div>
          </div>
          <button className="button" type="submit">Update Course</button>
          <button className="button button-secondary" onClick={handleCancel}>Cancel</button>
        </form>
      </div>
    </main>
  )
};

export default UpdateCourse;
