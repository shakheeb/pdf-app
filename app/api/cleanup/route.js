import { NextResponse } from "next/server";

import { readdir, unlink } from "fs/promises";
import { join, resolve } from "path";

export async function DELETE() {
  try {
    const tmpDir = join(process.cwd(), "files", "tmp");
    const tmpFiles = await readdir(tmpDir);

    // Delete each file in 'files/tmp' directory
    for (const file of tmpFiles) {
      await unlink(join(tmpDir, file));
    }

    return NextResponse.json({ status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
