import Lottie from "lottie-react-native"
import React, { useCallback } from "react"
import { Button, Div } from "react-native-magnus"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import CrownSvg from "assets/onboarding/crown.svg"
import UnderlineSquiggleSvg from "assets/onboarding/underline-squiggle.svg"
import { useOnboardingProgress } from "modules/onboarding/useOnboardingProgress"
import { Body, Heading1 } from "theme/Typography"

export const OnboardingPowerOfTinyGainsScreen = () => {
  const insets = useSafeAreaInsets()
  const { gotoNextRoute, updateOnboardingProgress } = useOnboardingProgress("power-of-tiny-gains")

  const navToNext = useCallback(async () => {
    updateOnboardingProgress()
    gotoNextRoute()
  }, [gotoNextRoute, updateOnboardingProgress])

  return (
    <Div flex={1}>
      <Div alignItems="center" bg="steppenPurple10" flex={1} pt={insets.top}>
        <Div flex={1} minH={12} />

        <Div my={24}>
          <Heading1 color="dark2" textAlign="center">
            The Power of Tiny Gains
          </Heading1>

          <CrownSvg
            style={{ aspectRatio: 36 / 36, position: "absolute", width: 36, top: -28, left: 40 }}
          />

          <UnderlineSquiggleSvg
            style={{ aspectRatio: 110 / 9, position: "absolute", width: 110, right: 4, bottom: -8 }}
          />
        </Div>

        <Body color="alternateText80">1% better every day </Body>

        <Body color="steppenOrange80">1% worse every day </Body>

        <Div flex={1} minH={16} />

        <Div>
          <Lottie
            autoPlay
            loop={false}
            source={require("/assets/animation/graph.json")}
            speed={1}
            style={{ width: "95%", height: "95%", marginTop: -24 }}
          />
        </Div>

        <Div flex={1} minH={24} />
      </Div>

      <Div alignItems="center" bg="light" flex={1} px={16}>
        <Div flex={1} minH={16} />

        <Body color="dark2">
          It's easy to cut corners but creating a new healthy habit is not supposed to be easy.
        </Body>

        <Div flex={1} minH={16} />

        <Body color="dark2">However with the right steps it's</Body>

        <Heading1 color="steppenPurple100">100% achievable</Heading1>

        <Div flex={1} />

        <Div pb={insets.bottom || 16} pt={10} w="100%">
          <Button
            alignSelf="stretch"
            bg="aqua"
            color="light"
            fontSize={14}
            fontWeight="700"
            minH={56}
            mt={8}
            mx={40}
            rounded={8}
            onPress={navToNext}
          >
            Next
          </Button>
        </Div>
      </Div>
    </Div>
  )
}
