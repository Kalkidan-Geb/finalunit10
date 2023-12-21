import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../utilities/apiHelper';
import { useUser } from '../context/UserContext';


function CourseDetail () {
  const { authUser: user } = useUser();
  const { id } = useParams();
  const navigate = useNavigate();

  // State for storing course details and validation errors
  const [course, setCourse] = useState({});
  
  // Effect hook to fetch the course details on component mount
  useEffect(() => {
    const fetchCourse = async () => {
        try {
            const res = await api(`/courses/${id}`, 'GET')
            const json = await res.json();
            if (res.status === 200) {
                setCourse(json);
            } else if (res.status === 404) {
                navigate('/notfound');
            } else {
                throw new Error();
            }
        } catch (error) {
            console.log("Error fetching and parsing the data", error)
            navigate('/error');
        }
    }
    fetchCourse();
}, [id, navigate])


    // eslint-disable-next-line react-hooks/exhaustive-deps
 

  // Function to handle course deletion
  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/courses/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Basic ${btoa(`${user.emailAddress}:${user.password}`)}`,
        },
      });

      // If the deletion is successful, navigate to the homepage
      if (response.status === 204) {
        navigate('/');
      } else if (response.status === 403) {
        // If user is not authorized to delete, navigate to forbidden route
        navigate('/forbidden');
      } else if (response.status === 404) {
        // If the course is not found, navigate to notfound route
        navigate('/notfound');
      } else {
        // If an unexpected error occurs, navigate to the error route
        navigate('/error');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  return (
    <main>
      <div className="actions--bar">
        <div className="bounds">
          <div className="wrap">
          {user && user.id === course.userId ? (
            <>
              <Link className="button" to={`/courses/${id}/update`}>Update Course</Link>
              <button className="button" onClick={handleDelete}>Delete Course</button>
            </>
            ) : null }
              <Link className="button button-secondary" to="/">Return to List</Link>
          </div>
        </div>
      </div>
      <div className="wrap">
        <h2>Course Detail</h2>
        <form>
          <div className="main--flex">
            <div>
              <h3 className="course--detail--title">Course</h3>
              <h4 className="course--name">{`${course.title}`}</h4>
              <p>{`By ${course.User?.firstName} ${course.User?.lastName}`}</p>
              <ReactMarkdown>{`${course.description}`}</ReactMarkdown>
            </div>
            <div>
              <h3 className="course--detail--title">Estimated Time</h3>
              {course.estimatedTime ? 
                <p>{`${course.estimatedTime}`}</p> : <p>N/A</p>
              }
              <h3 className="course--detail--title">Materials Needed</h3>
              {course.materialsNeeded ?
              <ul className="course--detail--list">
                <ReactMarkdown>{`${course.materialsNeeded}`}</ReactMarkdown>
              </ul>
              : <p>N/A</p>
              }
            </div>
          </div>
        </form>
      </div>
    </main>
  )
};

export default CourseDetail;
