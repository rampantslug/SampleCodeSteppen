import { gql, useQuery } from "@apollo/client"
import { useFocusEffect } from "@react-navigation/native"
import React, { useCallback, useMemo } from "react"
import { Div, Icon } from "react-native-magnus"
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import PersonalGoalWithBackgroundSvg from "assets/onboarding/personal-goal-with-background.svg"
import { useOnboardingProgress } from "modules/onboarding/useOnboardingProgress"
import { BigMain, Body, BodyHeavy, Heading1, Heading3 } from "theme/Typography"

const GET_CURRENT_USER = gql`
  query getUser {
    getUser {
      id
      fullname
    }
  }
`

export const OnboardingBuildHabitBreakerScreen = () => {
  const insets = useSafeAreaInsets()

  const { gotoNextRoute, updateOnboardingProgress } = useOnboardingProgress("build-habit-breaker")

  const { data: userResponseData } = useQuery(GET_CURRENT_USER, {
    fetchPolicy: "network-only",
  })
  const userName = useMemo(() => userResponseData?.getUser?.fullname || "", [userResponseData])

  const navToNext = useCallback(async () => {
    updateOnboardingProgress()
    gotoNextRoute()
  }, [gotoNextRoute, updateOnboardingProgress])

  const text1Opacity = useSharedValue(0)
  const text2Opacity = useSharedValue(0)
  const text3Opacity = useSharedValue(0)

  const text1OpacityStyle = useAnimatedStyle(
    () => ({
      opacity: text1Opacity.value,
    }),
    [text1Opacity],
  )

  const text2OpacityStyle = useAnimatedStyle(
    () => ({
      opacity: text2Opacity.value,
    }),
    [text2Opacity],
  )

  const text3OpacityStyle = useAnimatedStyle(
    () => ({
      opacity: text3Opacity.value,
    }),
    [text3Opacity],
  )

  const runAnimations = useCallback(() => {
    const timeout1 = setTimeout(() => {
      text1Opacity.value = withTiming(1, { duration: 1000 })
    }, 500)

    const timeout2 = setTimeout(() => {
      text2Opacity.value = withTiming(1, { duration: 1000 })
    }, 1500)

    const timeout3 = setTimeout(() => {
      text3Opacity.value = withTiming(1, { duration: 1000 })
    }, 2500)

    const timeout4 = setTimeout(() => {
      navToNext()
    }, 5500)

    return () => {
      clearTimeout(timeout1)
      clearTimeout(timeout2)
      clearTimeout(timeout3)
      clearTimeout(timeout4)
    }
  }, [navToNext, text1Opacity, text2Opacity, text3Opacity])

  useFocusEffect(() => runAnimations())

  return (
    <Div flex={1}>
      <PersonalGoalWithBackgroundSvg
        style={{ aspectRatio: 375 / 812, alignSelf: "center", position: "absolute" }}
        width="100%"
      />

      <Div h={insets.top} />

      <Div h={8} />

      <Animated.View style={text1OpacityStyle}>
        <BigMain color="light" px={32} textAlign="center">
          {userName}
        </BigMain>
      </Animated.View>

      <Div h={16} />

      <Animated.View style={text2OpacityStyle}>
        <Heading1 color="light" px={16} textAlign="center">
          It's time to start building your epic long lasting fitness habit
        </Heading1>
      </Animated.View>

      <Div h={36} />

      <Animated.View style={text3OpacityStyle}>
        <Body color="light" px={32} textAlign="center">
          We are going to help keep you
        </Body>
        <Div alignItems="flex-start" alignSelf="center" my={8}>
          <Div row my={4}>
            <Icon color="aqua100" fontFamily="FontAwesome" fontSize={24} name="check" />
            <Heading3 color="light" ml={8}>
              motivated
            </Heading3>
          </Div>
          <Div row my={4}>
            <Icon color="aqua100" fontFamily="FontAwesome" fontSize={24} name="check" />
            <Heading3 color="light" ml={8}>
              consistent
            </Heading3>
          </Div>
          <Div row my={4}>
            <Icon color="aqua100" fontFamily="FontAwesome" fontSize={24} name="check" />
            <Heading3 color="light" ml={8}>
              accountable
            </Heading3>
          </Div>
        </Div>

        <Div h={10} />

        <Body color="light" px={32} textAlign="center">
          You will feel and look <BodyHeavy color="aqua100">awesome</BodyHeavy> in no time!
        </Body>
      </Animated.View>
    </Div>
  )
}
