import React, { memo, useEffect, useRef } from "react"
import Player, { IPlayerOptions } from "xgplayer"
import HlsJsPlugin from "xgplayer-hls"
import FlvJsPlugin from "xgplayer-flv"

type TypeVideo = "mp4" | "m3u8" | "flv" | "other"
const MapVideoType = new Map<TypeVideo, unknown>()
  .set("mp4", [])
  .set("other", [])
  .set("flv", [FlvJsPlugin])
  .set("m3u8", [HlsJsPlugin])

interface Props {
  /** 视频播放类型 */
  videoType?: TypeVideo
  className?: string
  config: IPlayerOptions
  format?: string
  style?: React.CSSProperties
  playerInit?: (palyer: Player) => void
  readyHandle?: () => void
  completeHandle?: () => void
  destroyHandle?: () => void
}

const XgPlayer = (props: Props) => {
  const {
    playerInit,
    readyHandle,
    completeHandle,
    destroyHandle,
    style,
    config,
    className,
    videoType = "mp4",
  } = props

  const playerRef = useRef<HTMLDivElement | null>(null)

  const xgPlayerRef = useRef<Player | null>(null)

  const init = (playerConfig: IPlayerOptions) => {
    if (props.config.url && props.config.url !== "") {
      xgPlayerRef.current = new Player(playerConfig) || {}
      xgPlayerRef.current.once("ready", () => {
        readyHandle && readyHandle()
      })
      xgPlayerRef.current.once("complete", () => {
        completeHandle && completeHandle()
      })
      xgPlayerRef.current.once("destroy", () => {
        destroyHandle && destroyHandle()
      })
      playerInit && playerInit(xgPlayerRef.current)
    }
  }

  const getPlayer = () => {
    if (playerRef.current) {
      init({
        el: playerRef.current,
        plugins: MapVideoType.get(videoType)! as unknown[],
        ...config,
      })
    }
  }

  useEffect(() => {
    getPlayer()
  }, [JSON.stringify(config)])

  return (
    <div
      className={className}
      ref={(ele) => {
        playerRef.current = ele
      }}
      style={style}
    />
  )
}

export default memo(XgPlayer)
