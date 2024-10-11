import React from 'react';

interface CreaTareaProps {
    onClose: () => void;
}

const CreaTarea: React.FC<CreaTareaProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Fondo del modal */}
            <div className="bg-black bg-opacity-50 absolute inset-0" onClick={onClose}></div>

            {/* Contenido del modal */}
            <div className="bg-white dark:bg-boxdark rounded-lg shadow-lg z-50 p-4 w-full max-w-xl relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-600 dark:text-gray-300 text-lg leading-none"
                    aria-label="close"
                >
                    &#10005;
                </button>

                <h3 className="text-lg font-bold mb-4">Crear Nueva Tarea</h3>
                <form className="space-y-4">
                    {/* Seleccionadores */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-white">Tipo de Tarea</label>
                            <select className="w-full px-4 py-2 border border-gray-300 rounded-md dark:bg-boxdark dark:border-strokedark dark:text-white">
                                <option value="Capítulo">Capítulo</option>
                                <option value="Propuesta de Tesis">Propuesta de Tesis</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-white">Curso</label>
                            <select className="w-full px-4 py-2 border border-gray-300 rounded-md dark:bg-boxdark dark:border-strokedark dark:text-white">
                                <option value="Matemáticas">Matemáticas</option>
                                <option value="Ciencias">Ciencias</option>
                                <option value="Historia">Historia</option>
                            </select>
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-white">Punteo</label>
                            <input
                                type="number"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md dark:bg-boxdark dark:border-strokedark dark:text-white"
                                placeholder="Punteo de la tarea"
                            />
                        </div>
                    </div>

                    {/* Título */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-white">Título</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md dark:bg-boxdark dark:border-strokedark dark:text-white"
                            placeholder="Título de la tarea"
                        />
                    </div>

                    {/* Descripción */}
                    <div>
                        <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-white">Descripción</label>
                        <textarea
                            className="w-full px-4 py-2 border border-gray-300 rounded-md dark:bg-boxdark dark:border-strokedark dark:text-white"
                            placeholder="Descripción de la tarea"
                        ></textarea>
                    </div>

                    {/* Fechas y horas */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-white">Fecha de Inicio</label>
                            <input
                                type="date"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md dark:bg-boxdark dark:border-strokedark dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-white">Fecha de Fin</label>
                            <input
                                type="date"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md dark:bg-boxdark dark:border-strokedark dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-600 dark:text-white">Hora de Inicio</label>
                            <input
                                type="time"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md dark:bg-boxdark dark:border-strokedark dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Botones de acción */}
                    <div className="flex justify-between items-center">
                        <button
                            type="button"
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-white bg-gray-500 hover:bg-gray-400"
                            onClick={onClose}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="px-4 py-2 bg-primary text-white rounded-md shadow-sm hover:bg-primary-dark"
                        >
                            Guardar Tarea
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreaTarea;
