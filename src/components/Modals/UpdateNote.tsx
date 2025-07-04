import React, { useEffect, useState } from "react"
import Swal from "sweetalert2"
import { getNote } from "../../ts/General/GetNote"
import { updateNote } from "../../ts/Administrator/UpdateNote"

interface ModalNotaProps {
    isOpen: boolean
    onClose: () => void
    studentId: number
    courseId: number
}

const ModalNota: React.FC<ModalNotaProps> = ({ isOpen, onClose, studentId, courseId }) => {
    const [nota, setNota] = useState("")
    const [role, setRole] = useState<number | null>(null)

    useEffect(() => {
        if (isOpen) {
            const storedRole = localStorage.getItem("userRole")
            setRole(storedRole ? Number(storedRole) : null)
            fetchNota()
        }
    }, [isOpen])

    const fetchNota = async () => {
        const data = await getNote(studentId, courseId)
        setNota(data.note !== null ? String(data.note) : "")
    }

    const handleGuardar = async () => {
        const notaNumerica = Number(nota)
        if (isNaN(notaNumerica)) {
            Swal.fire("Error", "La nota debe ser un número válido.", "error")
            return
        }

        const error = await updateNote({
            student_id: studentId,
            course_id: courseId,
            note: notaNumerica,
        })

        if (!error) {
            Swal.fire("Éxito", "La nota fue actualizada correctamente.", "success")
            onClose()
        } else {
            Swal.fire("Error", "Hubo un problema al actualizar la nota.", "error")
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Nota Estudiante</h2>
                <input
                    type="number"
                    value={nota}
                    onChange={(e) => setNota(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md mb-4 dark:bg-gray-700 dark:text-white"
                    placeholder="Ingrese la nota"
                    disabled={role === 5}
                />
                <div className="flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                    >
                        {role === 5 ? "Cerrar" : "Cancelar"}
                    </button>
                    {role !== 5 && (
                        <button
                            onClick={handleGuardar}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        >
                            Editar
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ModalNota
