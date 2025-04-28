import React, { useState, useEffect } from 'react'; 
import { getTimeLineEstudiante } from '../../ts/Generales/GetTimeLineEstudiante'; 
import { getDatosPerfil } from '../../ts/Generales/GetDatsPerfil'; 
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb'; 

// Interface for the structure of a timeline event
interface TimeLineEvent {
  user_id: number; // User ID associated with the event
  typeEvent: string; // Type of the event (e.g., task submission, update)
  description: string; // Event description
  task_id: number; // Associated task ID
  date: string; // Event date
}

const TimeLine: React.FC = () => {
  // State hooks for various pieces of information in the component
  const [currentPage, setCurrentPage] = useState(1); // Current page number for pagination
  const [eventsPerPage, setEventsPerPage] = useState(3); // Number of events per page
  const [maxPageButtons, setMaxPageButtons] = useState(10); // Maximum number of page buttons to display in pagination
  const [events, setEvents] = useState<TimeLineEvent[]>([]); // Array to store the fetched timeline events
  const [loading, setLoading] = useState(true); // Loading state to show loading message while data is being fetched
  const [userName, setUserName] = useState(''); // State to store the user's name

  // useEffect to fetch profile and timeline data when the component is mounted
  useEffect(() => {
    const fetchProfileAndTimeline = async () => {
      try {
        setLoading(true); // Set loading to true before fetching data
        const perfil = await getDatosPerfil(); // Fetch user profile data
        setUserName(perfil.userName); // Set user name from profile data
  
        const logs = await getTimeLineEstudiante(perfil.user_id); // Fetch timeline events for the student
        setEvents(
          logs
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort events by date in descending order
            .map((log) => ({
              user_id: log.user_id,
              typeEvent: log.typeEvent,
              description: log.description,
              task_id: log.task_id,
              date: new Date(log.date).toLocaleDateString(), // Format the date to a more readable format
            }))
        );
      } catch (err: any) {
        // Error handling if necessary (e.g., displaying an error message)
      } finally {
        setLoading(false); // Set loading to false once the data has been fetched
      }
    };
  
    fetchProfileAndTimeline(); // Call the function to fetch the profile and timeline data
  }, []);  // Empty dependency array means this effect runs only once after the component mounts

  // Pagination logic
  const indexOfLastEvent = currentPage * eventsPerPage; // Calculate the index of the last event on the current page
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage; // Calculate the index of the first event on the current page
  const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent); // Get the events for the current page
  const totalPages = Math.ceil(events.length / eventsPerPage); // Calculate the total number of pages

  // Pagination handler function to change the page
  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) { // Ensure the page number is valid
      setCurrentPage(pageNumber); // Set the current page
    }
  };

  // Calculate the range of pages to display in the pagination
  const getPageRange = () => {
    const range: number[] = [];
    const startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2)); // Start page based on the current page
    const endPage = Math.min(totalPages, startPage + maxPageButtons - 1); // End page based on the maximum number of buttons

    for (let i = startPage; i <= endPage; i++) { // Push the page numbers into the range array
      range.push(i);
    }

    return range; // Return the range of page numbers
  };

  // useEffect to handle window resizing and adjust the number of events per page and max page buttons based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) { // If the screen width is less than 768px (mobile view)
        setEventsPerPage(4); // Set the number of events per page to 4
        setMaxPageButtons(5); // Set the maximum number of pagination buttons to 5
      } else { // For larger screens (desktop view)
        setEventsPerPage(3); // Set the number of events per page to 3
        setMaxPageButtons(10); // Set the maximum number of pagination buttons to 10
      }
    };

    handleResize(); // Call the resize handler initially
    window.addEventListener('resize', handleResize); // Add event listener for window resize
    return () => window.removeEventListener('resize', handleResize); // Cleanup the event listener when the component is unmounted
  }, []); // Empty dependency array means this effect runs only once after the component mounts

  // Display loading message if data is still being fetched
  if (loading) {
    return <div>Cargando línea de tiempo...</div>; // Display loading message while fetching data
  }

  return (
    <>
      <Breadcrumb pageName="TimeLine" /> {/* Display breadcrumb with the page name "TimeLine" */}

      <div className="mx-auto max-w-6xl px-6 -my-3">
        <h2 className="text-2xl font-bold text-black dark:text-white mb-8">
          Línea de Tiempo - {userName} {/* Display the timeline title with the user's name */}
        </h2>

        <div className="relative border-l-2 border-gray-200 dark:border-strokedark">
          {/* If there are events, display them */}
          {currentEvents.length > 0 ? (
            currentEvents.map((event, index) => (
              <div key={index} className="mb-8 pl-8 relative">
                <div className="absolute left-[-1.25rem] top-0 flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full">
                  <span>📝</span> {/* Display an icon for the event */}
                </div>
                <div className={`p-4 rounded-lg shadow-md bg-white dark:bg-boxdark dark:text-white`}>
                  <h3 className="text-lg font-semibold">{event.typeEvent}</h3> {/* Display event type */}
                  <p className="text-sm text-gray-600 dark:text-gray-400">{event.description}</p> {/* Display event description */}
                  <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-300">{event.date}</p> {/* Display event date */}
                </div>
              </div>
            ))
          ) : (
            // If no events are found, display a message
            <table className="min-w-full">
              <tbody>
                <tr>
                  <td colSpan={3} className="py-2 px-4 text-center text-gray-500 dark:text-white">
                    No Se Encontrarón Eventos En Este Estudiante. {/* Message indicating no events were found for this student */}
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>

        <div className="mt-4 flex justify-center">
          {/* Pagination buttons */}
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1} // Disable the button if on the first page
            className="mx-1 px-3 py-1 rounded-md border bg-white text-blue-600 hover:bg-blue-100 dark:bg-boxdark dark:text-white disabled:opacity-50"
          >
            &#8592; {/* Left arrow for previous page */}
          </button>
          {getPageRange().map((page) => (
            <button
              key={page}
              onClick={() => paginate(page)} // Navigate to the clicked page
              className={`mx-1 px-3 py-1 rounded-md border ${currentPage === page
                ? 'bg-blue-600 text-white'
                : 'bg-white text-blue-600 hover:bg-blue-100 dark:bg-boxdark dark:text-white'
                }`}
            >
              {page} {/* Display the page number */}
            </button>
          ))}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages} // Disable the button if on the last page
            className="mx-1 px-3 py-1 rounded-md border bg-white text-blue-600 hover:bg-blue-100 dark:bg-boxdark dark:text-white disabled:opacity-50"
          >
            &#8594; {/* Right arrow for next page */}
          </button>
        </div>
      </div>
    </>
  );
};

export default TimeLine; 
