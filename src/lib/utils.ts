import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Exports a specific HTML element to a PDF file.
 * @param elementId The ID of the HTML element to export.
 * @param fileName The desired name for the output PDF file (e.g., "profile.pdf").
 * @param setIsLoading Optional callback to set a loading state (e.g., for button text/disabled state).
 */
export const exportElementAsPDF = async (
  elementId: string,
  fileName: string,
  setIsLoading?: (isLoading: boolean) => void
): Promise<void> => {
  if (setIsLoading) setIsLoading(true);

  const elementToExport = document.getElementById(elementId);

  if (!elementToExport) {
    alert(`Element with ID "${elementId}" not found for PDF export.`);
    if (setIsLoading) setIsLoading(false);
    return;
  }

  try {
    const canvas = await html2canvas(elementToExport, {
      scale: 2, // Higher scale for better quality
      useCORS: true, // For images from other domains, if any
      logging: false, // Disable html2canvas logging in console unless needed for debugging
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Calculate the aspect ratio
    const aspectRatio = canvasWidth / canvasHeight;
    let newCanvasWidth = pdfWidth;
    let newCanvasHeight = newCanvasWidth / aspectRatio;

    // If the new height exceeds the PDF height, scale based on height instead
    if (newCanvasHeight > pdfHeight) {
      newCanvasHeight = pdfHeight;
      newCanvasWidth = newCanvasHeight * aspectRatio;
    }

    // Center the image on the PDF page (optional)
    const xOffset = (pdfWidth - newCanvasWidth) / 2;
    const yOffset = 0; // Or (pdfHeight - newCanvasHeight) / 2 for vertical centering

    pdf.addImage(imgData, 'PNG', xOffset, yOffset, newCanvasWidth, newCanvasHeight);
    pdf.save(fileName);

  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('An error occurred while generating the PDF. Check the console for details.');
  } finally {
    if (setIsLoading) setIsLoading(false);
  }
};
