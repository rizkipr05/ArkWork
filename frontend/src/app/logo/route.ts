import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'

export async function GET() {
  // ambil file dari folder src/app/Images
  const filePath = path.join(process.cwd(), 'src/app/Images/Pi7_Tool_ArkWork.png')
  const imageBuffer = await readFile(filePath)

  return new NextResponse(imageBuffer, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable'
    }
  })
}
