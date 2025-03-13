import React, { useState } from 'react';
import Swal from 'sweetalert2';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { getDatosPerfil } from '../../ts/Generales/GetDatsPerfil'; // Asegúrate de importar correctamente
import { enviaRevision } from '../../ts/Administrador/EnviaRevision'; // Asegúrate de importar correctamente
import ModalCreateUserSinLogin from '../../components/Modals/CrearUsuario/ModalCreateUserSinLogin';

const EnviaRevision: React.FC = () => {
    const [carnet, setCarnet] = useState<string>('');
    const [tesisAprobada, setTesisAprobada] = useState<File | null>(null);
    const [cartaAprobada, setCartaAprobada] = useState<File | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [sedeId, setSedeId] = useState<number | null>(null);  // Estado para almacenar el sede_id
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const handleCarnetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCarnet(e.target.value);
    };

    const handleArchivo1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setTesisAprobada(e.target.files[0]);
        }
    };

    const handleArchivo2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setCartaAprobada(e.target.files[0]);
        }
    };

    // Función para obtener datos del perfil y configurar la sede
    const fetchSedeId = async () => {
        try {
            const perfilData = await getDatosPerfil();
            setSedeId(perfilData.sede);  // Establece el sede_id desde la API
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al obtener los datos del perfil.',
                confirmButtonText: 'OK',
                customClass: {
                    confirmButton: 'bg-red-600 text-white', // Establece el botón en rojo con texto blanco
                }
            });
        }
    };

    const handleSubmit = async () => {
        if (!carnet || !tesisAprobada || !cartaAprobada || sedeId === null) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Por favor, completa todos los campos.',
                confirmButtonText: 'OK',
                customClass: {
                    confirmButton: 'bg-red-600 text-white', // Establece el botón en rojo con texto blanco
                }
            });
            return;
        }

        setLoading(true); // Empieza el indicador de carga

        try {
            // Llama a la API para enviar la revisión
            await enviaRevision({
                carnet: carnet,
                sede_id: sedeId,  // Envía el sede_id recuperado
                approval_letter: cartaAprobada,  // Envía el archivo de la carta de aprobación
                thesis: tesisAprobada  // Envía el archivo de la tesis
            });
            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'La revisión ha sido enviada correctamente.',
                confirmButtonText: 'OK',
                customClass: {
                    confirmButton: 'bg-green-600 text-white', // Establece el botón en verde con texto blanco
                }
            });
        } catch (error: any) {
            // Muestra el mensaje de error que viene de la API
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Hubo un error al enviar la revisión. Inténtalo nuevamente.',
                confirmButtonText: 'OK',
                customClass: {
                    confirmButton: 'bg-red-600 text-white', // Establece el botón en rojo con texto blanco
                }
            });
        } finally {
            setLoading(false); // Detiene el indicador de carga
        }
    };

    // Llama a la función fetchSedeId cuando el componente se monte
    React.useEffect(() => {
        fetchSedeId();
    }, []);

    return (
        <>
            <Breadcrumb pageName="Enviar Tesis a Revisión" />
            <div className="mx-auto max-w-4xl px-6 py-8 bg-white rounded-xl shadow-md">
                <div className="relative mb-6">
                    <h1 className="text-2xl font-semibold text-center text-gray-800">Formulario</h1>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="absolute right-0 top-0 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Crear Usuario
                    </button>
                </div>

                <div className="mb-6">
                    <label htmlFor="carnet" className="block text-sm font-semibold text-gray-700 dark:text-white">
                        Carnet
                    </label>
                    <input
                        type="text"
                        id="carnet"
                        value={carnet}
                        onChange={handleCarnetChange}
                        className="w-full px-4 py-3 mt-1 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-boxdark dark:border-strokedark dark:text-white"
                        placeholder="Ingresa el carnet"
                    />
                </div>

                <label className="block text-sm font-semibold text-gray-700 dark:text-white mb-4 text-center">
                    Archivos Solicitados
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    <div className="w-full">
                        <label htmlFor="archivo1" className="block text-sm font-semibold text-gray-700 dark:text-white">
                            Tesis Aprobada
                        </label>
                        <input
                            type="file"
                            id="archivo1"
                            onChange={handleArchivo1Change}
                            className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                        />
                    </div>

                    <div className="w-full">
                        <label htmlFor="archivo2" className="block text-sm font-semibold text-gray-700 dark:text-white">
                            Carta de Aprobación
                        </label>
                        <input
                            type="file"
                            id="archivo2"
                            onChange={handleArchivo2Change}
                            className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                        />
                    </div>
                </div>

                <div className="mb-6 flex justify-center">
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`px-6 py-2 w-full sm:w-auto ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-500`}
                    >
                        {loading ? 'Enviando...' : 'Enviar Revisión'}
                    </button>
                </div>
            </div>
            {isModalOpen && <ModalCreateUserSinLogin onClose={() => setIsModalOpen(false)} />}
        </>
    );
};

export default EnviaRevision;
