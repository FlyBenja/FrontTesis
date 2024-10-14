import React from 'react';
import './CreaTarea.css';

interface CreaTareaProps {
    onClose: () => void;
}

const CreaTarea: React.FC<CreaTareaProps> = ({ onClose }) => {
    return (
        <div className="CreaTarea">
            <div className="modal-container">
                <div className="modal-background" onClick={onClose}></div>
                <div className="modal-content relative"> {/* El color fuerte se controla con clases */}
                    {/* Botón "X" para cerrar */}
                    <button
                        onClick={onClose}
                        className="absolute top-2 right-2 text-gray-800 dark:text-gray-100 text-2xl leading-none"
                        aria-label="close"
                    >
                        &#10005;
                    </button>

                    <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-100">Crear Nueva Tarea</h3>
                    <form className="space-y-4">
                        {/* Seleccionadores */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-100">Tipo de Tarea</label>
                                <select className="form-field">
                                    <option value="Capítulo">Capítulo</option>
                                    <option value="Propuesta de Tesis">Propuesta de Tesis</option>
                                </select>
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-100">Curso</label>
                                <select className="form-field">
                                    <option value="Matemáticas">Matemáticas</option>
                                    <option value="Ciencias">Ciencias</option>
                                    <option value="Historia">Historia</option>
                                </select>
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-100">Punteo</label>
                                <input
                                    type="number"
                                    className="form-field"
                                    placeholder="Punteo de la tarea"
                                />
                            </div>
                        </div>

                        {/* Título */}
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-100">Título</label>
                            <input
                                type="text"
                                className="form-field"
                                placeholder="Título de la tarea"
                            />
                        </div>

                        {/* Descripción */}
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-100">Descripción</label>
                            <textarea
                                className="form-field"
                                placeholder="Descripción de la tarea"
                            ></textarea>
                        </div>

                        {/* Fechas y horas */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-100">Fecha de Inicio</label>
                                <input
                                    type="date"
                                    className="form-field"
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-100">Fecha de Fin</label>
                                <input
                                    type="date"
                                    className="form-field"
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-100">Hora de Inicio</label>
                                <input
                                    type="time"
                                    className="form-field"
                                />
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-100">Hora de Fin</label>
                                <input
                                    type="time"
                                    className="form-field"
                                />
                            </div>
                        </div>

                        {/* Botones de acción */}
                        <div className="flex justify-between items-center">
                            <button
                                type="button"
                                className="px-4 py-2 border border-gray-400 dark:border-gray-500 rounded-md shadow-sm text-sm font-medium bg-gray-600 dark:bg-gray-800 hover:bg-gray-500 dark:hover:bg-gray-700 text-white" // Texto blanco y fondo más gris
                                onClick={onClose}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-500 dark:bg-blue-700 text-white rounded-md shadow-sm hover:bg-blue-600 dark:hover:bg-blue-800"
                            >
                                Guardar Tarea
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreaTarea;
