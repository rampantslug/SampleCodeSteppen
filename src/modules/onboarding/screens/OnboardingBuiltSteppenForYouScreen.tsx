import React, { useCallback, useState } from "react"
import { Button, Div } from "react-native-magnus"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import HappySvg from "assets/onboarding/metrics/happy.svg"
import LoveYourselfSvg from "assets/onboarding/metrics/love-yourself.svg"
import MarketResearchSvg from "assets/onboarding/metrics/market-research.svg"
import SuccessSvg from "assets/onboarding/metrics/success.svg"
import WomanSvg from "assets/onboarding/metrics/woman.svg"
import YogaMatSvg from "assets/onboarding/metrics/yoga-mat.svg"
import MetricsSvg from "assets/onboarding/metrics.svg"
import UnderlineSquiggleSvg from "assets/onboarding/underline-squiggle.svg"
import { useOnboardingProgress } from "modules/onboarding/useOnboardingProgress"
import { Page } from "theme/Page"
import { PageContentContainer } from "theme/PageContentContainer"
import { Body, BodyHeavy, Heading1, Heading3, ParagraphLight } from "theme/Typography"

const bulletPoints = [
  {
    quantative: "100%",
    description: "designed for Gen Z beginners",
    textColor: "#FFFFFF",
    icon: <WomanSvg style={{ aspectRatio: 1, width: 28 }} />,
  },
  {
    quantative: "100%",
    description: "built using the latest behavioural research",
    textColor: "#07B296",
    icon: <MarketResearchSvg style={{ aspectRatio: 1, width: 28 }} />,
  },
  {
    quantative: "80%",
    description: "fitness goal success rate",
    textColor: "#FFC466",
    icon: <SuccessSvg style={{ aspectRatio: 1, width: 28 }} />,
  },
  {
    quantative: "10x",
    description: "increase in motivation to exercise",
    textColor: "#9D94F4",
    icon: <YogaMatSvg style={{ aspectRatio: 1, width: 28 }} />,
  },
  {
    quantative: "7x",
    description: "physical self confidence and energy",
    textColor: "#93C4FF",
    icon: <LoveYourselfSvg style={{ aspectRatio: 1, width: 28 }} />,
  },
  {
    quantative: "5x",
    description: "increase in happiness & mood",
    textColor: "#6FDECB",
    icon: <HappySvg style={{ aspectRatio: 1, width: 28 }} />,
  },
]

const BulletPoint = ({ quantative, description, textColor, icon }) => {
  return (
    <Div row alignItems="center" my={8}>
      <Div
        alignItems="center"
        bg="#FFFFFF22"
        h={40}
        justifyContent="center"
        rounded={8}
        shadow="md"
        w={40}
      >
        {icon}
      </Div>

      <Div ml={16}>
        <Heading3 color={textColor}>{quantative}</Heading3>
        <ParagraphLight color="light">{description}</ParagraphLight>
      </Div>
    </Div>
  )
}

export const OnboardingBuiltSteppenForYouScreen = () => {
  const [loading, setLoading] = useState(false)

  const { gotoNextRoute, updateOnboardingProgress } = useOnboardingProgress("built-steppen-for-you")

  const navToNext = useCallback(async () => {
    setLoading(true)

    updateOnboardingProgress()
    gotoNextRoute()

    setLoading(false)
  }, [gotoNextRoute, updateOnboardingProgress])

  const insets = useSafeAreaInsets()

  return (
    <Page bg="#32284D">
      <MetricsSvg
        style={{
          aspectRatio: 375 / 385,
          top: (insets.top || 20) + 30,
          width: "100%",
          position: "absolute",
        }}
      />

      <PageContentContainer>
        <Div flex={1} minH={220} />

        <Div my={16}>
          <Heading1 color="light" textAlign="center">
            We built Steppen for you!
          </Heading1>
          <UnderlineSquiggleSvg
            style={{ aspectRatio: 60 / 9, position: "absolute", width: 60, right: 40, bottom: -8 }}
          />
        </Div>

        <Body color="light" textAlign="center">
          How are we going so far?
        </Body>

        <Div h={24} />

        <Div mx={16}>
          {bulletPoints.map((item, index) => (
            <BulletPoint key={index.toString()} {...item} />
          ))}
        </Div>
      </PageContentContainer>

      <Div pb={insets.bottom || 16} pt={16}>
        <Button
          alignSelf="center"
          bg="aqua"
          loading={loading}
          minH={56}
          py={16}
          rounded={8}
          w="80%"
          onPress={navToNext}
        >
          <BodyHeavy color="light">Impressed? Great... Let's Move On</BodyHeavy>
        </Button>
      </Div>
    </Page>
  )
}
