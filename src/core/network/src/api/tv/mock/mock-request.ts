import { sleep } from "antd-mobile/es/utils/sleep"

let count = 0

export async function mockRequest(source: any, sleepTime: number = 1000): Promise<any> {
  if (count >= 10000) {
    return
  }
  await sleep(sleepTime)
  count++
  return source
}
