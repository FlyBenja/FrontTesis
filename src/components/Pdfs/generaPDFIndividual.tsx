import jsPDF from 'jspdf';
import umgLogo from '../../images/Login/logo3.png';
import { getDetalleTareas } from '../../ts/Administrador/GetDetalleTareas'; // Ajusta el path según donde tengas la API
import { getDatosPerfil, PerfilData } from '../../ts/Generales/GetDatsPerfil'; // Ajusta el path según corresponda

interface EstudianteIndiviProps {
  estudiante: {
    id: number;
    userName: string;
    email: string;
    carnet: string;
  };
  selectedAño: number;
  selectedCurso: number;
}

const generaPDFIndividual = async (
  estudiante: EstudianteIndiviProps['estudiante'],
  selectedAño: number,
  selectedCurso: number
) => {
  const doc = new jsPDF();

  // Colores más suaves para el fondo y encabezados
  const backgroundColor = { r: 245, g: 245, b: 245 }; // Gris claro para el fondo
  const titleColor = { r: 56, g: 112, b: 255 }; // Azul suave para los títulos
  const headerColor = { r: 56, g: 112, b: 255 }; // Azul suave para las cabeceras de la tabla
  const textColor = { r: 0, g: 0, b: 0 }; // Negro para el texto principal
  const tableRowColor = { r: 240, g: 240, b: 240 }; // Gris claro para las filas de la tabla

  // Llamar a la API para obtener los detalles del perfil y la sede
  let sede_id: number;
  let Usergenerate: string;

  try {
    const perfilData: PerfilData = await getDatosPerfil();
    sede_id = perfilData.sede; // Obtener el sede_id del perfil
    Usergenerate = perfilData.userName;
  } catch (error) {
    console.error('No se pudo obtener el perfil del usuario:', error);
    return;
  }

  // Llamar a la API para obtener los detalles del curso y las entregas
  const user_id = estudiante.id; // Obtener del estudiante
  const year = selectedAño;

  const courseDetails = await getDetalleTareas(user_id, selectedCurso, sede_id, year);

  if (!courseDetails) {
    console.error('No se pudieron obtener los detalles del estudiante y curso.');
    return;
  }

  const { student, formattedSubmissions } = courseDetails;

  // Establecer fondo con color suave
  doc.setFillColor(backgroundColor.r, backgroundColor.g, backgroundColor.b);
  doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');

  // Agregar el logo en la parte superior izquierda
  const logoWidth = 21;
  const logoHeight = 21;
  const logoX = 10;
  const logoY = 5;
  const logoBase64 = umgLogo;
  doc.addImage(logoBase64, 'PNG', logoX, logoY, logoWidth, logoHeight);

  // Agregar texto de cabecera con color gris claro
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(200, 200, 200); // Gris claro
  doc.text(
    'UNIVERSIDAD MARIANO GALVEZ DE GUATEMALA (UMG)',
    (doc.internal.pageSize.width - doc.getTextWidth('UNIVERSIDAD MARIANO GALVEZ DE GUATEMALA (UMG)')) / 2,
    15
  );

  // Título del PDF con el nombre del estudiante, centrado
  doc.setFontSize(22);
  doc.setTextColor(titleColor.r, titleColor.g, titleColor.b);
  const title = `Reporte de Estudiante`;
  const titleWidth = doc.getTextWidth(title);
  doc.text(title, (doc.internal.pageSize.width - titleWidth) / 2, 25);

  // Línea separadora
  doc.setLineWidth(0.5);
  doc.setDrawColor(titleColor.r, titleColor.g, titleColor.b);
  doc.line(10, 30, doc.internal.pageSize.width - 10, 30);

  // Información del estudiante y del curso a la par
  const sectionWidth = (doc.internal.pageSize.width - 2 * 40) / 2;

  // Información del Estudiante (columna izquierda)
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(textColor.r, textColor.g, textColor.b);
  doc.text('Información del Estudiante', 40, 40, { align: 'center' });

  doc.setFontSize(12);
  doc.text('Nombre:', 20, 50, { align: 'center' });
  doc.text('Carnet:', 19, 60, { align: 'center' });
  doc.text('Email:', 18, 70, { align: 'center' });

  doc.setFont('helvetica', 'normal'); // Regresa a texto normal
  doc.text(student.name, 44, 50, { align: 'center' });
  doc.text(student.carnet, 40, 60, { align: 'center' });
  doc.text(student.email, 51, 70, { align: 'center' });

  // Información del Curso (columna derecha)
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Información del Curso', 31 + sectionWidth + 60, 40, { align: 'center' });

  doc.setFontSize(12);
  doc.text('Curso:', 14.5 + sectionWidth + 60, 50, { align: 'center' });
  doc.text('Sede:', 13.5 + sectionWidth + 60, 60, { align: 'center' });
  doc.text('Año:', 13 + sectionWidth + 60, 70, { align: 'center' });

  doc.setFont('helvetica', 'normal'); // Regresa a texto normal
  doc.text(student.course, 6 + sectionWidth + 100, 50, { align: 'center' });
  doc.text(student.sede, -9 + sectionWidth + 100, 60, { align: 'center' });
  doc.text(String(selectedAño), -16 + sectionWidth + 100, 70, { align: 'center' });

  // Tabla de tareas entregadas
  const startY = 90; // Modificado para bajar los campos
  doc.setFontSize(12);
  const marginLeftAdjusted = 11; // Ajustado para mover hacia la izquierda
  doc.text('Tareas Entregadas:', marginLeftAdjusted, startY);

  const tableStartY = startY + 5;
  const rowHeight = 8; // Reducir altura de las filas
  const columnWidths = [30, 60, 90]; // Reducir los anchos de las columnas
  doc.setDrawColor(headerColor.r, headerColor.g, headerColor.b);
  doc.setLineWidth(0.5);

  // Encabezado de la tabla, centrado
  doc.setFillColor(headerColor.r, headerColor.g, headerColor.b);
  doc.rect(14, tableStartY, columnWidths[0], rowHeight, 'F'); // Columna 1
  doc.rect(44, tableStartY, columnWidths[1], rowHeight, 'F'); // Columna 2
  doc.rect(104, tableStartY, columnWidths[2], rowHeight, 'F'); // Columna 3
  doc.setTextColor(255, 255, 255); // Blanco para el texto de los encabezados
  doc.text('No.', 20, tableStartY + 5);
  doc.text('Titulo', 63, tableStartY + 5);
  doc.text('Fecha de Entrega', 107, tableStartY + 5);
  doc.text('Completada', 165, tableStartY + 5);

  // Dibujar contenido de la tabla, centrado
  formattedSubmissions.forEach((submission, index) => {
    const yPosition = tableStartY + (index + 1) * rowHeight;
    const completionStatus = submission.submission_complete ? 'Sí' : 'No';

    doc.setFillColor(tableRowColor.r, tableRowColor.g, tableRowColor.b);
    doc.rect(14, yPosition, columnWidths[0], rowHeight, 'F'); // Columna 1
    doc.rect(44, yPosition, columnWidths[1], rowHeight, 'F'); // Columna 2
    doc.rect(104, yPosition, columnWidths[2], rowHeight, 'F'); // Columna 3

    // Formatear la fecha de entrega
    const deliveryDate = new Date(submission.date);
    const formattedDate = `${deliveryDate.getDate().toString().padStart(2, '0')}/${(
      deliveryDate.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}/${deliveryDate.getFullYear()}`;
    const formattedTime = `${deliveryDate.getHours().toString().padStart(2, '0')}:${deliveryDate
      .getMinutes()
      .toString()
      .padStart(2, '0')}:${deliveryDate
        .getSeconds()
        .toString()
        .padStart(2, '0')}`;

    doc.setTextColor(textColor.r, textColor.g, textColor.b);
    doc.text((index + 1).toString(), 6 + columnWidths[0] / 2, yPosition + 5, { align: 'center' }); // Corregido
    doc.text(submission.title, 54 + columnWidths[0] / 2, yPosition + 5, { align: 'center' });
    doc.text(`${formattedDate} ${formattedTime}`, 93 + columnWidths[1] / 2, yPosition + 5, { align: 'center' });
    doc.text(completionStatus, 134 + columnWidths[2] / 2, yPosition + 5, { align: 'center' });
  });

  // Pie de página
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150); // Gris para el pie de página
  doc.text(
    `Generado por ${Usergenerate}`,
    (doc.internal.pageSize.width - doc.getTextWidth('Generado por')) / 2.2,
    280
  );

  // Guardar el PDF
  doc.save(`Reporte_${student.name}.pdf`);
};

export default generaPDFIndividual;
