import { NextResponse } from "next/server";
import { extname, join } from "path";
import { readdirSync, statSync } from "fs";
export async function GET(req) {
  try {
    // accessing search parameters from request
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    const viewFiles = url.searchParams.get("viewFiles");
    let dir, pdfFiles;

    if (userId == "undefined") {
      // reads tmp folder

      dir = join(process.cwd(), "files", "tmp");
      pdfFiles = readdirSync(dir);
    } else {
      // reads user's folder
      dir = join(process.cwd(), "files", userId);
      pdfFiles = readdirSync(dir);
      pdfFiles.sort((a, b) => {
        //sorts file list in time modified order
        const statsA = statSync(join(dir, a));
        const statsB = statSync(join(dir, b));
        return statsB.mtime.getTime() - statsA.mtime.getTime();
      });
      if (viewFiles == "allfiles") {
        // if request is view files sends entire
        //  list of files saved in user's folder
        return new Response(JSON.stringify(pdfFiles), { status: 201 });
      }
      pdfFiles = pdfFiles.slice(0, 1); // selects the last modified file
    }
    pdfFiles = pdfFiles.filter((file) => extname(file) === ".pdf");
    // sends file name
    return new Response(JSON.stringify(pdfFiles), { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.status(500);
  }
}
