import { useFocusEffect } from "@react-navigation/native"
import Lottie from "lottie-react-native"
import React, { useCallback } from "react"
import { Div, WINDOW_HEIGHT, WINDOW_WIDTH } from "react-native-magnus"
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"

import { useOnboardingProgress } from "modules/onboarding/useOnboardingProgress"
import { Body, Heading1 } from "theme/Typography"

export const OnboardingFirstStepCompleteScreen = () => {
  const { gotoNextRoute, updateOnboardingProgress } = useOnboardingProgress("first-step-complete")

  const navToNext = useCallback(async () => {
    updateOnboardingProgress()
    gotoNextRoute()
  }, [gotoNextRoute, updateOnboardingProgress])

  const panel2Margin = useSharedValue(WINDOW_WIDTH)

  const panel2MarginStyle = useAnimatedStyle(
    () => ({
      marginLeft: panel2Margin.value,
      position: "absolute",
      height: WINDOW_HEIGHT,
    }),
    [panel2Margin],
  )

  const runAnimations = useCallback(() => {
    const timeout1 = setTimeout(() => {
      panel2Margin.value = withTiming(0, { duration: 500 })
    }, 3000)

    const timeout4 = setTimeout(() => {
      navToNext()
    }, 5500)

    return () => {
      clearTimeout(timeout1)
      clearTimeout(timeout4)
    }
  }, [navToNext, panel2Margin])

  useFocusEffect(() => runAnimations())

  return (
    <>
      <Div alignItems="center" bg="steppenPurple10" flex={1} justifyContent="center">
        <Lottie
          autoPlay
          loop={true}
          source={require("/assets/animation/confetti-2.json")}
          speed={2}
          style={{ height: "100%", position: "absolute" }}
        />
        <Heading1 color="dark2" textAlign="center">
          First step complete
        </Heading1>
        <Div h={48} />
        <Heading1 color="dark2" textAlign="center">
          You're killing it!
        </Heading1>
        <Div h={24} />
        <Heading1 color="dark2" textAlign="center">
          Let's keep moving
        </Heading1>
      </Div>
      <Animated.View style={panel2MarginStyle}>
        <Div
          alignItems="center"
          bg="steppenDarkNavy"
          flex={1}
          h={WINDOW_HEIGHT}
          justifyContent="center"
          w={WINDOW_WIDTH}
        >
          <Heading1 color="steppenYellow100" textAlign="center">
            Enjoy your first 3 days, it's FREE
          </Heading1>
          <Div h={8} />
          <Body color="steppenYellow100" textAlign="center">
            1 tap to start, super easy to cancel
          </Body>
        </Div>
      </Animated.View>
    </>
  )
}
