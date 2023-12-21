import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';


const Courses = () => {
  // State for storing the list of courses
  const [courses, setCourses] = useState([]);

  // Effect hook to fetch the list of courses on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/courses');
        const data = await response.json();
        setCourses(data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  return (
    <main>
      <div className="wrap main--grid">
        {courses?.map(course => {
          return (
            <Link className="course--module course--link" to={`/courses/${course.id}`} key={course.id}>
              <h2 className="course--label">Course</h2>
              <h3 className="course--title">{course.title}</h3>
            </Link>
          )
        })}
        <Link className="course--module course--add--module" to="/courses/create">
            <span className="course--add--title">
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                viewBox="0 0 13 13" className="add"><polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon></svg>
                New Course
            </span>
        </Link>
      </div>
    </main>
  )
};

export default Courses;
