import { readFileSync, existsSync } from "fs";
import { NextResponse } from "next/server";
import { join } from "path";
import { PDFDocument } from "pdf-lib";

export async function POST(req, res) {
  try {
    // Parse the request body
    const body = await req.json();
    const selectedPages = body.selectedPages;
    const originalPDF = body.originalPDF;
    const userId = body.userId;

    // Check if required parameters are present
    if (!selectedPages || !originalPDF) {
      throw new Error("Missing selectedPages or originalPDF");
    }

    let dir;
    // Determine directory based on user ID
    if (!userId) {
      dir = join(process.cwd(), "files", "tmp");
    } else {
      dir = join(process.cwd(), "files", String(userId));
    }

    // Construct file path to the original PDF
    const filePath = join(dir, originalPDF[0]);

    // Check if the original PDF exists
    if (!existsSync(filePath)) {
      throw new Error("Original PDF not found");
    }

    // Load the original PDF document
    const pdfSrcDoc = await PDFDocument.load(readFileSync(filePath));

    // Create a new PDF document
    const pdfNewDoc = await PDFDocument.create();

    // Map selected page numbers to page indices (0-based)
    const selectedPagesArray = selectedPages.map((i) => i - 1);

    // Copy selected pages from the original PDF to the new document
    const pages = await pdfNewDoc.copyPages(pdfSrcDoc, selectedPagesArray);
    pages.forEach((page) => pdfNewDoc.addPage(page));

    // Set response headers for PDF download
    const headers = new Headers();
    const pdfBytes = await pdfNewDoc.save();
    headers.append(
      "Content-Disposition",
      'attachment; filename="${originalPDF[0]}"'
    );
    headers.append("Content-Type", "application/pdf");

    // Return the PDF bytes as the response
    return new Response(pdfBytes, { headers });
  } catch (error) {
    console.log(error);
    // Respond with a server error if an exception occurs
    NextResponse.json({ status: 500 });
  }
}
