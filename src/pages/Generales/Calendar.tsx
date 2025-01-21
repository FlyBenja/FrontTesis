import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import "dayjs/locale/es";
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { getDatosPerfil } from '../../ts/Generales/GetDatsPerfil';
import { getTareasSede, Tarea } from '../../ts/Generales/GetTareasSede';

dayjs.extend(isBetween);
dayjs.locale('es');

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [sedeId, setSedeId] = useState<number | null>(null);

  const startOfMonth = currentDate.startOf("month");
  const startDay = startOfMonth.day();
  const daysInMonth = currentDate.daysInMonth();
  const totalDaysInCalendar = 42;
  const days: (number | null)[] = [];

  for (let i = 0; i < startDay; i++) {
    days.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const remainingDays = totalDaysInCalendar - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    days.push(null);
  }

  const handlePrevMonth = () => {
    setCurrentDate((prevDate) => {
      const newDate = prevDate.subtract(1, "month");
      if (newDate.month() === 11) {
        return dayjs().month(11);
      }
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate((prevDate) => {
      const newDate = prevDate.add(1, "month");
      if (newDate.month() === 0) {
        return dayjs().month(0);
      }
      return newDate;
    });
  };

  const isToday = (day: number) => {
    return day && currentDate.date(day).isSame(dayjs(), "day");
  };

  useEffect(() => {
    const fetchDatosPerfil = async () => {
      const { sede } = await getDatosPerfil();
      setSedeId(sede);
    };
    fetchDatosPerfil();
  }, []);

  useEffect(() => {
    const fetchTareas = async () => {
      if (sedeId !== null) {
        const tareasRecuperadas = await getTareasSede(sedeId, currentDate.year());
        setTareas(tareasRecuperadas);
      }
    };
    fetchTareas();
  }, [sedeId, currentDate]);

  const getTareasForDate = (day: number) => {
    if (!day) return [];
    const date = currentDate.date(day).startOf('day');
    return tareas.filter(tarea => {
      const taskStart = dayjs(tarea.taskStart).startOf('day');
      const taskEnd = dayjs(tarea.endTask).endOf('day');
      return date.isBetween(taskStart, taskEnd, null, '[]');
    });
  };

  return (
    <>
      <Breadcrumb pageName="Calendario" />
      <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col items-center justify-center px-2 sm:min-h-screen sm:py-6 py-3 mt-[-60px]">
        <div className="w-full max-w-5xl bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
          <header className="flex justify-between items-center mb-6">
            <button
              onClick={handlePrevMonth}
              className="text-sm sm:text-lg font-bold px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              &lt; Prev
            </button>
            <h2 className="text-lg sm:text-xl font-bold mt-3 sm:mt-0">{currentDate.format("MMMM YYYY")}</h2>
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
                          <div className="text-xs mt-1">
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
      </div>
    </>
  );
};

export default Calendar;
