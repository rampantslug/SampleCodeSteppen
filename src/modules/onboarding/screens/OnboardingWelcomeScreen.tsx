import { gql, useMutation } from "@apollo/client"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { PerformanceMeasureView } from "@shopify/react-native-performance"
import React, { useCallback, useState } from "react"
import { Button, Div, WINDOW_HEIGHT, WINDOW_WIDTH } from "react-native-magnus"
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import SteppenLogoWhiteSvg from "assets/img/onboarding/steppen-logo-white.svg"
import SteppenLogoLargeSvg from "assets/onboarding/steppen-logo-large.svg"
import YogaPracticeSvg from "assets/onboarding/yoga-practice.svg"
import { logAnalyticsEvent } from "helper/logAnalyticsEvent"
import { screenLibrary } from "navigation/screenLibrary"
import { Body, Heading1 } from "theme/Typography"

const CREATE_TEMPORARY_USER = gql`
  mutation createTemporaryUser {
    createTemporaryUser {
      phoneVerificationId
      userId
    }
  }
`

export const OnboardingWelcomeScreen = () => {
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()

  const [createTemporaryUser] = useMutation(CREATE_TEMPORARY_USER)

  const [isLoading, setIsLoading] = useState(false)

  const zoomScale = useSharedValue(0.115)
  const animatedOpacity = useSharedValue(0)

  const zoomStyle = useAnimatedStyle(
    () => ({
      position: "absolute",
      transform: [
        { translateY: WINDOW_HEIGHT / 2 - 575 },
        { translateX: WINDOW_WIDTH / 2 - 500 },
        { scale: zoomScale.value },
      ],
    }),
    [zoomScale],
  )

  const opacityStyle = useAnimatedStyle(
    () => ({
      flex: 1,
      height: "100%",
      opacity: animatedOpacity.value,
    }),
    [animatedOpacity],
  )

  const runAnimations = useCallback(() => {
    const timeout1 = setTimeout(() => {
      zoomScale.value = withTiming(10, { duration: 2000 })
    }, 0)

    const timeout2 = setTimeout(() => {
      animatedOpacity.value = withTiming(1, { duration: 1000 })
    }, 1500)

    return () => {
      clearTimeout(timeout1)
      clearTimeout(timeout2)
    }
  }, [animatedOpacity, zoomScale])

  useFocusEffect(() => runAnimations())

  const doGuestLogin = useCallback(async () => {
    setIsLoading(true)

    logAnalyticsEvent("welcome-page-press-start-my-journey")

    const response = await createTemporaryUser()
    const data = response.data.createTemporaryUser

    navigation.reset({
      index: 0,
      routes: [
        {
          name: screenLibrary.login.doLogin,
          params: {
            isOnboarding: true,
            phoneVerificationId: data.phoneVerificationId,
            userId: data.userId,
          },
        },
      ],
    })

    setIsLoading(false)
  }, [createTemporaryUser, navigation])

  return (
    <PerformanceMeasureView interactive={true} screenName="onboardingWelcome">
      <Animated.View style={zoomStyle}>
        <SteppenLogoLargeSvg aspectRatio={852 / 979} color="#4BD6BF" width={1000} />
      </Animated.View>
      <Animated.View style={opacityStyle}>
        <Div alignItems="center" bg="aqua" flex={1} pt={insets.top + 20}>
          <Div />

          <Heading1 color="light1">Welcome to</Heading1>

          <SteppenLogoWhiteSvg aspectRatio={266 / 62} width="75%" />

          <Div h={24} />

          <Body color="light" mx={48} textAlign="center">
            Where Gen Z come to smash their fitness goals fast!
          </Body>

          <Div flex={1} minH={10} />

          <YogaPracticeSvg style={{ aspectRatio: 375 / 299 }} width="100%" />

          <Div flex={1} minH={10} />

          <Div pb={insets.bottom || 16} pt={10} w="100%">
            <Button
              alignSelf="stretch"
              bg="light"
              color="aqua100"
              fontSize={18}
              fontWeight="700"
              loaderColor="aqua"
              loading={isLoading}
              minH={60}
              mx={56}
              rounded={10}
              onPress={doGuestLogin}
            >
              Start My Journey
            </Button>

            <Button
              alignSelf="stretch"
              bg="transparent"
              color="light1"
              fontSize={16}
              fontWeight="400"
              mb={32}
              minH={48}
              mx={40}
              textDecorLine="underline"
              onPress={() => navigation.navigate(screenLibrary.login.phoneVerification)}
            >
              Already have an account? Login
            </Button>
          </Div>
        </Div>
      </Animated.View>
    </PerformanceMeasureView>
  )
}
