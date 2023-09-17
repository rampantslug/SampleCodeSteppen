import * as React from "react"

export const navigationRef: any = React.createRef()

export function navigation() {
  return navigationRef.current
}
