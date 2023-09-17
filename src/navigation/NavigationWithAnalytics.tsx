import { NavigationContainer } from "@react-navigation/native"
import React, { useCallback, useRef } from "react"

import { logAnalyticsEvent } from "helper/logAnalyticsEvent"
import { logError } from "helper/logError"
import { navigationRef } from "navigation/rootNavigation"

export const NavigationWithAnalytics = (props) => {
  const routeNameRef = useRef()

  const onReady = useCallback(() => {
    routeNameRef.current = navigationRef.current.getCurrentRoute().name
  }, [])

  const maybeLogRouteChange = useCallback(() => {
    const previousRouteName = routeNameRef.current
    const currentRoute = navigationRef.current.getCurrentRoute()

    if (previousRouteName !== currentRoute.name) {
      const paramsToTrack = {
        ...currentRoute.params,
      }

      // Avoid logging all the items.
      if (paramsToTrack.items?.length > 0) {
        paramsToTrack.items = paramsToTrack.items.length
      }

      logAnalyticsEvent(`view-${currentRoute.name}`, {
        ...paramsToTrack,
      })
    }

    routeNameRef.current = currentRoute.name
  }, [])

  const onStateChange = useCallback(() => {
    maybeLogRouteChange()
  }, [maybeLogRouteChange])

  const onUnhandledAction = useCallback(({ payload }) => {
    logError(`Route not found '${payload?.name}'`, { payload })
  }, [])

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={onReady}
      onStateChange={onStateChange}
      onUnhandledAction={onUnhandledAction}
    >
      {props.children}
    </NavigationContainer>
  )
}
