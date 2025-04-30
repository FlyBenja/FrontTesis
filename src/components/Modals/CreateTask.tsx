import React, { useState, useEffect } from 'react';
import { createTarea } from '../../ts/Administrator/CreateTasks';
import { updateTarea } from '../../ts/Administrator/UpdateTask';
import { getCursos } from '../../ts/General/GetCourses';
import { getDatosPerfil } from '../../ts/General/GetProfileData';
import { getDatosTarea } from '../../ts/Administrator/GetTaskData';
import Swal from 'sweetalert2';

/**
 * Props interface for the CreaTarea component
 */
interface CreateTaskProps {
    onClose: () => void;  // Function to close the form
    mode: 'create' | 'edit';  // Mode of the form, either 'create' or 'edit'
    taskId: number | null;  // Task ID, null for creating new task
}

/**
 * Interface for the form state
 */
interface FormState {
    selectedCurso: string;  // Selected course
    selectedTipoTarea: string;  // Selected task type
    title: string;  // Task title
    description: string;  // Task description
    taskStart: string;  // Task start date
    endTask: string;  // Task end date
    startTime: string;  // Task start time
    endTime: string;  // Task end time
}

const CreateTask: React.FC<CreateTaskProps> = ({ onClose, mode, taskId }) => {
    // State variables for the component
    const [cursos, setCursos] = useState<any[]>([]);  // List of courses
    const [form, setForm] = useState<FormState>({
        selectedCurso: '', 
        selectedTipoTarea: ' ', 
        title: '', 
        description: '', 
        taskStart: '', 
        endTask: '', 
        startTime: '', 
        endTime: '',
    });  // Form state for storing user input
    const [loading, setLoading] = useState<boolean>(true);  // Loading state to show a loading indicator

    /**
     * Fetch courses based on the user's profile and current year.
     * This will set the list of courses available to the user.
     */
    useEffect(() => {
        const fetchCursos = async () => {
            try {
                const { sede } = await getDatosPerfil();  // Fetch user profile to get their "sede"
                const currentYear = new Date().getFullYear();  // Get the current year
                const cursosData = await getCursos(sede, currentYear);  // Fetch the list of courses for the user’s sede and the current year
                setCursos(cursosData || []);  // Store the courses in the state
            } catch (error) {
                // Display an error if the courses can't be fetched
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudieron cargar los cursos.',  // "Could not load the courses."
                    confirmButtonColor: '#dc3545',
                });
            } finally {
                setLoading(false);  // Stop loading after the request is finished
            }
        };

        fetchCursos();
    }, []);  // Runs once when the component is mounted

    /**
     * Fetch task data for editing a task when in edit mode.
     * If mode is 'edit' and a taskId is provided, this will fetch the data of the task to be edited.
     */
    useEffect(() => {
        const fetchTaskData = async () => {
            if (mode === 'edit' && taskId) {
                try {
                    const taskData = await getDatosTarea(taskId);  // Fetch task data using the task ID
                    if (taskData) {
                        const {
                            title,
                            description,
                            taskStart,
                            endTask,
                            startTime,
                            endTime,
                            course_id,
                            typeTask_id,
                        } = taskData;

                        setForm({
                            selectedCurso: course_id.toString(),
                            selectedTipoTarea: typeTask_id.toString(),
                            title,
                            description,
                            taskStart: taskStart.split('T')[0],  // Only keep the date part
                            endTask: endTask.split('T')[0],  // Only keep the date part
                            startTime,
                            endTime,
                        });
                    }
                } catch (error) {
                    // Display an error if the task data can't be fetched
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No se pudieron cargar los datos de la tarea.',  // "Could not load the task data."
                        confirmButtonColor: '#dc3545',
                    });
                }
            }
        };

        fetchTaskData();
    }, [mode, taskId]);  // Runs when the mode or taskId changes

    /**
     * Handle input changes in the form.
     * This will update the corresponding field in the form state.
     * 
     * @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>} e
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;  // Destructure name and value from the event
        setForm((prev) => ({ ...prev, [name]: value }));  // Update the corresponding field in the form state
    };

    /**
     * Handle form submission.
     * This will either create or update a task based on the mode ('create' or 'edit').
     * It also performs validation and displays alerts if any fields are missing or invalid.
     * 
     * @param {React.FormEvent} e
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();  // Prevent default form submission behavior
        const { selectedCurso, selectedTipoTarea, title, description, taskStart, endTask, startTime, endTime } = form;

        // Check if all required fields are filled
        if (!selectedCurso || !title || !description || !taskStart || !endTask || !startTime || !endTime) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor complete todos los campos.',  // "Please complete all fields."
                confirmButtonColor: '#dc3545',
            });
            return;
        }

        // Validate the task start and end dates
        if (new Date(endTask) <= new Date(taskStart)) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'La Fecha Final debe ser mayor a la Fecha Inicial.',  // "The End Date must be later than the Start Date."
                confirmButtonColor: '#dc3545',
            });
            return;
        }

        // Validate the task start and end times
        if (startTime >= endTime) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'La Hora Final debe ser mayor a la Fecha Inicial.',  // "The End Time must be later than the Start Time."
                confirmButtonColor: '#dc3545',
            });
            return;
        }

        try {
            setLoading(true);  // Set loading state to true before making the request
            const { sede } = await getDatosPerfil();  // Get user profile to fetch their "sede"
            const selectedCourse = cursos.find((curso) => curso.course_id.toString() === selectedCurso);  // Find the selected course from the list

            // Display an error if the selected course is not found
            if (!selectedCourse) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Curso seleccionado no encontrado.',  // "Selected course not found."
                    confirmButtonColor: '#dc3545',
                });
                return;
            }

            let resultMessage: string | null = null;
            // Handle task creation or update based on the mode
            if (mode === 'create') {
                const tareaData = {
                    course_id: selectedCourse.course_id,
                    sede_id: sede,
                    typeTask_id: parseInt(selectedTipoTarea),
                    title,
                    description,
                    taskStart,
                    endTask,
                    startTime,
                    endTime,
                };
                resultMessage = await createTarea(tareaData);  // Create a new task
            } else if (mode === 'edit' && taskId) {
                const tareaDataUpdate = {
                    title,
                    description,
                    taskStart,
                    endTask,
                    startTime,
                    endTime,
                };
                resultMessage = await updateTarea(taskId, tareaDataUpdate);  // Update the existing task
            }

            // If there's an error message, display it
            if (resultMessage) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: resultMessage,
                    confirmButtonColor: '#dc3545',
                });
            } else {
                // If the task is successfully created or updated, display a success message
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',  // "Success"
                    text: `Tarea ${mode === 'create' ? 'creada' : 'actualizada'} exitosamente.`,  // "Task created successfully" or "Task updated successfully"
                    confirmButtonColor: '#28a745',
                });
                onClose();  // Close the form
            }
        } catch (error) {
            // Display an error message if something goes wrong during the task creation or update
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Hubo un error al ${mode === 'create' ? 'crear' : 'actualizar'} la tarea.`,  // "Error creating or updating the task."
                confirmButtonColor: '#dc3545',
            });
        } finally {
            setLoading(false);  // Stop loading after the request is finished
        }
    };

    return (
        <div className="tarea-form-container">
            <form onSubmit={handleSubmit}>
                <h2>{mode === 'create' ? 'Crear Tarea' : 'Editar Tarea'}</h2>

                {/* Select Course */}
                <div>
                    <label htmlFor="curso">Curso</label>
                    <select id="curso" name="selectedCurso" value={form.selectedCurso} onChange={handleChange} required>
                        <option value="">Seleccione un curso</option>
                        {cursos.map((curso) => (
                            <option key={curso.course_id} value={curso.course_id}>
                                {curso.course_name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Select Task Type */}
                <div>
                    <label htmlFor="tipo-tarea">Tipo de Tarea</label>
                    <select id="tipo-tarea" name="selectedTipoTarea" value={form.selectedTipoTarea} onChange={handleChange} required>
                        <option value=" ">Seleccione un tipo de tarea</option>
                        {/* Include options for task types here */}
                    </select>
                </div>

                {/* Task Title */}
                <div>
                    <label htmlFor="title">Título de la tarea</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Task Description */}
                <div>
                    <label htmlFor="description">Descripción de la tarea</label>
                    <textarea
                        id="description"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Task Start Date */}
                <div>
                    <label htmlFor="taskStart">Fecha Inicial</label>
                    <input
                        type="date"
                        id="taskStart"
                        name="taskStart"
                        value={form.taskStart}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Task End Date */}
                <div>
                    <label htmlFor="endTask">Fecha Final</label>
                    <input
                        type="date"
                        id="endTask"
                        name="endTask"
                        value={form.endTask}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Task Start Time */}
                <div>
                    <label htmlFor="startTime">Hora de inicio</label>
                    <input
                        type="time"
                        id="startTime"
                        name="startTime"
                        value={form.startTime}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Task End Time */}
                <div>
                    <label htmlFor="endTime">Hora de finalización</label>
                    <input
                        type="time"
                        id="endTime"
                        name="endTime"
                        value={form.endTime}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? 'Cargando...' : mode === 'create' ? 'Crear' : 'Actualizar'}
                </button>
                <button type="button" onClick={onClose}>Cancelar</button>
            </form>
        </div>
    );
};

export default CreateTask;
