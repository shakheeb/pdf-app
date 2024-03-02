import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";

export async function GET(req, res) {
  const fileName = res.params.fileName; // Extract the file name from the request parameters
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId"); // geting user id from search parameters
  let dir;

  // Determine the directory based on the userId
  if (userId == "undefined") {
    dir = join(process.cwd(), "files", "tmp");
  } else {
    dir = join(process.cwd(), "files", userId);
  }

  const filePath = join(dir, fileName);

  try {
    if (existsSync(filePath)) {
      const buffer = await readFile(filePath);
      return new Response(buffer); // Return the file content as a response
    } else {
      NextResponse.status(404); // error
    }
  } catch (error) {
    console.error(error);
    NextResponse.status(500); // Set response status to 500 in case of an error
  }
}
