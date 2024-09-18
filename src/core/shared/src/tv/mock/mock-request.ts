import { sleep } from "antd-mobile/es/utils/sleep"

let count = 0

export async function mockRequest<T = any>(source: T[], sleepTime: number = 1000): Promise<T[]> {
  if (count >= 10000) {
    return []
  }
  await sleep(sleepTime)
  count++
  return source
}
