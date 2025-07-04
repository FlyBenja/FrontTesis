import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { getComentarios, type ComentarioData } from "../../../ts/General/GetComment"
import type React from "react"
import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb"

/**
 * Interface for comment data with active status
 */
interface Comment {
  id: number
  text: string
  date: string
  role: string
  comment_active: boolean
}

/**
 * Chapters component for managing thesis chapters and comments
 */
const Chapters: React.FC = () => {
  const navigate = useNavigate() // Hook for navigating between pages
  const location = useLocation() // Hook to get the state from the URL
  const { tarea, estudiante } = location.state || {} // Destructure task and student from the location state
  const [previousComments, setPreviousComments] = useState<Comment[]>([]) // State to store previous comments

  /**
   * Function to format the date as day/month/year
   */
  const formatDate = (date: string): string => {
    const dateObj = new Date(date)
    return `${dateObj.getDate().toString().padStart(2, "0")}/${(dateObj.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${dateObj.getFullYear()}`
  }

  /**
   * Load previous comments when the component mounts
   */
  useEffect(() => {
    const loadComments = async () => {
      if (!tarea || !estudiante) return // If there is no task or student, do not load comments

      const taskId = tarea.task_id // Get the task ID
      const userId = estudiante.id // Get the student ID

      try {
        // Get the comments from the API
        const comments: ComentarioData = await getComentarios(taskId, userId)
        // Format the comments into a more usable structure, including comment_active
        const formattedComments = comments.comments.map((comment) => ({
          id: comment.comment_id, // Unique comment ID
          text: comment.comment,
          date: formatDate(comment.datecomment),
          role: comment.role,
          comment_active: comment.comment_active,
        }))
        setPreviousComments(formattedComments) // Update the state with the formatted comments
      } catch (error) {
        console.error("Error loading comments:", error)
      }
    }

    loadComments()
  }, [tarea, estudiante])

  return (
    <>
      <Breadcrumb pageName={`Detalle del ${tarea?.title}`} />

      <div className="mb-4 flex justify-between">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <button
            id="back-button"
            className="flex items-center text-gray-700 dark:text-white bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 px-3 sm:px-4 py-2 rounded-md text-sm sm:text-base"
            onClick={() => navigate(-1)}
          >
            <span className="mr-2">←</span> Regresar
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-6">
        {/* Display the previous comments */}
        <div id="comentarios-previos" className="w-full bg-gray-100 dark:bg-gray-800 p-4 overflow-y-auto">
          <h4 className="text-lg font-semibold text-black dark:text-white mb-4">Comentarios Previos</h4>
          <ul className="space-y-4">
            {previousComments.map((comment, index) => (
              <li key={`${comment.id}-${index}`} className="p-4 bg-white dark:bg-boxdark rounded-lg shadow-md">
                <p className="text-sm text-gray-700 dark:text-gray-300">{comment.text}</p>
                <span className="block text-xs text-gray-500 dark:text-gray-400">{comment.role}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{comment.date}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}

export default Chapters
