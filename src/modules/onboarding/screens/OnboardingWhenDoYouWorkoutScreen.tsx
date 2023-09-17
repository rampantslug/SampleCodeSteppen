import { gql, useMutation } from "@apollo/client"
import React, { useCallback, useState } from "react"
import { Button, Div, Icon, WINDOW_HEIGHT, WINDOW_WIDTH } from "react-native-magnus"
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import HouseOverCurvedBottomSvg from "assets/onboarding/house-over-curved-bottom.svg"
import MoonSvg from "assets/onboarding/moon.svg"
import SunSvg from "assets/onboarding/sun.svg"
import { logAnalyticsEvent } from "helper/logAnalyticsEvent"
import { useOnboardingProgress } from "modules/onboarding/useOnboardingProgress"
import { Page } from "theme/Page"
import { BigMain, BodyHeavy, Heading1, ParagraphLight } from "theme/Typography"

const SET_WORKOUT_PREFERENCES = gql`
  mutation setUserWorkoutPreferences($input: WorkoutPreferencesInput!) {
    setUserWorkoutPreferences(input: $input) {
      success
      user {
        id
        workout_preferences {
          id
          frequency
          endGoal
          types
          locations
          experience
          timeOfDay
        }
      }
    }
  }
`

const timePeriods = [
  {
    label: "Morning",
    background: "#93C4FF",
    icon: <SunSvg style={{ aspectRatio: 1, width: 24 }} />,
    panelAngle: 35,
  },
  {
    label: "Afternoon",
    background: "#016D77",
    icon: <SunSvg style={{ aspectRatio: 1, width: 24 }} />,
    panelAngle: 55,
  },
  {
    label: "Night",
    background: "#333333",
    icon: <MoonSvg style={{ aspectRatio: 1, width: 24 }} />,
    panelAngle: 125,
  },
]

const panelWidth = WINDOW_WIDTH * 2
const panelLeft = WINDOW_WIDTH / 2
const panelTop = WINDOW_HEIGHT * 0.7

export const OnboardingWhenDoYouWorkoutScreen = () => {
  const { gotoNextRoute, updateOnboardingProgress } = useOnboardingProgress("when-do-you-workout")

  const [selectedTimePeriod, setSelectedTimePeriod] = useState(timePeriods[0])

  const [setWorkoutPreferences] = useMutation(SET_WORKOUT_PREFERENCES, {
    refetchQueries: ["discoveryPreferences"],
  })

  const navToNext = useCallback(async () => {
    setWorkoutPreferences({
      variables: {
        input: {
          timeOfDay: selectedTimePeriod.label,
        },
      },
    })

    logAnalyticsEvent("onboarding-workout-preference-time-of-day", {
      timeOfDay: selectedTimePeriod.label,
    })

    updateOnboardingProgress()
    gotoNextRoute()
  }, [gotoNextRoute, selectedTimePeriod, setWorkoutPreferences, updateOnboardingProgress])

  const insets = useSafeAreaInsets()

  const sunMoonX = useSharedValue(-panelLeft)
  const sunMoonY = useSharedValue(panelTop)
  const sunMoonRotate = useSharedValue(timePeriods[0].panelAngle)

  const sunMoonStyle = useAnimatedStyle(
    () => ({
      position: "absolute",
      transform: [
        { translateY: sunMoonY.value },
        { translateX: sunMoonX.value },
        { rotate: sunMoonRotate.value.toString() + "deg" },
      ],
    }),
    [sunMoonX, sunMoonY],
  )

  const pickTimePeriod = useCallback(
    (item) => {
      sunMoonRotate.value = withTiming(item.panelAngle, { duration: 1000 })

      const timeout1 = setTimeout(() => {
        setSelectedTimePeriod(item)
      }, 0)

      return () => {
        clearTimeout(timeout1)
      }
    },
    [sunMoonRotate],
  )

  return (
    <Page bg={selectedTimePeriod.background} pt={(insets.top || 20) + 10}>
      <Icon color="light" fontFamily="Feather" fontSize={24} name="clock" />

      <Div h={16} />

      <Heading1 color="light" mx={24} textAlign="center">
        When do you like to exercise?
      </Heading1>

      <Div h={16} />

      <ParagraphLight color="light" mx={24} textAlign="center">
        We'll boost your energy when you're most likely to work out and help you form a kickass
        exercise habit!
      </ParagraphLight>

      <Div h={32} />

      <BigMain color="light" textAlign="center">
        {selectedTimePeriod.label}
      </BigMain>

      <HouseOverCurvedBottomSvg
        preserveAspectRatio="none"
        style={{ aspectRatio: 375 / 419, width: "100%", position: "absolute", top: "60%" }}
      />

      <Animated.View style={sunMoonStyle}>
        <Div h={panelWidth} justifyContent="space-between" w={panelWidth}>
          <SunSvg style={{ aspectRatio: 1, width: 32 }} />
          <MoonSvg style={{ aspectRatio: 1, width: 32 }} />
        </Div>
      </Animated.View>

      <Div flex={1} minH={16} />
      <Div alignItems="center" alignSelf="stretch" pb={insets.bottom || 16} pt={10} px={30}>
        <Div row>
          {timePeriods.map((item, index) => (
            <Button
              key={index.toString()}
              bg={item === selectedTimePeriod ? "aqua" : "transparent"}
              borderColor={item === selectedTimePeriod ? "aqua" : "light"}
              borderWidth={1}
              color="light"
              mx={6}
              px={20}
              rounded={8}
              onPress={() => pickTimePeriod(item)}
            >
              {item.label}
            </Button>
          ))}
        </Div>

        <Div flex={1} minH={32} />
        <Button
          alignSelf="stretch"
          bg="aqua"
          mb={16}
          minH={56}
          py={16}
          rounded={8}
          onPress={navToNext}
        >
          <BodyHeavy color="light">Sounds Good!</BodyHeavy>
        </Button>
      </Div>
    </Page>
  )
}
