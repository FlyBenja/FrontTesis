import React from 'react';

/**
 * Props for the ActivaCatedraticos component.
 */
interface ActivaCatedraticosProps {
  enabled: boolean;
  onChange: () => void;
  uniqueId: string; // We add a uniqueId to make the input id unique
}

/**
 * ActivaCatedraticos is a toggle switch component used to enable or disable a feature
 * (e.g., activation of 'catedráticos'). It uses Tailwind CSS for styling and animation.
 *
 */
const ActivaCatedraticos: React.FC<ActivaCatedraticosProps> = ({ enabled, onChange, uniqueId }) => {
  return (
    <div>
      {/* Label linked to the toggle input */}
      <label htmlFor={`toggle-${uniqueId}`} className="flex cursor-pointer select-none items-center">
        <div className="relative">
          {/* Hidden checkbox input used to manage the toggle state */}
          <input
            type="checkbox"
            id={`toggle-${uniqueId}`} // We use the uniqueId to make the input unique
            className="sr-only"
            checked={enabled}
            onChange={onChange}
          />

          {/* The visual track of the toggle switch, colored depending on state */}
          <div
            className={`block h-8 w-14 rounded-full transition duration-300 ease-in-out ${
              enabled ? 'bg-green-500' : 'bg-red-500'
            }`}
          >
            {/* The toggle thumb that slides left or right */}
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

export default ActivaCatedraticos;
