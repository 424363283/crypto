
export const ACTIVATED_EVENT = 'onActivatedEvent'
export const DEACTIVATED_EVENT = 'onDeactivatedEvent'

export const getUniqueId = () => `Xter_${new Date().getTime()}`;

export const getScrollElement = () => {
  return global.document.scrollingElement || global.document.documentElement || global.document.body
}

export const get = (obj: typeof globalThis | HTMLElement, key: string) => {
  return key.split('.').reduce((res, k) => (res as any)?.[k], obj)
}

export const getScrollableNode = () => {
  return [get(global, 'document.scrollingElement')]
  // return [getScrollElement()]
}

export const saveScrollPosition = (nodes: HTMLElement[]) => {
  const saver: [HTMLElement, {x: number; y:number}][] = nodes.map(node=> [node, {x: node.scrollLeft, y: node.scrollTop}])
  return () => {
    saver.map(([node, {x,y}])=> {
      node.scrollLeft = x
      node.scrollTop = y
    })
  }
}
