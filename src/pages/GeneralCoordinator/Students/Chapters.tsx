import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { getComentarios, type ComentarioData } from "../../../ts/General/GetComment"
import Breadcrumb from "../../../components/Breadcrumbs/Breadcrumb"
import { ArrowLeft, MessageSquare, Calendar } from "lucide-react" // Import Lucide React icons

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
  const navigate = useNavigate()
  const location = useLocation()
  const { tarea, estudiante } = location.state || {}
  const [previousComments, setPreviousComments] = useState<Comment[]>([])

  const formatDate = (date: string): string => {
    const dateObj = new Date(date)
    return `${dateObj.getDate().toString().padStart(2, "0")}/${(dateObj.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${dateObj.getFullYear()}`
  }

  useEffect(() => {
    const loadComments = async () => {
      if (!tarea || !estudiante) return
      const taskId = tarea.task_id
      const userId = estudiante.id
      try {
        const comments: ComentarioData = await getComentarios(taskId, userId)
        const formattedComments = comments.comments.map((comment) => ({
          id: comment.comment_id,
          text: comment.comment,
          date: formatDate(comment.datecomment),
          role: comment.role,
          comment_active: comment.comment_active,
        }))
        setPreviousComments(formattedComments)
      } catch (error) {
        console.error("Error loading comments:", error)
      }
    }
    loadComments()
  }, [tarea, estudiante])

  return (
    <>
      <Breadcrumb pageName={`Detalle del ${tarea?.title}`} />
      <div className="mb-6 flex justify-between items-center">
        <button
          id="back-button"
          className="flex items-center px-5 py-2 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 text-gray-800 shadow-md hover:shadow-lg transition-all duration-300 dark:from-gray-700 dark:to-gray-900 dark:text-white dark:hover:from-gray-600 dark:hover:to-gray-800"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5 mr-2" /> Regresar
        </button>
      </div>

      <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8">
        <div
          id="comentarios-previos"
          className="w-full bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl overflow-hidden"
        >
          <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <MessageSquare className="h-6 w-6 mr-3 text-blue-500" /> Comentarios Previos
          </h4>
          {previousComments.length > 0 ? (
            <ul className="space-y-5">
              {previousComments.map((comment, index) => (
                <li
                  key={`${comment.id}-${index}`}
                  className="p-5 bg-gray-50 dark:bg-gray-700 rounded-xl shadow-md border border-gray-200 dark:border-gray-600 transition-all duration-300 hover:shadow-lg"
                >
                  <p className="text-base text-gray-800 dark:text-gray-200 mb-2">{comment.text}</p>
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Rol: {comment.role}</span>
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-500" /> {comment.date}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-gray-500 dark:text-gray-400 text-center">
              <MessageSquare className="h-12 w-12 mb-4 text-gray-400" />
              <p className="text-lg font-medium">No hay comentarios previos para este capítulo. 📝</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Chapters
