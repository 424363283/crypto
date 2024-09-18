"use client"
import { DotLoading, PullToRefresh as AntPullToRefresh, InfiniteScroll } from "antd-mobile"
import { memo } from "react"
import Image from "next/image"
import classNames from "classnames"
import { attachPropertiesToComponent } from "@/core/utils/src/attachPropertiesToComponent"

interface PullToRefreshProps {
  children?: React.ReactNode
  showInfiniteScroll?: boolean
  hasMore?: boolean
  loadMore?: (isRetry: boolean) => Promise<void>
  onRefresh?: () => Promise<unknown>
}
const PullToRefresh = (props: PullToRefreshProps) => {
  const { showInfiniteScroll = true, onRefresh, children, hasMore = false, loadMore } = props
  return (
    <AntPullToRefresh
      refreshingText={<PullToRefreshText.RefreshingText />}
      completeText="刷新完成"
      pullingText={<PullToRefreshText.PullingText />}
      canReleaseText={<PullToRefreshText.PullingText title="释放立即刷新" />}
      headHeight={50}
      onRefresh={onRefresh}>
      {children}
      {showInfiniteScroll && (
        <InfiniteScroll loadMore={loadMore!} hasMore={hasMore}>
          <PullToRefreshText.InfiniteScrollContent hasMore={hasMore} />
        </InfiniteScroll>
      )}
    </AntPullToRefresh>
  )
}

const RefreshingText = (props: {
  className?: string
  title?: string
  color?: string
  textClassName?: string
}) => {
  const { className, title = "正在加载", color = "#969799", textClassName } = props
  return (
    <div className={classNames("flex", className)}>
      <DotLoading color={color} />
      <span className={classNames("text-[#969799] text-[12px]", textClassName)}>{title}</span>
    </div>
  )
}

interface Props {
  title?: string
}

const PullingText = (props: Props) => {
  const { title = "下拉可以刷新" } = props

  return (
    <div className=" flex items-center gap-[5px]">
      <Image
        src="/static/images/tv/home/spin.png"
        width={12}
        height={12}
        alt=""
        className={classNames("w-[12px] h-[12px]", { "animate-spin": true })}
      />
      <span className="text-[#969799] text-[12px]">{title}</span>
    </div>
  )
}

const InfiniteScrollContent = (props: { hasMore: boolean }) => {
  const { hasMore } = props
  if (hasMore) return <PullingText title="正在加载..." />
  return <span className="text-[#969799] text-[12px]">--- 我是有底线的 ---</span>
}

const PullToRefreshText = {
  RefreshingText: memo(RefreshingText),
  PullingText: memo(PullingText),
  InfiniteScrollContent: memo(InfiniteScrollContent),
}
export default attachPropertiesToComponent(PullToRefresh, {
  RefreshingText: memo(RefreshingText),
  PullingText: memo(PullingText),
  InfiniteScrollContent: memo(InfiniteScrollContent),
})

// export default PullToRefreshText
