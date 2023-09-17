import Lottie from "lottie-react-native"
import React, { useCallback } from "react"
import { Button, Div, WINDOW_WIDTH } from "react-native-magnus"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import FireSVG from "assets/journey/pageIllustrations/fire.svg"
import { useOnboardingProgress } from "modules/onboarding/useOnboardingProgress"
import { Body, BodyHeavy, BodyLight, Heading1, ParagraphHeavy } from "theme/Typography"

const BACKGROUND_WIDTH = WINDOW_WIDTH + 0.5 * WINDOW_WIDTH
const BACKGROUND_MARGIN = -0.42 * BACKGROUND_WIDTH

export const OnboardingJourneyJoinedScreen = () => {
  const insets = useSafeAreaInsets()

  const { gotoNextRoute, updateOnboardingProgress } = useOnboardingProgress("journey-joined")

  const navToNext = useCallback(async () => {
    updateOnboardingProgress()
    gotoNextRoute()
  }, [gotoNextRoute, updateOnboardingProgress])

  return (
    <Div alignItems="center" bg="steppenYellow20" flex={1}>
      <Div
        bg="steppenYellow100"
        overflow="hidden"
        position="absolute"
        rounded="circle"
        style={{ aspectRatio: 1 }}
        top={BACKGROUND_MARGIN}
        w={BACKGROUND_WIDTH}
      />

      <Div
        alignItems="center"
        bg="steppenYellow40"
        justifyContent="center"
        mt={insets.top}
        rounded="circle"
        style={{ aspectRatio: 1 }}
        w="60%"
      >
        <Lottie
          autoPlay
          loop={true}
          source={require("/assets/animation/rocketCircle.json")}
          speed={2}
          style={{ width: "130%", aspectRatio: 1 }}
        />
      </Div>

      <Heading1 color="dark2" mt={72} mx={12} textAlign="center">
        Today marks the start of your fitness journey!
      </Heading1>

      <Div h={32} />

      <BodyLight color="dark2" mx={24} textAlign="center">
        Every day you're active on Steppen is another step closer to hitting your fitness goal.
      </BodyLight>

      <Div h={16} />

      <Div
        row
        alignItems="center"
        alignSelf="stretch"
        bg="steppenYellow40"
        justifyContent="center"
        mx={24}
        py={16}
        rounded={8}
      >
        <Body color="dark2">1st Goal:</Body>

        <Div w={8} />

        <Div row alignItems="center" bg="steppenYellow80" pl={12} pr={16} py={8} rounded={24}>
          <FireSVG style={{ aspectRatio: 1, width: 26, marginTop: -6 }} />
          <ParagraphHeavy color="alternateTextBrown">7 day streak</ParagraphHeavy>
        </Div>
      </Div>

      <Div flex={1} minH={16} />

      <Div alignSelf="stretch" pb={insets.bottom || 16} pt={16} px={16}>
        <Button alignSelf="stretch" bg="aqua" minH={56} py={16} rounded={8} onPress={navToNext}>
          <BodyHeavy color="light">Awesome Work!</BodyHeavy>
        </Button>
      </Div>
    </Div>
  )
}
