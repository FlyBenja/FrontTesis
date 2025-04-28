import React, { useState, useEffect } from 'react';
import { getDatosPerfil } from '../../ts/Generales/GetDatsPerfil';
import { getCatedraticos } from '../../ts/CoordinadorSede/GetCatedraticos';
import { getCatedraticoPorCarnet } from '../../ts/CoordinadorSede/GetCatedraticosCarnet';

interface BusquedaCatedraticoProps {
  onSearchResults: (catedraticos: any[]) => void;
}

const BusquedaCatedratico: React.FC<BusquedaCatedraticoProps> = ({
  onSearchResults,
}) => {
  const [searchCarnet, setSearchCarnet] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Ejecutar búsqueda cuando cambia el input
  useEffect(() => {
    // Crear un temporizador para evitar múltiples búsquedas durante la escritura rápida
    const timer = setTimeout(() => {
      if (searchCarnet.length >= 12 || searchCarnet.length === 11) {
        handleSearch();
      } else if (searchCarnet.length === 0) {
        // Si el campo está vacío, mostrar todos los catedráticos
        handleSearch();
      }
    }, 300); // Pequeño retraso para mejorar rendimiento

    return () => clearTimeout(timer);
  }, [searchCarnet]);

  // Función de búsqueda
  const handleSearch = async () => {
    if (isSearching) return; // Evitar búsquedas simultáneas

    try {
      setIsSearching(true);
      
      if (!searchCarnet || searchCarnet.length < 12) {
        // Si el campo está vacío o tiene menos de 12 caracteres, mostrar todos los catedráticos
        const perfil = await getDatosPerfil();
        if (perfil.sede) {
          const catedraticosRecuperados = await getCatedraticos(perfil.sede);
          onSearchResults(Array.isArray(catedraticosRecuperados) ? catedraticosRecuperados : []);
        }
      } else {
        // Buscar catedrático específico por carnet/código
        const catedraticoEncontrado = await getCatedraticoPorCarnet(searchCarnet);
        onSearchResults(catedraticoEncontrado ? [catedraticoEncontrado] : []);
      }
    } catch (error) {
      console.error('Error al buscar el catedrático:', error);
      onSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="mb-4 flex items-center">
      <input
        id="search-input"
        type="text"
        placeholder="Buscar por Código / Nombre Catedrático"
        value={searchCarnet}
        onChange={(e) => setSearchCarnet(e.target.value)}
        className="w-80 px-2 py-2 border rounded-md dark:bg-boxdark dark:border-strokedark dark:text-white"
      />
      {isSearching && <div className="ml-2 text-sm text-gray-500 dark:text-gray-400">Buscando...</div>}
    </div>
  );
};

export default BusquedaCatedratico;
