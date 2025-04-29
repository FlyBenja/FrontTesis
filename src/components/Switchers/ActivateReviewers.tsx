import React from 'react';

/**
 * Props for the ActivaRevisores component.
 */
interface ActivaRevisoresProps {
  enabled: boolean;
  onChange: () => void;
  uniqueId: string; // Agregamos un uniqueId para hacer único el id del input
}

/**
 * ActivaRevisores is a toggle switch component that represents a binary on/off state.
 * The toggle is styled using Tailwind CSS classes.
 * It supports a unique identifier for each instance to avoid duplicated IDs in the DOM.
 *
 */
const ActivaRevisores: React.FC<ActivaRevisoresProps> = ({ enabled, onChange, uniqueId }) => {
  return (
    <div>
      {/* Label container for the toggle switch */}
      <label htmlFor={`toggle-${uniqueId}`} className="flex cursor-pointer select-none items-center">
        <div className="relative">
          {/* Hidden checkbox input to manage the toggle state */}
          <input
            type="checkbox"
            id={`toggle-${uniqueId}`} // Usamos el uniqueId para hacer único el input
            className="sr-only"
            checked={enabled}
            onChange={onChange}
          />

          {/* Track of the toggle switch with dynamic color */}
          <div
            className={`block h-8 w-14 rounded-full transition duration-300 ease-in-out ${
              enabled ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            {/* Toggle circle that moves based on the enabled state */}
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

export default ActivaRevisores;
