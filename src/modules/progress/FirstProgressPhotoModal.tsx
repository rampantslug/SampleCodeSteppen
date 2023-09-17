import { useQuery, gql } from "@apollo/client"
import { useNavigation } from "@react-navigation/native"
import React, { useCallback, useEffect, useMemo } from "react"
import { StatusBar } from "react-native"
import { Button, Div } from "react-native-magnus"

import Background81Svg from "assets/backgrounds/background-81.svg"
import ProgressCameraSvg from "assets/progress/camera.svg"
import { logAnalyticsEvent } from "helper/logAnalyticsEvent"
import { Page } from "theme/Page"
import { BodyHeavy, BodyLight, Heading1 } from "theme/Typography"

const GET_USER_PROGRESS_PHOTO_REMINDER_FREQUENCY = gql`
  query getCurrentUser {
    getUser {
      id
      progress_photo_reminder_frequency
    }
  }
`

export const FirstProgressPhotoModal = () => {
  const navigation = useNavigation()

  const { data } = useQuery(GET_USER_PROGRESS_PHOTO_REMINDER_FREQUENCY)
  const frequency = useMemo(() => data?.getUser?.progress_photo_reminder_frequency, [data])

  useEffect(() => {
    if (data) {
      logAnalyticsEvent("first-progress-photo-modal-show", { frequency })
    }
  }, [data, frequency])

  const doDismiss = useCallback(() => {
    logAnalyticsEvent("first-progress-photo-modal-dismiss")
    navigation.goBack()
  }, [navigation])

  return (
    <Page alignItems="center" justifyContent="center">
      <StatusBar barStyle="light-content" />

      <Background81Svg
        preserveAspectRatio="none"
        style={{ height: "100%", position: "absolute", width: "100%" }}
      />

      <ProgressCameraSvg style={{ aspectRatio: 1, width: 200 }} />

      <Div mx="baseMargin">
        <Div h={28} />

        <Heading1 color="white" textAlign="center">
          Great Work Taking Your First Progress Picture
        </Heading1>

        {!!frequency && (
          <>
            <Div h={8} />

            <BodyLight color="light2" textAlign="center">
              We'll remind you every {frequency === 1 ? "day" : `${frequency} days`} to take another
              so you can keep track of your transformation!
            </BodyLight>

            <Div h={36} />

            <BodyLight color="light2" textAlign="center">
              You can turn these off from your progress tab if you need to.
            </BodyLight>
          </>
        )}

        <Div h={28} />

        <Button alignSelf="center" bg="aqua" rounded={8} w="70%" onPress={doDismiss}>
          <BodyHeavy color="white" textAlign="center" w="100%">
            Next
          </BodyHeavy>
        </Button>
      </Div>
    </Page>
  )
}
