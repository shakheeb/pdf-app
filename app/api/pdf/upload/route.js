import { NextResponse } from "next/server";
import { writeFile, readdir, unlink, mkdir, stat } from "fs/promises";
import { join } from "path";

export async function POST(req, res) {
  try {
    // extracts contents from request
    const data = await req.formData();
    const file = data.get("file");
    const userId = data.get("userId");
    console.log("userid: ", userId);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes); // creates buffer
    const filename = file.name;
    let dir;
    if (userId == "undefined") {
      dir = join(process.cwd(), "files", "tmp");
    } else {
      dir = join(process.cwd(), "files", String(userId));
    }

    const path = join(dir, filename);
    try {
      await mkdir(dir, { recursive: true });
    } catch (err) {
      console.error("Error creating 'tmp' directory:", err);
      throw err;
    }
    const files = await readdir(dir);

    if (userId == "undefined") {
      for (const file of files) {
        await unlink(join(dir, file));
        console.log(`Deleted file: ${file}`);
      }
    }

    // If the user ID is defined, limit the number of files to 5
    if (userId !== "undefined") {
      const files = await readdir(dir);
      if (files.length >= 5) {
        // Sort files by creation time in ascending order
        files.sort(async (fileA, fileB) => {
          const statsA = await stat(join(dir, fileA));
          const statsB = await stat(join(dir, fileB));
          return statsA.birthtime - statsB.birthtime;
        });

        // Delete the oldest file
        await unlink(join(dir, files[0]));
        console.log(`Deleted oldest file: ${files[0]}`);
      }
    }

    await writeFile(path, buffer);
    return NextResponse.json({ status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
