import { jsPDF } from "jspdf";
import { MemoryCard } from "../types";

/**
 * Loads an image URL and converts it to a base64 Data URL.
 * Includes CORS protection and timeout safety.
 */
const getBase64Image = (url: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    
    const timeout = setTimeout(() => {
      reject(new Error("Timeout loading schematic asset."));
    }, 4000);

    img.onload = () => {
      clearTimeout(timeout);
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const dataURL = canvas.toDataURL("image/jpeg", 0.75);
          resolve(dataURL);
        } else {
          reject(new Error("Canvas failure"));
        }
      } catch (err) {
        reject(err);
      }
    };
    
    img.onerror = (err) => {
      clearTimeout(timeout);
      reject(err);
    };
    
    img.src = url;
  });
};

interface ExportOptions {
  searchTerm: string;
  filterCategory: string;
  sortBy: string;
  userEmail?: string | null;
}

/**
 * Programmatic PDF compilation routine.
 */
export const exportMemoriesToPDF = async (
  memories: MemoryCard[],
  options: ExportOptions
): Promise<void> => {
  // Initialize pdf doc
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const marginX = 15;
  const contentWidth = pageWidth - (marginX * 2); // 180mm
  
  let y = 18;

  // Draw cyber banner decorator background top (Aesthetic cyber layout)
  doc.setFillColor(3, 7, 18); // deep charcoal background
  doc.rect(0, 0, pageWidth, 42, "F");
  
  // Neon cyan cyber banner line divider
  doc.setDrawColor(6, 182, 212); // #06B6D4
  doc.setLineWidth(1.2);
  doc.line(0, 42, pageWidth, 42);

  // Sub-layer line
  doc.setDrawColor(6, 182, 212);
  doc.setLineWidth(0.3);
  doc.line(0, 43.5, pageWidth, 43.5);

  // Print title headers
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(255, 255, 255);
  doc.text("JARVIS X  //  NEURAL DOCK PLATFORM", marginX, y);
  
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(6, 182, 212); // CYAN accent text
  doc.text("MEMORY SCHEMATIC CONTEXT VECTOR STORAGE REGISTER", marginX, y);

  y += 10;
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  const dateStr = new Date().toUTCString();
  doc.text(`SYSTEM REGISTRY: ONLINE  |  TIME: ${dateStr}`, marginX, y);

  // Print system metadata badge top right
  doc.setFont("courier", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(45, 212, 191); // Teal text
  doc.text("CORE MAIN_ID: ai-studio-99d4082e-639e-46a4-9823-b0b9903914ac", pageWidth - marginX - 105, 18);
  
  if (options.userEmail) {
    doc.text(`CAPTAIN AUTH: ${options.userEmail}`, pageWidth - marginX - 105, 18 + 4.5);
  } else {
    doc.text("CAPTAIN AUTH: GUEST CORRELATOR", pageWidth - marginX - 105, 18 + 4.5);
  }

  y = 52; // Move below header banner

  // Search/Filter parameters overview card
  doc.setFillColor(243, 244, 246); // Light gray background
  doc.rect(marginX, y, contentWidth, 14, "F");
  doc.setDrawColor(209, 213, 219);
  doc.setLineWidth(0.15);
  doc.rect(marginX, y, contentWidth, 14, "S");

  // Print filter stats inside the gray info box
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(31, 41, 55); // charcoal
  doc.text("EXPLOITATION PROTOCOL STATE MATRIX", marginX + 4, y + 5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(75, 85, 99);
  doc.text(
    `Scope Filter: [${options.filterCategory.toUpperCase()}]  |  Sort: [${options.sortBy.toUpperCase()}]  |  Query: "${options.searchTerm || "None"}"`,
    marginX + 4,
    y + 10
  );

  // Total indices
  doc.setFont("courier", "bold");
  doc.setFontSize(8);
  doc.setTextColor(6, 182, 212);
  doc.text(`RECORD COUNT: ${memories.length}`, pageWidth - marginX - 44, y + 8);

  y += 22; // Move below filter info bar

  // Start rendering memories
  for (let index = 0; index < memories.length; index++) {
    const mem = memories[index];
    
    // Calculate required space for this item
    // Text contents height calculation
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    const textLines = doc.splitTextToSize(mem.content, contentWidth - 8);
    const lineHeight = 4.2;
    const textHeight = textLines.length * lineHeight;
    
    let boxHeight = 12 + textHeight + 6; // base spacing + text
    
    // If has visual schematic, add height for the image box
    const hasImageSpace = !!mem.imageUrl;
    const imageDisplayHeight = 35; // 35mm
    if (hasImageSpace) {
      boxHeight += imageDisplayHeight + 4;
    }

    // Check if we need to pagination overflow!
    if (y + boxHeight > pageHeight - 20) {
      doc.addPage();
      
      // Page background footer decoration (Page numbers)
      const pageNum = doc.getNumberOfPages();
      doc.setFont("courier", "normal");
      doc.setFontSize(8);
      doc.setTextColor(156, 163, 175);
      doc.text(`- PAGE ${pageNum} -`, pageWidth / 2, pageHeight - 12, { align: "center" });

      y = 18; // reset y coordinate on the new page
    }

    // Rendering individual Synaptic Card
    // Draw card border line
    doc.setDrawColor(229, 231, 235); // Very soft gray outline
    doc.setLineWidth(0.2);
    doc.rect(marginX, y, contentWidth, boxHeight, "S");
    
    // Draw cyber accent bar on left side of card
    doc.setFillColor(6, 182, 212); // CYAN accent color
    doc.rect(marginX, y, 1.2, boxHeight, "F");

    // Header strip of card
    doc.setFillColor(249, 250, 251); // soft card header background
    doc.rect(marginX + 1.2, y, contentWidth - 1.2, 8.5, "F");
    doc.setDrawColor(243, 244, 246);
    doc.line(marginX, y + 8.5, marginX + contentWidth, y + 8.5);

    // Card title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(17, 24, 39); // darkest charcoal
    doc.text(mem.title, marginX + 4, y + 5.5);

    // Card category badge
    doc.setFont("courier", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(6, 182, 212);
    doc.text(`[${mem.category.toUpperCase()}]`, marginX + 115, y + 5.5);

    // Dynamic graphical Relevance Progress Bar
    const rel = typeof mem.relevance === "number" ? mem.relevance : 100;
    const barBlocks = Math.round(rel / 10);
    const filledBlocks = "█".repeat(barBlocks);
    const emptyBlocks = "░".repeat(10 - barBlocks);
    const meterStr = `[${filledBlocks}${emptyBlocks}] ${rel}%`;

    doc.setFont("courier", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(31, 41, 55);
    doc.text(`REL: ${meterStr}`, pageWidth - marginX - 58, y + 5.5);

    // Render image if present
    let nextY = y + 12;

    if (hasImageSpace && mem.imageUrl) {
      // Draw image visual frame card
      doc.setDrawColor(229, 231, 235);
      doc.setFillColor(3, 7, 18); // Dark canvas inside PDF!
      doc.rect(marginX + 4, nextY, 70, imageDisplayHeight, "FD"); // 70mm width, 35mm height
      
      try {
        const base64Data = await getBase64Image(mem.imageUrl);
        doc.addImage(base64Data, "JPEG", marginX + 4, nextY, 70, imageDisplayHeight);
      } catch (err) {
        // Safe, cyber fallback when CORS forbids image rendering or timeout occurs!
        doc.setDrawColor(6, 182, 212);
        doc.setLineWidth(0.1);
        doc.line(marginX + 4, nextY, marginX + 4 + 70, nextY + imageDisplayHeight);
        doc.line(marginX + 4 + 70, nextY, marginX + 4, nextY + imageDisplayHeight);

        doc.setFont("courier", "normal");
        doc.setFontSize(6.5);
        doc.setTextColor(6, 182, 212);
        doc.text("NEURAL IMAGE MAP ARCHIVED", marginX + 8, nextY + 12);
        doc.setFontSize(5.5);
        doc.setTextColor(156, 163, 175);
        doc.text("PROCEDURAL RENDER ACTIVE", marginX + 8, nextY + 18);
        doc.setFont("courier", "bold");
        doc.setFontSize(6.5);
        doc.setTextColor(107, 114, 128);
        doc.text("[CORS_SECURE_BYPASS]", marginX + 8, nextY + 28);
      }

      // Draw secondary data alongside image if image takes up half width
      doc.setFont("courier", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(107, 114, 128);
      doc.text("COGNITIVE METRIC STRUCTURAL IDENTIFIER", marginX + 80, nextY + 5);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(55, 65, 81);
      doc.text(`Synaptic Trace-ID: ${mem.id}`, marginX + 80, nextY + 10);
      doc.text(`Indexed Date: ${mem.timestamp}`, marginX + 80, nextY + 15);
      
      doc.setFont("courier", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(13, 148, 136); // Teal
      doc.text("[SCHEMATIC COMPACT ATTACHMENT REGISTERED]", marginX + 80, nextY + 25);

      nextY += imageDisplayHeight + 4;
    } else {
      // Small system timestamp details if no image
      doc.setFont("courier", "normal");
      doc.setFontSize(7);
      doc.setTextColor(156, 163, 175);
      doc.text(`SYNAPSE_ID: ${mem.id}  |  TIME: ${mem.timestamp}`, marginX + 4, nextY - 1.5);
    }

    // Text description of Memory Card
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(55, 65, 81);
    
    // Printwrapped contents
    textLines.forEach((line: string, lineIndex: number) => {
      doc.text(line, marginX + 4, nextY + (lineIndex * lineHeight));
    });

    y += boxHeight + 6; // space margin before the next card
  }

  // Draw Page Number on Final page too
  const pageNum = doc.getNumberOfPages();
  doc.setFont("courier", "normal");
  doc.setFontSize(8);
  doc.setTextColor(156, 163, 175);
  doc.text(`- PAGE ${pageNum} -`, pageWidth / 2, pageHeight - 12, { align: "center" });

  // Save the compiled PDF binary
  const cleanCategory = options.filterCategory === "all" ? "Core" : options.filterCategory;
  const fileName = `JARVIS_Memory_Schematic_${cleanCategory}.pdf`;
  doc.save(fileName);
};
