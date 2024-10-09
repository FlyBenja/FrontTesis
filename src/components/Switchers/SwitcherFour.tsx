import React from 'react';

interface SwitcherFourProps {
  enabled: boolean;
  onChange: () => void;
  uniqueId: string; // Agregamos un uniqueId para hacer único el id del input
}

const SwitcherFour: React.FC<SwitcherFourProps> = ({ enabled, onChange, uniqueId }) => {
  return (
    <div>
      <label htmlFor={`toggle-${uniqueId}`} className="flex cursor-pointer select-none items-center">
        <div className="relative">
          <input
            type="checkbox"
            id={`toggle-${uniqueId}`} // Usamos el uniqueId para hacer único el input
            className="sr-only"
            checked={enabled}
            onChange={onChange}
          />
          <div
            className={`block h-8 w-14 rounded-full transition duration-300 ease-in-out ${
              enabled ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            <div
              className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white shadow transition-transform duration-300 ease-in-out ${
                enabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            ></div>
          </div>
        </div>
      </label>
    </div>
  );
};

export default SwitcherFour;
