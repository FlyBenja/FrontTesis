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
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-gray-500 bg-opacity-50 overflow-auto p-4">
            <div className="bg-white dark:bg-boxdark rounded-2xl shadow-lg p-6 w-full max-w-2xl mt-16 md:max-w-3xl md:mt-15 lg:max-w-4xl lg:mt-15 lg:ml-[350px]">
                <h3 className="text-xl font-semibold text-black dark:text-white mb-4 text-center">
                    {mode === 'create' ? 'Crear Tarea' : 'Editar Tarea'}
                </h3>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-black dark:text-white mb-1">
                                Curso
                            </label>
                            <select
                                name="selectedCurso"
                                value={form.selectedCurso}
                                onChange={handleChange}
                                className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm
                   bg-white text-black
                   dark:bg-boxdark dark:text-white dark:border-gray-600"
                                required
                                disabled={mode === 'edit'}
                            >
                                <option value="">Seleccionar curso</option>
                                {cursos.map(({ course_id, courseName }) => (
                                    <option key={course_id} value={course_id}>
                                        {courseName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-black dark:text-white mb-1">
                                Tipo de Tarea
                            </label>
                            <select
                                name="selectedTipoTarea"
                                value={form.selectedTipoTarea}
                                onChange={handleChange}
                                className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm
                   bg-white text-black
                   dark:bg-boxdark dark:text-white dark:border-gray-600"
                                required
                                disabled={mode === 'edit'}
                            >
                                <option value="">Seleccionar curso</option>
                                <option value="1">Propuesta de Tesis</option>
                                <option value="2">Entrega de Capítulos</option>
                            </select>
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="block text-sm font-medium text-black dark:text-white mb-1">
                            Título de la Tarea
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm
                 bg-white text-black
                 dark:bg-boxdark dark:text-white dark:border-gray-600"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="block text-sm font-medium text-black dark:text-white mb-1">
                            Descripción de la Tarea
                        </label>
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm
                 bg-white text-black
                 dark:bg-boxdark dark:text-white dark:border-gray-600"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-black dark:text-white mb-1">
                                Fecha Inicial
                            </label>
                            <input
                                type="date"
                                name="taskStart"
                                value={form.taskStart}
                                onChange={handleChange}
                                className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm
                   bg-white text-black
                   dark:bg-boxdark dark:text-white dark:border-gray-600"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-black dark:text-white mb-1">
                                Fecha Final
                            </label>
                            <input
                                type="date"
                                name="endTask"
                                value={form.endTask}
                                onChange={handleChange}
                                className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm
                   bg-white text-black
                   dark:bg-boxdark dark:text-white dark:border-gray-600"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-black dark:text-white mb-1">
                                Hora de Inicio
                            </label>
                            <input
                                type="time"
                                name="startTime"
                                value={form.startTime}
                                onChange={handleChange}
                                className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm
                   bg-white text-black
                   dark:bg-boxdark dark:text-white dark:border-gray-600"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-black dark:text-white mb-1">
                                Hora de Finalización
                            </label>
                            <input
                                type="time"
                                name="endTime"
                                value={form.endTime}
                                onChange={handleChange}
                                className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm
                   bg-white text-black
                   dark:bg-boxdark dark:text-white dark:border-gray-600"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex justify-end mt-5">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-1.5 mr-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                            disabled={loading}
                        >
                            {loading ? 'Cargando...' : mode === 'create' ? 'Crear' : 'Actualizar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTask;