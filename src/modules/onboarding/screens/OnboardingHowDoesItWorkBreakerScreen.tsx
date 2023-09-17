import { gql, useMutation } from "@apollo/client"
import React, { Fragment, useCallback, useEffect, useMemo, useState } from "react"
import { Pressable, SafeAreaView } from "react-native"
import { Div, Icon } from "react-native-magnus"

import BackgroundSvg from "assets/onboarding/background-full-height-curves.svg"
import OnTheWaySvg from "assets/onboarding/on-the-way.svg"
import SelectSvg from "assets/onboarding/select.svg"
import { logAnalyticsEvent } from "helper/logAnalyticsEvent"
import { shuffle } from "helper/shuffle"
import { useOnboardingProgress } from "modules/onboarding/useOnboardingProgress"
import { Page } from "theme/Page"
import { BodyHeavy, Heading1, Heading3, ParagraphLight } from "theme/Typography"

const Option = ({ description, option, selectedOption, setSelectedOption, Svg, title }) => {
  const isSelected = useMemo(() => selectedOption === option, [option, selectedOption])

  const doSelect = useCallback(() => setSelectedOption(option), [option, setSelectedOption])

  return (
    <Pressable style={{ width: "100%" }} onPress={doSelect}>
      <Div bg={isSelected ? "steppenBlue20" : "white"} rounded={12} w="100%">
        <Div
          borderColor="aqua"
          borderWidth={isSelected ? 3 : 1}
          h="100%"
          position="absolute"
          rounded={12}
          w="100%"
          zIndex={1}
        />

        {isSelected && (
          <Div
            alignItems="center"
            aspectRatio={1}
            bg="aqua"
            justifyContent="center"
            position="absolute"
            right={-10}
            rounded={100}
            top={-10}
            w={32}
            zIndex={2}
          >
            <Icon color="light1" fontFamily="MaterialCommunityIcons" fontSize={20} name="check" />
          </Div>
        )}

        <Div row alignItems="center" px={16} py={24}>
          <Div w={113}>
            <Svg style={{ aspectRatio: 1, width: "100%" }} />
          </Div>

          <Div w={16} />

          <Div flex={1}>
            <Heading3 color="dark2">{title}</Heading3>

            {!!description && (
              <>
                <Div h={8} />

                <ParagraphLight color="dark3">{description}</ParagraphLight>
              </>
            )}
          </Div>
        </Div>
      </Div>
    </Pressable>
  )
}

const SAVE_USER_PREFERENCE = gql`
  mutation saveUserPreference($key: String!) {
    userPreferenceAddPair(type: "onboarding-how-does-it-work-choice", key: $key) {
      success
    }
  }
`

const OPTIONS = [
  {
    Svg: OnTheWaySvg,
    description: null,
    option: "guided-experience",
    title: "Guide me",
  },
  {
    Svg: SelectSvg,
    description: null,
    option: "do-my-own-thing",
    title: "Do my own thing",
  },
]

export const OnboardingHowDoesItWorkBreakerScreen = () => {
  const [saveUserPreference] = useMutation(SAVE_USER_PREFERENCE)

  const { gotoNextRoute, updateOnboardingProgress } = useOnboardingProgress(
    "how-does-it-work-breaker",
  )

  const [selectedOption, setSelectedOption] = useState(null)

  const randomizedOptions = useMemo(() => shuffle(OPTIONS), [])

  const navToNext = useCallback(async () => {
    updateOnboardingProgress()
    gotoNextRoute()
  }, [gotoNextRoute, updateOnboardingProgress])

  useEffect(() => {
    if (selectedOption) {
      logAnalyticsEvent("onboarding-how-does-it-work-option", { selectedOption })

      const timeout = setTimeout(() => {
        logAnalyticsEvent("onboarding-how-does-it-work-proceed", { selectedOption })

        global.userSegment = selectedOption

        saveUserPreference({ variables: { key: selectedOption } })

        navToNext()
      }, 700)

      return () => clearTimeout(timeout)
    }
  }, [navToNext, saveUserPreference, selectedOption])

  return (
    <Page bg="aqua10">
      <BackgroundSvg style={{ aspectRatio: 375 / 812, width: "100%", position: "absolute" }} />

      <SafeAreaView style={{ flex: 1 }}>
        <Div alignItems="center" flex={1} mx="baseMargin">
          <Div h={40} />

          <Heading1 color="dark2" textAlign="center">
            We're here for you!
          </Heading1>

          <Div h={14} />

          <ParagraphLight color="dark2" textAlign="center">
            We help you hit your fitness goal fast, but how you do that is up to you!
          </ParagraphLight>

          <Div h={40} />

          <BodyHeavy color="dark2">Select the option that suits you best</BodyHeavy>

          {randomizedOptions.map((option) => (
            <Fragment key={option.option}>
              <Div h={24} />

              <Option
                description={option.description}
                option={option.option}
                selectedOption={selectedOption}
                setSelectedOption={setSelectedOption}
                Svg={option.Svg}
                title={option.title}
              />
            </Fragment>
          ))}
        </Div>
      </SafeAreaView>
    </Page>
  )
}
