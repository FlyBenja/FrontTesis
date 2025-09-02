import jsPDF from 'jspdf';
import umgLogo from '../../images/Login/logo3.png';
import { getDetalleTareas } from '../../ts/Administrator/GetTaskDetails';
import { getDatosPerfil, PerfilData } from '../../ts/General/GetProfileData';

/**
 * Interface to define the structure of the "EstudianteIndiviProps" object.
 */
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

/**
 * Generates an individual PDF report for a student.
 * 
 * 
 * @returns void
 */
const generatesIndividualPDF = async (
  estudiante: EstudianteIndiviProps['estudiante'],
  selectedAño: number,
  selectedCurso: number
) => {
  const doc = new jsPDF();

  // Softer colors for background and headers
  const backgroundColor = { r: 245, g: 245, b: 245 }; // Light gray for background
  const titleColor = { r: 56, g: 112, b: 255 }; // Soft blue for titles
  const headerColor = { r: 56, g: 112, b: 255 }; // Soft blue for table headers
  const textColor = { r: 0, g: 0, b: 0 }; // Black for main text
  const tableRowColor = { r: 240, g: 240, b: 240 }; // Light gray for table rows

  // Call the API to get profile details and the campus
  let sede_id: number;
  let Usergenerate: string;

  try {
    const perfilData: PerfilData = await getDatosPerfil();
    sede_id = perfilData.sede; // Get the sede_id from the profile
    Usergenerate = perfilData.userName;
  } catch (error) {

    return;
  }

  // Call the API to get course and submission details
  const user_id = estudiante.id; // Get the user ID from the student object
  const year = selectedAño;

  const courseDetails = await getDetalleTareas(user_id, selectedCurso, sede_id, year);

  if (!courseDetails) {

    return;
  }

  const { student, formattedSubmissions } = courseDetails;

  // Set background color
  doc.setFillColor(backgroundColor.r, backgroundColor.g, backgroundColor.b);
  doc.rect(0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height, 'F');

  // Add the logo to the top-left corner
  const logoWidth = 21;
  const logoHeight = 21;
  const logoX = 10;
  const logoY = 5;
  const logoBase64 = umgLogo;
  doc.addImage(logoBase64, 'PNG', logoX, logoY, logoWidth, logoHeight);

  // Add header text in light gray
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(200, 200, 200); // Light gray
  doc.text(
    'UNIVERSIDAD MARIANO GALVEZ DE GUATEMALA (UMG)',
    (doc.internal.pageSize.width - doc.getTextWidth('UNIVERSIDAD MARIANO GALVEZ DE GUATEMALA (UMG)')) / 2,
    15
  );

  // Title of the PDF with the student's name, centered
  doc.setFontSize(22);
  doc.setTextColor(titleColor.r, titleColor.g, titleColor.b);
  const title = `Reporte de Estudiante`; // "Student Report"
  const titleWidth = doc.getTextWidth(title);
  doc.text(title, (doc.internal.pageSize.width - titleWidth) / 2, 25);

  // Separator line
  doc.setLineWidth(0.5);
  doc.setDrawColor(titleColor.r, titleColor.g, titleColor.b);
  doc.line(10, 30, doc.internal.pageSize.width - 10, 30);

  // Student and course information side by side
  const sectionWidth = (doc.internal.pageSize.width - 2 * 40) / 2;

  // Student Information (left column)
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(textColor.r, textColor.g, textColor.b);
  doc.text('Información del Estudiante', 40, 40, { align: 'center' }); // "Student Information"

  doc.setFontSize(12);
  doc.text('Nombre:', 20, 50, { align: 'center' }); // "Name"
  doc.text('Carnet:', 19, 60, { align: 'center' }); // "Student ID"
  doc.text('Email:', 18, 70, { align: 'center' }); // "Email"

  doc.setFont('helvetica', 'normal'); // Back to normal text style
  doc.text(student.name, 58.5, 50, { align: 'center' });
  doc.text(student.carnet, 40, 60, { align: 'center' });
  doc.text(student.email, 52, 70, { align: 'center' });

  // Course Information (right column)
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Información del Curso', 31 + sectionWidth + 60, 40, { align: 'center' }); // "Course Information"

  doc.setFontSize(12);
  doc.text('Curso:', 14.5 + sectionWidth + 60, 50, { align: 'center' }); // "Course"
  doc.text('Sede:', 13.5 + sectionWidth + 60, 60, { align: 'center' }); // "Campus"
  doc.text('Año:', 13 + sectionWidth + 60, 70, { align: 'center' }); // "Year"

  doc.setFont('helvetica', 'normal'); // Back to normal text style
  doc.text(student.course, 7 + sectionWidth + 100, 50, { align: 'center' });
  doc.text(student.sede, -9 + sectionWidth + 100, 60, { align: 'center' });
  doc.text(String(selectedAño), -16 + sectionWidth + 100, 70, { align: 'center' });

  // Table for delivered tasks
  const startY = 90; // Adjusted to move down fields
  doc.setFontSize(12);
  const marginLeftAdjusted = 11; // Adjusted to move left
  doc.text('Tareas Entregadas:', marginLeftAdjusted, startY); // "Delivered Tasks"

  const tableStartY = startY + 5;
  const rowHeight = 8; // Reduced row height
  const columnWidths = [30, 60, 90]; // Reduced column widths
  doc.setDrawColor(headerColor.r, headerColor.g, headerColor.b);
  doc.setLineWidth(0.5);

  // Table header, centered
  doc.setFillColor(headerColor.r, headerColor.g, headerColor.b);
  doc.rect(14, tableStartY, columnWidths[0], rowHeight, 'F'); // Column 1
  doc.rect(44, tableStartY, columnWidths[1], rowHeight, 'F'); // Column 2
  doc.rect(104, tableStartY, columnWidths[2], rowHeight, 'F'); // Column 3
  doc.setTextColor(255, 255, 255); // White for header text
  doc.text('No.', 20, tableStartY + 5); // "No."
  doc.text('Titulo', 63, tableStartY + 5); // "Title"
  doc.text('Fecha de Entrega', 107, tableStartY + 5); // "Submission Date"
  doc.text('Completada', 165, tableStartY + 5); // "Completed"

  // Draw content of the table, centered
  formattedSubmissions.forEach((submission, index) => {
    const yPosition = tableStartY + (index + 1) * rowHeight;
    const completionStatus = submission.submission_complete ? 'Sí' : 'No'; // "Yes" or "No"

    doc.setFillColor(tableRowColor.r, tableRowColor.g, tableRowColor.b);
    doc.rect(14, yPosition, columnWidths[0], rowHeight, 'F'); // Column 1
    doc.rect(44, yPosition, columnWidths[1], rowHeight, 'F'); // Column 2
    doc.rect(104, yPosition, columnWidths[2], rowHeight, 'F'); // Column 3

    // Format submission date
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
    doc.text((index + 1).toString(), 6 + columnWidths[0] / 2, yPosition + 5, { align: 'center' }); // Corrected
    doc.text(submission.title, 54 + columnWidths[0] / 2, yPosition + 5, { align: 'center' });
    doc.text(`${formattedDate} ${formattedTime}`, 93 + columnWidths[1] / 2, yPosition + 5, { align: 'center' });
    doc.text(completionStatus, 134 + columnWidths[2] / 2, yPosition + 5, { align: 'center' });
  });

  // Footer
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150); // Gray for footer
  doc.text(
    `Generado por ${Usergenerate}`, // "Generated by"
    (doc.internal.pageSize.width - doc.getTextWidth('Generado por')) / 2.2,
    280
  );

  // Save the PDF
  doc.save(`Reporte_${student.name}.pdf`); // "Report for"
};

export default generatesIndividualPDF;
