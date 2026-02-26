import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Course } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  constructor() { }

  /**
   * Export courses to PDF
   */
  exportCoursesToPDF(courses: Course[], filename: string = 'courses.pdf'): void {
    try {
      const doc = new jsPDF();
      let yPosition = 20;
      const pageHeight = doc.internal.pageSize.getHeight();
      const pageWidth = doc.internal.pageSize.getWidth();
      const marginX = 15;
      const lineHeight = 7;

      // Add title
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Course Catalog', marginX, yPosition);
      yPosition += 15;

      // Add export date
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, marginX, yPosition);
      yPosition += 10;

      // Add courses
      courses.forEach((course, index) => {
        if (yPosition > pageHeight - 30) {
          doc.addPage();
          yPosition = 20;
        }

        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(45, 87, 87);
        doc.text(`${index + 1}. ${course.name}`, marginX, yPosition);
        yPosition += 8;

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);

        const details = [
          `Level: ${course.level}`,
          `Category: ${course.category}`,
          `Instructor: ${course.instructor}`,
          `Price: $${course.price}`,
          `Duration: ${course.duration}`,
          `Lessons: ${course.lessons}`
        ];

        details.forEach(detail => {
          doc.text(detail, marginX + 5, yPosition);
          yPosition += lineHeight;
        });

        doc.setFont('helvetica', 'italic');
        const splitDescription = doc.splitTextToSize(course.description || '', pageWidth - (marginX * 2) - 5);
        doc.text(splitDescription, marginX + 5, yPosition);
        yPosition += (splitDescription.length * lineHeight) + 5;

        doc.setDrawColor(200, 200, 200);
        doc.line(marginX, yPosition, pageWidth - marginX, yPosition);
        yPosition += 5;
      });

      this.downloadPdf(doc, filename);
    } catch (error) {
      console.error('Error exporting courses PDF:', error);
      throw error;
    }
  }

  /**
   * Export a single course to PDF
   */
  exportCourseToPDF(course: Course, filename?: string): void {
    try {
      const doc = new jsPDF();
      const marginX = 15;
      let yPosition = 20;

      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(45, 87, 87);
      doc.text(course.name, marginX, yPosition);
      yPosition += 15;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);

      const details = [
        `Level: ${course.level}`,
        `Category: ${course.category}`,
        `Instructor: ${course.instructor}`,
        `Price: $${course.price}`,
        `Duration: ${course.duration}`,
        `Number of Lessons: ${course.lessons}`,
        `Generated: ${new Date().toLocaleDateString()}`
      ];

      details.forEach(detail => {
        doc.text(detail, marginX, yPosition);
        yPosition += 7;
      });

      yPosition += 5;
      doc.setDrawColor(200, 200, 200);
      doc.line(marginX, yPosition, doc.internal.pageSize.getWidth() - marginX, yPosition);
      yPosition += 10;

      doc.setFont('helvetica', 'normal');
      const splitDescription = doc.splitTextToSize(
        `Description:\n${course.description || ''}`,
        doc.internal.pageSize.getWidth() - (marginX * 2)
      );
      doc.text(splitDescription, marginX, yPosition);

      const fileName = filename || `${course.name.replace(/\s+/g, '_')}.pdf`;
      this.downloadPdf(doc, fileName);
    } catch (error) {
      console.error('Error exporting single course PDF:', error);
      throw error;
    }
  }

  /**
   * Export course catalog as HTML elements to PDF
   */
  async exportHTMLElementToPDF(elementId: string, filename: string = 'export.pdf'): Promise<void> {
    const element = document.getElementById(elementId);
    if (!element) {
      console.error('Element not found');
      return;
    }

    try {
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgWidth = 190;
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      this.downloadPdf(pdf, filename);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  }

  private downloadPdf(doc: jsPDF, filename: string): void {
    const blob = doc.output('blob');
    const blobUrl = URL.createObjectURL(blob);
    const safeName = filename.endsWith('.pdf') ? filename : `${filename}.pdf`;

    try {
      const openedWindow = window.open(blobUrl, '_blank');
      if (openedWindow) {
        setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
        return;
      }

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = safeName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Direct PDF download failed, opening in new tab:', error);
      window.open(blobUrl, '_blank');
    }

    setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
  }
}
