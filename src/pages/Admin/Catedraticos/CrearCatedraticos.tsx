import { useState, useEffect } from 'react';
import { getDatosPerfil } from '../../../ts/Generales/GetDatsPerfil'; // Recuperar la sede
import { createCatedratico } from '../../../ts/Admin/CreateCatedratico'; // Crear catedrático
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import Swal from 'sweetalert2';

const CrearCatedraticos = () => {
  // Estados para los campos del formulario
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [carnet, setCarnet] = useState('');
  const [sedeId, setSedeId] = useState<number | null>(null); // Inicializamos como null
  const [year, setYear] = useState<number>(new Date().getFullYear()); // Año actual

  // Estado para manejo de carga
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Obtener los datos de perfil (incluida la sede)
    const fetchDatosPerfil = async () => {
      try {
        const { sede } = await getDatosPerfil(); // Asegúrate de que getDatosPerfil devuelva la sede correctamente
        setSedeId(sede); // Establece el sedeId desde la respuesta
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al obtener la sede',
        });
      }
    };

    fetchDatosPerfil();
  }, []); // Solo se ejecuta una vez al cargar el componente

  const validateForm = () => {
    if (!nombre || !correo || !carnet || sedeId === null) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Todos los campos son obligatorios',
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // No continuar si hay errores en la validación
    }

    if (sedeId === null) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'La sede no puede estar vacía',
      });
      return; // Detener el envío si la sede es null
    }

    setLoading(true); // Activar el estado de carga

    try {
      // Console log de los datos antes de hacer la llamada a la API
      console.log('Datos enviados a la API:', {
        email: correo,
        name: nombre,
        carnet: carnet,
        sede_id: sedeId, // Ahora sabemos que sedeId no es null
        year: year,
      });

      // Llamada a la API para crear el catedrático
      await createCatedratico({
        email: correo,
        name: nombre,
        carnet: carnet,
        sede_id: sedeId, // Enviar como número, ya que validamos que no es null
        year: year,
      });

      // Limpiar campos después de la creación
      setNombre('');
      setCorreo('');
      setCarnet('');
      setSedeId(null);
      setYear(new Date().getFullYear());

      Swal.fire({
        icon: 'success',
        title: 'Catedrático creado exitosamente',
        text: 'El catedrático fue creado correctamente.',
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un error al crear el catedrático',
      });
    } finally {
      setLoading(false); // Desactivar el estado de carga
    }
  };

  return (
    <>
      <Breadcrumb pageName="Crear Catedrático" />
      <div className="flex justify-center mt-0">
        <div className="w-full max-w-md overflow-hidden">
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="border-b border-stroke py-3 px-6.5 dark:border-strokedark">
              <h3 className="font-medium text-black dark:text-white text-center">
                Crear Catedrático Individual
              </h3>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="p-6.5 space-y-4">
                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ingresa el nombre completo"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    disabled={loading} // Deshabilitar campos durante la carga
                  />
                </div>

                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    placeholder="Ingresa el correo electrónico"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label className="mb-2.5 block text-black dark:text-white">
                    Carnet
                  </label>
                  <input
                    type="text"
                    value={carnet}
                    onChange={(e) => setCarnet(e.target.value)}
                    placeholder="Ingresa el carnet"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  className="flex w-full justify-center rounded bg-primary p-3 font-medium text-white hover:bg-opacity-90"
                  disabled={loading}
                >
                  {loading ? 'Creando...' : 'Crear Catedrático'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Indicador de carga */}
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <div className="text-white text-xl">Espere un momento en lo que se crea el Catedrático...</div>
        </div>
      )}
    </>
  );
};

export default CrearCatedraticos;
