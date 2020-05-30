import { Server } from '../models/server.ts'

export const fetchData = async (DB_PATH: string): Promise<Array<any>> => {
  try {
    const data = await Deno.readFile(DB_PATH)
    const decoder = new TextDecoder()
    return JSON.parse(decoder.decode(data))
  } catch (error) {
    return []
  }
}

export const persistData = async (DB_PATH: string, data: Array<any>) => {
  const textEncoder = new TextEncoder()
  await Deno.writeFile(DB_PATH, textEncoder.encode(JSON.stringify(data)))
}