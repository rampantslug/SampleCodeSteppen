import { useNavigation } from "@react-navigation/native"
import React, { memo, useCallback } from "react"
import { Button, Div } from "react-native-magnus"

import Mood from "./components/Mood"
import ProgressFooter from "assets/progress/progress-footer.svg"
import { logAnalyticsEvent } from "helper/logAnalyticsEvent"
import ProgressPictures from "modules/progress/components/ProgressPictures"
import SweatySelfies from "modules/progress/components/SweatySelfies"
import { ProgressEvents } from "modules/progress/progressEvents"
import { screenLibrary } from "navigation/screenLibrary"
import { SmallHighlight } from "theme/Typography"

const ProgressPage = () => {
  const { navigate } = useNavigation()

  const viewStatistics = useCallback(
    (event: ProgressEvents) => () => {
      logAnalyticsEvent(event)
      navigate(screenLibrary.tabProgress.myActivity)
    },
    [navigate],
  )

  return (
    <Div bg="light" flex={1}>
      <ProgressPictures />

      <SweatySelfies />

      <Mood />

      <ProgressFooter style={{ aspectRatio: 375 / 163, width: "100%" }} />

      <Button
        alignSelf="center"
        bg="aqua"
        h={40}
        my="doubleMargin"
        p={0}
        rounded={8}
        w={180}
        onPress={viewStatistics(ProgressEvents.VIEW_ACTIVITY_FROM_PROGRESS_TAB_BOTTOM_BUTTON)}
      >
        <SmallHighlight color="light">See all activities</SmallHighlight>
      </Button>
    </Div>
  )
}

export default memo(ProgressPage)
