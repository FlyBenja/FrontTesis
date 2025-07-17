import jsPDF from 'jspdf';
import umgLogo from '../../../images/Login/logo3.png';
import { getDetalleTareasGeneral, CourseDetails } from '../../../ts/Administrator/GetGeneralTaskDetails';
import { getDatosPerfil, PerfilData } from '../../../ts/General/GetProfileData';

/**
 * Generates a general report PDF for a specific year and course.
 * The report includes student task submissions and their completion status.
 * 
 */
const generatePDFGeneral = async (
  selectedAño: number,
  selectedCurso: number
) => {
  const doc = new jsPDF();

  // Colors for background and headers
  const backgroundColor = { r: 245, g: 245, b: 245 };
  const titleColor = { r: 56, g: 112, b: 255 };
  const headerColor = { r: 56, g: 112, b: 255 };
  const textColor = { r: 0, g: 0, b: 0 };
  const tableRowColor = { r: 240, g: 240, b: 240 };

  // Fetch user profile and campus details via API
  let sede_id: number;
  let Usergenerate: string;

  try {
    const perfilData: PerfilData = await getDatosPerfil();
    sede_id = Number(localStorage.getItem("selectedSedeId"))    // Obtener la sede-id desde localStorage en lugar de la API
    Usergenerate = perfilData.userName;
  } catch (error) {
    console.error('No se pudo obtener el perfil del usuario:', error);
    return;
  }

  // Fetch course details and submissions via API
  const courseDetails: CourseDetails | null = await getDetalleTareasGeneral(selectedCurso, sede_id, selectedAño);

  if (!courseDetails) {
    console.error('No se pudieron obtener los detalles del curso.');
    return;
  }

  const { course, sede, students } = courseDetails;

  // Set background with light color
  doc.setFillColor(backgroundColor.r, backgroundColor.g, backgroundColor.b);
  doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');

  // Add logo at top-left corner
  const logoWidth = 21;
  const logoHeight = 21;
  const logoX = 10;
  const logoY = 5;
  const logoBase64 = umgLogo;
  doc.addImage(logoBase64, 'PNG', logoX, logoY, logoWidth, logoHeight);

  // Add header text with light gray color
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(200, 200, 200); // Light gray
  doc.text(
    'UNIVERSIDAD MARIANO GALVEZ DE GUATEMALA (UMG)',
    (doc.internal.pageSize.width - doc.getTextWidth('UNIVERSIDAD MARIANO GALVEZ DE GUATEMALA (UMG)')) / 2,
    15
  );

  // Title of the PDF with student name, centered
  doc.setFontSize(22);
  doc.setTextColor(titleColor.r, titleColor.g, titleColor.b);
  const title = `Reporte de Estudiante`;
  const titleWidth = doc.getTextWidth(title);
  doc.text(title, (doc.internal.pageSize.width - titleWidth) / 2, 25);

  // Separator line
  doc.setLineWidth(0.5);
  doc.setDrawColor(titleColor.r, titleColor.g, titleColor.b);
  doc.line(10, 30, doc.internal.pageSize.width - 10, 30);

  // Course information in a single line
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(textColor.r, textColor.g, textColor.b);
  doc.text('Información del Curso', 75, 40);

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Curso: ${course} | Sede: ${sede} | Año: ${selectedAño}`, 40, 50);

  // Task submission table
  const rowHeight = 8;
  const columnWidths = [30, 60, 90];

  let startY = 60; // Start from the next available line
  let studentCount = 1; // Global counter for students

  students.forEach((studentDetail) => {
    const { student, submissions } = studentDetail;

    // Determine the number of students per page depending on submissions
    const studentsPerPage = submissions.length > 3 ? 3 : submissions.length === 1 ? 5 : 4;

    if (studentCount > 1 && studentCount % studentsPerPage === 1) {
      // Create a new page when the student per page limit is reached
      doc.addPage();
      startY = 20; // Reset the Y position for the new page
    }

    // Separator line for each new student
    if (studentCount > 1) {
      doc.setLineWidth(0.5);
      doc.setDrawColor(titleColor.r, titleColor.g, titleColor.b);
      doc.line(10, startY - 7, doc.internal.pageSize.width - 10, startY - 7);
    }

    // Student title with counter
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(textColor.r, textColor.g, textColor.b);
    doc.text(`No. ${studentCount} - Información del Estudiante`, 70, startY);

    // Student information in a single line
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(textColor.r, textColor.g, textColor.b);
    doc.text(`Nombre: ${student.name} | Carnet: ${student.carnet} | Correo: ${student.email}`, 30, startY + 10);

    // Task submission table
    const tableStartY = startY + 20;
    doc.setDrawColor(headerColor.r, headerColor.g, headerColor.b);
    doc.setLineWidth(0.5);

    // Table header
    doc.setFillColor(headerColor.r, headerColor.g, headerColor.b);
    doc.rect(14, tableStartY, columnWidths[0], rowHeight, 'F');
    doc.rect(44, tableStartY, columnWidths[1], rowHeight, 'F');
    doc.rect(104, tableStartY, columnWidths[2], rowHeight, 'F');
    doc.setTextColor(255, 255, 255);
    doc.text('No.', 20, tableStartY + 5);
    doc.text('Titulo', 63, tableStartY + 5);
    doc.text('Fecha de Entrega', 107, tableStartY + 5);
    doc.text('Completada', 165, tableStartY + 5);

    // Draw content of the table
    submissions.forEach((submission, idx) => {
      const yPosition = tableStartY + (idx + 1) * rowHeight;
      const completionStatus = submission.submission_complete ? 'Sí' : 'No';

      doc.setFillColor(tableRowColor.r, tableRowColor.g, tableRowColor.b);
      doc.rect(14, yPosition, columnWidths[0], rowHeight, 'F');
      doc.rect(44, yPosition, columnWidths[1], rowHeight, 'F');
      doc.rect(104, yPosition, columnWidths[2], rowHeight, 'F');

      // Format the delivery date
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
      doc.text((idx + 1).toString(), 6 + columnWidths[0] / 2, yPosition + 5, { align: 'center' });
      doc.text(submission.title, 54 + columnWidths[0] / 2, yPosition + 5, { align: 'center' });
      doc.text(`${formattedDate} ${formattedTime}`, 93 + columnWidths[1] / 2, yPosition + 5, { align: 'center' });
      doc.text(completionStatus, 134 + columnWidths[2] / 2, yPosition + 5, { align: 'center' });
    });

    startY = tableStartY + (submissions.length + 1) * rowHeight + 10; // Adjust Y position for next student
    studentCount++; // Increment student counter
  });

  // Footer
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text(
    `Generado por ${Usergenerate}`,
    (doc.internal.pageSize.width - doc.getTextWidth('Generado por')) / 2.2,
    280
  );

  // Save the PDF
  doc.save(`Reporte_General_Año_${selectedAño}.pdf`);
};

export default generatePDFGeneral;
