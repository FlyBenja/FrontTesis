import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import "dayjs/locale/es";
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { getDatosPerfil } from '../../ts/Generales/GetDatsPerfil';
import { getTareasSede, Tarea } from '../../ts/Generales/GetTareasSede';

// Extend dayjs with isBetween plugin and set the locale to Spanish
dayjs.extend(isBetween);
dayjs.locale('es');

// Calendar component
const Calendar: React.FC = () => {
  // State to hold the current date
  const [currentDate, setCurrentDate] = useState(dayjs());
  // State to hold the list of tasks for the selected month
  const [tareas, setTareas] = useState<Tarea[]>([]);
  // State to hold the ID of the current "sede"
  const [sedeId, setSedeId] = useState<number | null>(null);

  // Calculate the first day of the month and the number of days in the current month
  const startOfMonth = currentDate.startOf("month");
  const startDay = startOfMonth.day();
  const daysInMonth = currentDate.daysInMonth();
  const totalDaysInCalendar = 42; // Total number of days in the calendar (6 rows of 7 days)
  const days: (number | null)[] = []; // Array to hold the days for the calendar view

  // Add null for the days before the start of the month
  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }

  // Add the days of the current month to the calendar
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  // Add null for the remaining days to complete the calendar
  const remainingDays = totalDaysInCalendar - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    days.push(null);
  }

  // Function to go to the previous month
  const handlePrevMonth = () => {
    setCurrentDate((prevDate) => {
      const newDate = prevDate.subtract(1, "month");
      // Ensure the month does not go below December (11)
      if (newDate.month() === 11) {
        return dayjs().month(11);
      }
      return newDate;
    });
  };

  // Function to go to the next month
  const handleNextMonth = () => {
    setCurrentDate((prevDate) => {
      const newDate = prevDate.add(1, "month");
      // Ensure the month does not go above January (0)
      if (newDate.month() === 0) {
        return dayjs().month(0);
      }
      return newDate;
    });
  };

  // Function to check if a given day is today
  const isToday = (day: number) => {
    return day && currentDate.date(day).isSame(dayjs(), "day");
  };

  // Effect hook to fetch the "sede" data when the component mounts
  useEffect(() => {
    const fetchDatosPerfil = async () => {
      const { sede } = await getDatosPerfil(); // Get profile data
      setSedeId(sede); // Set the "sede" ID
    };
    fetchDatosPerfil();
  }, []); // Empty dependency array means this runs only once on mount

  // Effect hook to fetch the tasks for the current "sede" and year
  useEffect(() => {
    const fetchTareas = async () => {
      if (sedeId !== null) {
        const tareasRecuperadas = await getTareasSede(sedeId, currentDate.year()); // Get tasks for the "sede" and year
        setTareas(tareasRecuperadas); // Set the tasks in state
      }
    };
    fetchTareas();
  }, [sedeId, currentDate]); // Re-run the effect when "sedeId" or "currentDate" changes

  // Function to get tasks for a specific day in the calendar
  const getTareasForDate = (day: number) => {
    if (!day) return []; // Return an empty array if the day is null
    const date = currentDate.date(day).startOf('day'); // Set the date for the specific day
    // Filter the tasks to get those that match the selected date
    return tareas.filter(tarea => {
      const taskStart = dayjs(tarea.taskStart).startOf('day');
      const taskEnd = dayjs(tarea.endTask).endOf('day');
      return date.isBetween(taskStart, taskEnd, null, '[]'); // Check if the date is between the task start and end dates
    });
  };

  return (
    <>
      <Breadcrumb pageName="Calendario" />
      <div className="w-full max-w-5xl bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <header className="flex justify-between items-center mb-6">
          <button
            onClick={handlePrevMonth}
            className="text-sm sm:text-lg font-bold px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            &lt; Prev
          </button>
          <h2 className="text-lg sm:text-xl font-bold">{currentDate.format("MMMM YYYY")}</h2>
          <button
            onClick={handleNextMonth}
            className="text-sm sm:text-lg font-bold px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Next &gt;
          </button>
        </header>

        <table className="table-fixed w-full border-collapse border border-gray-200 dark:border-gray-700">
          <thead>
            <tr>
              {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
                <th
                  key={day}
                  className="p-2 font-medium bg-gray-200 dark:bg-gray-700 border border-gray-200 dark:border-gray-700"
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }, (_, i) => (
              <tr key={i}>
                {days.slice(i * 7, (i + 1) * 7).map((day, j) => {
                  const tareasDelDia = day !== null ? getTareasForDate(day) : [];
                  return (
                    <td
                      key={j}
                      role="button"
                      tabIndex={0}
                      className={`h-20 text-center border border-gray-200 dark:border-gray-700 p-2 
                          ${day
                          ? isToday(day)
                            ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-bold"
                            : tareasDelDia.length > 0
                              ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300 font-bold"
                              : "bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-400"
                        }`}
                    >
                      {day || ""}
                      {tareasDelDia.length > 0 && (
                        <div className="text-xs mt-1 space-y-1">
                          {tareasDelDia.map((tarea, index) => (
                            <div key={index}>{tarea.title}</div>
                          ))}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
export default Calendar;
