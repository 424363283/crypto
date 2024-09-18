import { rgbDataURL } from "@/core/utils"
import Image, { ImageProps } from "next/image"
import { FC } from "react"



export const NextImage: FC<ImageProps> = (props) => {
  return (
    <Image
      fill
      placeholder="blur"
      sizes="auto"
      blurDataURL={rgbDataURL(18, 19, 20)}
      {...props}
    />
  )
}

export default NextImage
