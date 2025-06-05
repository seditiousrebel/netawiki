import { clsx, type ClassValue } from "clsx"
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function exportElementAsPDF(
  elementId: string,
  fileName: string,
  setIsGenerating?: (isGenerating: boolean) => void
): Promise<void> {
  if (setIsGenerating) setIsGenerating(true);
  const inputElement = document.getElementById(elementId);

  if (!inputElement) {
    console.error(`Element with id "${elementId}" not found.`);
    if (setIsGenerating) setIsGenerating(false);
    return;
  }

  try {
    const canvas = await html2canvas(inputElement, {
      scale: 2, // Higher scale for better quality
      useCORS: true, // If you have external images
      logging: true,
    });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'p', // portrait
      unit: 'px', // points, pixels, inches, mm, cm
      format: [canvas.width, canvas.height], // use canvas dimensions
    });
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(fileName);
  } catch (error) {
    console.error('Error generating PDF:', error);
    // Handle error appropriately in your UI, e.g., show a toast notification
  } finally {
    if (setIsGenerating) setIsGenerating(false);
  }
}
