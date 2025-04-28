import React, { useState, useEffect } from 'react';
import { createTarea } from '../../ts/Administrator/CreateTasks';
import { updateTarea } from '../../ts/Administrator/UpdateTask';
import { getCursos } from '../../ts/General/GetCourses';
import { getDatosPerfil } from '../../ts/General/GetProfileData';
import { getDatosTarea } from '../../ts/Administrator/GetTaskData';
import Swal from 'sweetalert2';

// Props interface for the CreaTarea component
interface CreaTareaProps {
    onClose: () => void;  // Function to close the form
    mode: 'create' | 'edit';  // Mode of the form, either 'create' or 'edit'
    taskId: number | null;  // Task ID, null for creating new task
}

// Interface for the form state
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

const CreaTarea: React.FC<CreaTareaProps> = ({ onClose, mode, taskId }) => {
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

    // Fetch courses based on the user's profile and current year
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
                    text: 'No se pudieron cargar los cursos.',
                    confirmButtonColor: '#dc3545',
                });
            } finally {
                setLoading(false);  // Stop loading after the request is finished
            }
        };

        fetchCursos();
    }, []);

    // Fetch task data for editing a task when in edit mode
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
                        text: 'No se pudieron cargar los datos de la tarea.',
                        confirmButtonColor: '#dc3545',
                    });
                }
            }
        };

        fetchTaskData();
    }, [mode, taskId]);

    // Handle input changes in the form
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;  // Destructure name and value from the event
        setForm((prev) => ({ ...prev, [name]: value }));  // Update the corresponding field in the form state
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();  // Prevent default form submission behavior
        const { selectedCurso, selectedTipoTarea, title, description, taskStart, endTask, startTime, endTime } = form;

        // Check if all required fields are filled
        if (!selectedCurso || !title || !description || !taskStart || !endTask || !startTime || !endTime) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor complete todos los campos.',
                confirmButtonColor: '#dc3545',
            });
            return;
        }

        // Validate the task start and end dates
        if (new Date(endTask) <= new Date(taskStart)) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'La Fecha Final debe ser mayor a la Fecha Inicial.',
                confirmButtonColor: '#dc3545',
            });
            return;
        }

        // Validate the task start and end times
        if (startTime >= endTime) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'La Hora Final debe ser mayor a la Fecha Inicial.',
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
                    text: 'Curso seleccionado no encontrado.',
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
                    title: 'Éxito',
                    text: `Tarea ${mode === 'create' ? 'creada' : 'actualizada'} exitosamente.`,
                    confirmButtonColor: '#28a745',
                });
                onClose();  // Close the form
            }
        } catch (error) {
            // Display an error message if something goes wrong during the task creation or update
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Hubo un error al ${mode === 'create' ? 'crear' : 'actualizar'} la tarea.`,
                confirmButtonColor: '#dc3545',
            });
        } finally {
            setLoading(false);  // Stop loading after the request is finished
        }
    };

    // Show loading indicator while the data is being fetched
    if (loading) return <div>Cargando...</div>;

    return (
        <div className="fixed top-[40px] left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-lg w-full max-w-lg relative overflow-y-auto max-h-[90vh]">
                <button
                    onClick={onClose}
                    className="absolute top-5 right-2 text-gray-800 dark:text-gray-100 text-2xl"
                    aria-label="close"
                >
                    &#10005;
                </button>

                <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100">
                    {mode === 'create' ? 'Crear Nueva Tarea' : 'Editar Tarea'}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4 w-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-100">
                                Tipo de Tarea
                            </label>
                            <select
                                className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                                name="selectedTipoTarea"
                                value={form.selectedTipoTarea}
                                onChange={handleChange}
                                disabled={mode === 'edit'}
                            >
                                <option value="">Seleccionar curso</option>
                                <option value="1">Propuesta de Tesis</option>
                                <option value="2">Entrega de Capítulos</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-100">Curso</label>
                            <select
                                className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                                name="selectedCurso"
                                value={form.selectedCurso}
                                onChange={handleChange}
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
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-100">Título</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                            name="title"
                            placeholder="Título de la tarea"
                            value={form.title}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-100">Descripción</label>
                        <textarea
                            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                            name="description"
                            placeholder="Descripción de la tarea"
                            value={form.description}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-100">Fecha de Inicio</label>
                            <input
                                type="date"
                                className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                                name="taskStart"
                                value={form.taskStart}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-100">Fecha de Fin</label>
                            <input
                                type="date"
                                className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                                name="endTask"
                                value={form.endTask}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-100">Hora de Inicio</label>
                            <input
                                type="time"
                                className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                                name="startTime"
                                value={form.startTime}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-100">Hora de Fin</label>
                            <input
                                type="time"
                                className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                                name="endTime"
                                value={form.endTime}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end mt-4">
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
                            disabled={loading}
                        >
                            {loading ? 'Cargando...' : mode === 'create' ? 'Crear Tarea' : 'Actualizar Tarea'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreaTarea;
