import axios from 'axios';

// Define the updated interface for the data structure based on the new JSON format
export interface Submission {
  title: string;               // Title of the submission
  submission_complete: boolean; // Indicates if the submission is complete
  date: string;                // Date of the submission
}

export interface Student {
  name: string;   // Name of the student
  email: string;  // Email of the student
  carnet: string; // Unique identification number of the student
  sede: string;   // Sede (campus) the student is associated with
  course: string; // Course the student is enrolled in
}

export interface CourseDetails {
  student: Student;           // Student details
  formattedSubmissions: Submission[]; // List of submissions associated with the student
}

// Function to get task details for a student in a specific course
export const getDetalleTareas = async (
  user_id: number,      // Unique identifier of the student
  course_id: number,    // ID of the course the student is enrolled in
  sede_id: number,      // ID of the sede (campus) the student is attending
  year: number          // Year of the course
): Promise<CourseDetails | null> => {
  try {
    // Retrieve the authentication token from localStorage
    const token = localStorage.getItem('authToken');

    // If no token is found, throw an error indicating authentication failure
    if (!token) {
      throw new Error('Token de autenticación no encontrado');  // Error message for missing token
    }

    // Make a GET request to the specified URL with the parameters
    const response = await axios.get(`https://api.onlineproject.online/api/students/${user_id}/courses/${course_id}/sede/${sede_id}/year/${year}/details`, {
      headers: {
        'Authorization': `Bearer ${token}`,  // Include the authorization token in the request headers
        'Content-Type': 'application/json',  // Specify the content type as JSON
      },
    });

    // Check if the response contains data
    if (response.data) {
      const { student, formattedSubmissions } = response.data;

      // Validate the structure of the JSON before returning it
      if (!student || !formattedSubmissions) {
        return null;  // If the expected data structure is not found, return null
      }

      // Return the student details along with the formatted submissions
      return {
        student: {
          name: student.name,           // Student's name
          email: student.email,         // Student's email
          carnet: student.carnet,       // Student's carnet (ID)
          sede: student.sede,           // Student's sede (campus)
          course: student.course,       // Student's course
        },
        formattedSubmissions: formattedSubmissions.map((submission: any) => ({
          title: submission.title,               // Title of the submission
          submission_complete: submission.submission_complete, // Whether the submission is complete
          date: submission.date,                 // Date of the submission
        })),
      };
    } else {
      return null;  // If no details are found, return null
    }
  } catch (error) {
    return null;  // If an error occurs, return null
  }
};
