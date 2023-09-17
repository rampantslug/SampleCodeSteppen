import { gql, useMutation, useQuery } from "@apollo/client"
import { DateTime } from "luxon"
import React, { useCallback, useMemo, useState } from "react"
import { Linking } from "react-native"
import { Button, Div, Toggle } from "react-native-magnus"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import NotificationsSvg from "assets/onboarding/notifications.svg"
import { snackbarRef } from "helper/globalSnackbarRef"
import { logAnalyticsEvent } from "helper/logAnalyticsEvent"
import { logException } from "helper/logError"
import { requestAndAddNotifications } from "modules/notifications/requestAndAddNotifications"
import { useOnboardingProgress } from "modules/onboarding/useOnboardingProgress"
import { Body, Heading1, Heading3, ParagraphLight } from "theme/Typography"

const GET_USER_MOBILE_DEVICE = gql`
  query getUserMobileDevice($id: String!) {
    getUserMobileDevice(id: $id) {
      hasRefusedPush
    }
  }
`

const UPSERT_ACTIVITY = gql`
  mutation addDayActivity(
    $activityType: String!
    $day: String!
    $isPlanned: Boolean
    $time: String!
    $data: UserDailyActivityDataInput!
  ) {
    addDayActivity(
      activityType: $activityType
      day: $day
      isPlanned: $isPlanned
      time: $time
      data: $data
    ) {
      success
    }
  }
`

export const OnboardingNotificationsScreen = () => {
  const insets = useSafeAreaInsets()

  const { gotoNextRoute, updateOnboardingProgress } = useOnboardingProgress("notifications")

  const [upsertActivity] = useMutation(UPSERT_ACTIVITY, {
    refetchQueries: ["journeyActivityData", "userDayActivities", "journeyStreak"],
  })

  const { data: userMobileDeviceData } = useQuery(GET_USER_MOBILE_DEVICE, {
    variables: {
      id: global.currentUserMobileDeviceId,
    },
  })
  const userMobileDevice = useMemo(
    () => userMobileDeviceData?.getUserMobileDevice,
    [userMobileDeviceData],
  )

  const [isReminderOn, setIsReminderOn] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const navToNext = useCallback(async () => {
    setIsLoading(true)

    try {
      const now = DateTime.now()
      await upsertActivity({
        variables: {
          activityType: "first-day",
          day: now.toSQLDate(),
          data: {
            description: JSON.stringify({ message: "You started with Steppen!" }),
          },
          isPlanned: false,
          time: now.toSQLTime(),
        },
      })

      if (isReminderOn) {
        if (userMobileDevice?.hasRefusedPush) {
          await Linking.openSettings()
        } else {
          await requestAndAddNotifications()
        }
      }
      logAnalyticsEvent("onboarding-allow-notifications", { notificationsAllowed: isReminderOn })

      updateOnboardingProgress()
      gotoNextRoute()
    } catch (error) {
      setIsLoading(false)
      logException(error, { description: "Error encountered in OnboardingNotificationsScreen." })
      snackbarRef?.current?.show("Server encountered an error!", {
        duration: 2000,
        bg: "errorRed",
      })
    }
  }, [gotoNextRoute, isReminderOn, updateOnboardingProgress, upsertActivity, userMobileDevice])

  return (
    <Div alignItems="center" bg="steppenBlue10" flex={1} pt={insets.top} px={16}>
      <Div h={24} />

      <Heading1 color="dark2" textAlign="center">
        One Last Step!
      </Heading1>
      <Div h={24} />

      <NotificationsSvg style={{ aspectRatio: 225 / 224, width: "60%" }} />

      <Div flex={1} minH={24} />

      <Heading3 color="steppenDarkNavy" mx={24} textAlign="center">
        You're <Heading3 color="steppenPurple">96%</Heading3> more likely to stay motivated &
        consistent when reminded!
      </Heading3>
      <ParagraphLight color="dark3" mx={24} my={8} textAlign="center">
        We'll remind you to do your workout so you don't forget and you can turn these off at any
        time.
      </ParagraphLight>

      <Div flex={1} minH={24} />

      <Div row alignItems="center" justifyContent="center">
        <Body color="dark2">Remind Me</Body>
        <Div w={24} />
        <Toggle
          activeBg="aqua100"
          bg="gray200"
          circleBg="aqua80"
          flex={0}
          h={39}
          on={isReminderOn}
          w={72}
          onPress={() => setIsReminderOn(!isReminderOn)}
        />
      </Div>

      <Div flex={1} minH={24} />

      <Div pb={insets.bottom + 20} pt={16} w="100%">
        <Button
          alignSelf="center"
          bg="aqua"
          color="light"
          disabled={isLoading}
          fontSize={14}
          fontWeight="700"
          minH={56}
          rounded={8}
          w="80%"
          onPress={navToNext}
        >
          Let's Explore Steppen!
        </Button>
      </Div>
    </Div>
  )
}
