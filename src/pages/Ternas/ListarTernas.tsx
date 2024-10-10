import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';

interface Persona {
  presidente: string;
  secretario: string;
  vocal: string;
}

const ListarTernas: React.FC = () => {
  // Datos simulados de las ternas
  const ternas: Persona[] = [
    { presidente: 'Juan Pérez', secretario: 'María López', vocal: 'Carlos Sánchez' },
    { presidente: 'Ana Méndez', secretario: 'Pedro González', vocal: 'Luis García' },
    { presidente: 'Gabriela Ruiz', secretario: 'David Hernández', vocal: 'Elena Gómez' },
    { presidente: 'Jorge Martínez', secretario: 'Clara Castillo', vocal: 'Daniel Flores' },
    { presidente: 'Marcos Díaz', secretario: 'Silvia Peña', vocal: 'Fernando Torres' },
    { presidente: 'Julia Fernández', secretario: 'César López', vocal: 'Laura Gil' },
    { presidente: 'Ricardo Ortega', secretario: 'Valeria Mena', vocal: 'Héctor Ramos' },
    { presidente: 'Diana Rodríguez', secretario: 'Oscar Herrera', vocal: 'Andrea Morales' },
    { presidente: 'Luis Aguilar', secretario: 'Sandra Guzmán', vocal: 'Javier Suárez' },
    { presidente: 'Marta Paredes', secretario: 'Ignacio Castro', vocal: 'Sofía Ramírez' },
    { presidente: 'Manuel Reyes', secretario: 'Beatriz Acosta', vocal: 'Pablo Salazar' },
    { presidente: 'Claudia Solano', secretario: 'Mario Navarro', vocal: 'Gina Esquivel' },
    { presidente: 'Pedro Rivas', secretario: 'Francisca Ríos', vocal: 'Adrián Mendoza' },
    { presidente: 'Roberto Campos', secretario: 'Lourdes Rivera', vocal: 'Felipe Vega' },
    { presidente: 'Cristina Vargas', secretario: 'Alberto Franco', vocal: 'Elisa Pérez' },
    { presidente: 'Emilio Zamora', secretario: 'Victoria Serrano', vocal: 'Raúl Morales' },
    { presidente: 'Paola Quintana', secretario: 'Diego Fernández', vocal: 'Carmen Espinoza' },
    { presidente: 'Fernando Ortiz', secretario: 'Inés Molina', vocal: 'Tomás Castañeda' },
  ];

  return (
    <>
      <Breadcrumb pageName="Listar Ternas" />
      <div className="mx-auto max-w-5xl px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ternas.map((terna, index) => (
            <div key={index} className="rounded-lg border border-gray-200 bg-white shadow-md p-4 dark:bg-boxdark dark:border-strokedark">
              <h2 className="text-xl font-semibold text-center text-black dark:text-white mb-4">Terna {index + 1}</h2>
              <div className="text-black dark:text-white">
                <p><strong>Presidente:</strong> {terna.presidente}</p>
                <p><strong>Secretario:</strong> {terna.secretario}</p>
                <p><strong>Vocal:</strong> {terna.vocal}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ListarTernas;
