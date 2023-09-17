import React, { useCallback } from "react"
import { StatusBar } from "react-native"
import { Button, Div } from "react-native-magnus"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import JourneyExplainer1Svg from "assets/onboarding/journey-explainer-1.svg"
import FeatureTickSvg from "assets/steppen-plus/feature-tick.svg"
import { useOnboardingProgress } from "modules/onboarding/useOnboardingProgress"
import { Page } from "theme/Page"
import { Body, BodyHeavy, Heading1 } from "theme/Typography"

const FEATURES = ["Daily activity or workout", "Motivation", "Progress", "Tracking"]

export const OnboardingJourneyExplainerScreen = () => {
  const { gotoNextRoute, updateOnboardingProgress } = useOnboardingProgress("journey-explainer")

  const navToNext = useCallback(() => {
    updateOnboardingProgress()
    gotoNextRoute()
  }, [gotoNextRoute, updateOnboardingProgress])

  const insets = useSafeAreaInsets()

  return (
    <Page bg="steppenYellow40">
      <StatusBar barStyle="dark-content" />

      <Div bottom={0} position="absolute">
        <JourneyExplainer1Svg style={{ aspectRatio: 375 / 353, width: "100%" }} />
      </Div>

      <Div h={insets.top + 30} />

      <Div flex={1} mx="baseMargin">
        <Div bg="#fffaf1" p={24} rounded={16}>
          <Heading1 color="alternateTextBrown" textAlign="center">
            Your Journey
          </Heading1>

          <Div h={14} />

          <Body color="dark2">
            Journeys provide you with a detailed, step-by-step guide on how to achieve your fitness
            goal.
          </Body>

          <Div h={14} />

          <Body color="dark2">Includes:</Body>

          {FEATURES.map((feature, index) => (
            <Div key={index} row alignItems="center" mt={6}>
              <FeatureTickSvg style={{ aspectRatio: 1, width: 20 }} />

              <Div w={8} />

              <Body color="dark2">{feature}</Body>
            </Div>
          ))}
        </Div>

        <Div flex={1} />

        <Button alignSelf="center" bg="aqua" rounded={8} w="80%" onPress={navToNext}>
          <BodyHeavy color="light">Join a Journey</BodyHeavy>
        </Button>

        <Div h={insets.bottom + 30} />
      </Div>
    </Page>
  )
}
