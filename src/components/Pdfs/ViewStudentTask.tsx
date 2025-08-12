import React, { useEffect, useState } from "react";
import { getDetalleTareas, CourseDetails } from "../../ts/Administrator/GetTaskDetails";

interface ViewStudentTaskProps {
    estudiante: any;
    selectedAño: number;
    selectedCurso: number;
}

const ViewStudentTask: React.FC<ViewStudentTaskProps> = ({ estudiante, selectedAño, selectedCurso }) => {
    const [details, setDetails] = useState<CourseDetails | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!estudiante) return;

            try {
                const data = await getDetalleTareas(

                    estudiante.id,   // debe venir en el objeto estudiante
                    selectedCurso,      // debe venir en el objeto tarea
                    estudiante.sedeId,   // debe venir en el objeto estudiante
                    selectedAño          // año seleccionado para filtrar
                );
                setDetails(data);
            } catch (error) {
                
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [estudiante, selectedAño, selectedCurso]); // <-- importante incluir selectedAño aquí para actualizar al cambiarlo

    if (loading) return <p className="text-gray-500">Cargando detalles...</p>;

    if (!details) {
        return <p className="text-red-500">No se encontraron detalles de la tarea.</p>;
    }

    // Prevenir error si no hay entregas
    const submissions = details.formattedSubmissions || [];

    return (
        <div className="p-6 max-w-full mx-auto">

            {/* Lista de entregas */}
            {submissions.length === 0 ? (
                <p className="text-gray-500">No hay entregas para mostrar.</p>
            ) : (
                submissions.map((submission, index) => (
                    <div key={index} className="bg-white shadow rounded-lg p-4 mb-6">
                        {/* Visualizador del PDF */}
                        {submission.file_path && (
                            <div className="mt-4">
                                <iframe
                                    src={submission.file_path}
                                    title={`PDF-${index}`}
                                    width="100%"
                                    height="500px"
                                    className="border rounded"
                                ></iframe>
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default ViewStudentTask;
