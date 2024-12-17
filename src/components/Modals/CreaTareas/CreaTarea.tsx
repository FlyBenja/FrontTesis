import React, { useState, useEffect } from 'react';
import './CreaTarea.css';
import { createTarea } from '../../../ts/Admin/CreateTareas';
import { updateTarea } from '../../../ts/Admin/UpdateTareas';  // Se vuelve a incluir
import { getCursos } from '../../../ts/Admin/GetCursos';
import { getDatosPerfil } from '../../../ts/Generales/GetDatsPerfil';
import { getDatosTarea } from '../../../ts/Admin/GetDatosTarea';
import Swal from 'sweetalert2';

interface CreaTareaProps {
    onClose: () => void;
    mode: 'create' | 'edit';
    taskId: number | null;
}

interface FormState {
    selectedCurso: string;
    selectedTipoTarea: string;
    title: string;
    description: string;
    taskStart: string;
    endTask: string;
    startTime: string;
    endTime: string;
}

const CreaTarea: React.FC<CreaTareaProps> = ({ onClose, mode, taskId }) => {
    const [cursos, setCursos] = useState<any[]>([]);
    const [form, setForm] = useState<FormState>({
        selectedCurso: '',
        selectedTipoTarea: ' ',
        title: '',
        description: '',
        taskStart: '',
        endTask: '',
        startTime: '',
        endTime: '',
    });
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchCursos = async () => {
            try {
                const { sede } = await getDatosPerfil();
                const cursosData = await getCursos(sede);
                setCursos(cursosData || []);
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudieron cargar los cursos.',
                    confirmButtonColor: '#dc3545', // Rojo para error
                });
            } finally {
                setLoading(false);
            }
        };

        fetchCursos();
    }, []);

    useEffect(() => {
        const fetchTaskData = async () => {
            if (mode === 'edit' && taskId) {
                try {
                    const taskData = await getDatosTarea(taskId);
                    if (taskData) {
                        const {
                            title,
                            description,
                            taskStart,
                            endTask,
                            startTime,
                            endTime,
                            asigCourse_id,
                            typeTask_id,
                        } = taskData;

                        setForm({
                            selectedCurso: asigCourse_id.toString(),
                            selectedTipoTarea: typeTask_id.toString(),
                            title,
                            description,
                            taskStart: taskStart.split('T')[0],
                            endTask: endTask.split('T')[0],
                            startTime,
                            endTime,
                        });
                    }
                } catch (error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No se pudieron cargar los datos de la tarea.',
                        confirmButtonColor: '#dc3545', // Rojo para error
                    });
                }
            }
        };

        fetchTaskData();
    }, [mode, taskId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { selectedCurso, selectedTipoTarea, title, description, taskStart, endTask, startTime, endTime } = form;
    
        // Validaciones de campos vacíos
        if (!selectedCurso || !title || !description || !taskStart || !endTask || !startTime || !endTime) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor complete todos los campos.',
                confirmButtonColor: '#dc3545', // Rojo para error
            });
            return;
        }
    
        // Validación de fecha final mayor que fecha inicial
        if (new Date(endTask) <= new Date(taskStart)) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'La Fecha Final debe ser mayor a la Fecha Inicial.',
                confirmButtonColor: '#dc3545', // Rojo para error
            });
            return;
        }
    
        // Validación de hora final mayor que hora inicial
        if (startTime >= endTime) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'La Hora Final debe ser mayor a la Fecha Inicial.',
                confirmButtonColor: '#dc3545', // Rojo para error
            });
            return;
        }
    
        try {
            setLoading(true);
            const { sede } = await getDatosPerfil();
            const selectedCourse = cursos.find((curso) => curso.course_id.toString() === selectedCurso);
    
            if (!selectedCourse) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Curso seleccionado no encontrado.',
                    confirmButtonColor: '#dc3545', // Rojo para error
                });
                return;
            }
    
            let resultMessage: string | null = null;
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
                resultMessage = await createTarea(tareaData);
            } else if (mode === 'edit' && taskId) {
                const tareaDataUpdate = {
                    title,
                    description,
                    taskStart,
                    endTask,
                    startTime,
                    endTime,
                };
                resultMessage = await updateTarea(taskId, tareaDataUpdate); // Llamada a updateTarea
            }
    
            if (resultMessage) {
                // Si hay un mensaje de error, mostrar alerta
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: resultMessage,
                    confirmButtonColor: '#dc3545', // Rojo para error
                });
            } else {
                // Si no hubo error, mostrar éxito
                Swal.fire({
                    icon: 'success',
                    title: 'Éxito',
                    text: `Tarea ${mode === 'create' ? 'creada' : 'actualizada'} exitosamente.`,
                    confirmButtonColor: '#28a745', // Verde para éxito
                });
                onClose();
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `Hubo un error al ${mode === 'create' ? 'crear' : 'actualizar'} la tarea.`,
                confirmButtonColor: '#dc3545', // Rojo para error
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Cargando...</div>;
    return (
        <div className="CreaTarea">
            <div className="modal-container">
                <div className="modal-background" onClick={onClose}></div>
                <div className="modal-content relative">
                    <button
                        onClick={onClose}
                        className="absolute top-5.3 right-2 text-gray-800 dark:text-gray-100 text-2xl leading-none"
                        aria-label="close"
                    >
                        &#10005;
                    </button>

                    <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100">
                        {mode === 'create' ? 'Crear Nueva Tarea' : 'Editar Tarea'}
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-4 w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="order-1 md:order-1">
                                <label className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-100">
                                    Tipo de Tarea
                                </label>
                                <select
                                    className="form-field"
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
                            <div className="order-2 md:order-2">
                                <label className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-100">Curso</label>
                                <select
                                    className="form-field"
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
                                className="form-field"
                                name="title"
                                placeholder="Título de la tarea"
                                value={form.title}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-100">Descripción</label>
                            <textarea
                                className="form-field"
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
                                    className="form-field"
                                    name="taskStart"
                                    value={form.taskStart}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-100">Fecha de Fin</label>
                                <input
                                    type="date"
                                    className="form-field"
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
                                    className="form-field"
                                    name="startTime"
                                    value={form.startTime}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-100">Hora de Fin</label>
                                <input
                                    type="time"
                                    className="form-field"
                                    name="endTime"
                                    value={form.endTime}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <button
                                type="button"
                                onClick={onClose}
                                className="py-2 px-4 bg-gray-500 text-white rounded-md"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="py-2 px-4 bg-blue-500 text-white rounded-md"
                            >
                                {mode === 'create' ? 'Crear Tarea' : 'Actualizar Tarea'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreaTarea;