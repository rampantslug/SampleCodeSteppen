import { gql, useMutation } from "@apollo/client"
import { useRoute } from "@react-navigation/native"
import React, { useCallback, useMemo, useState } from "react"
import { ScrollView } from "react-native-gesture-handler"
import { Div } from "react-native-magnus"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import CalendarClockIconSvg from "assets/onboarding/calendar-clock.svg"
import FistIconSvg from "assets/onboarding/fist.svg"
import LaughIconSvg from "assets/onboarding/laugh.svg"
import ScaleChartIconSvg from "assets/onboarding/scale-chart.svg"
import TravelIconSvg from "assets/onboarding/travel.svg"
import VideoPlayIconSvg from "assets/onboarding/video-play.svg"
import YogaPeopleSvg from "assets/onboarding/yoga-people.svg"
import { logAnalyticsEvent } from "helper/logAnalyticsEvent"
import { shuffle } from "helper/shuffle"
import { useOnboardingProgress } from "modules/onboarding/useOnboardingProgress"
import { FormProgressSingleBar } from "src/designLibrary/form/FormProgressSingleBar"
import { SelectButtonWithIconAndCheckbox } from "src/designLibrary/SelectButtonWithIconAndCheckbox"
import { Heading2 } from "theme/Typography"

const SAVE_USER_PREFERENCE = gql`
  mutation saveUserPreference($key: String!) {
    userPreferenceAddPair(type: "onboarding-how-can-steppen-help-choice", key: $key) {
      success
    }
  }
`

const STEPPEN_HELP_OPTIONS = [
  {
    Svg: TravelIconSvg,
    label: "Guide me on exactly what to do daily",
    value: "guide-me-daily",
  },
  {
    Svg: LaughIconSvg,
    label: "Give me the tools but let me decide what to do",
    value: "give-me-tools",
  },
  {
    Svg: FistIconSvg,
    label: "Motivate me all the time",
    value: "motivate-me",
  },
  {
    Svg: CalendarClockIconSvg,
    label: "Help me build a routine and stay consistent",
    value: "build-routine-and-stay-consistent",
  },
  {
    Svg: VideoPlayIconSvg,
    label: "Provide me with workouts to do",
    value: "provide-workouts",
  },
  {
    Svg: ScaleChartIconSvg,
    label: "Help me keep track of my progress",
    value: "track-my-progress",
  },
]

export const OnboardingFitnessHowCanSteppenHelpScreen = () => {
  const insets = useSafeAreaInsets()
  const [selectedItem, setSelectedItem] = useState()
  const [saveUserPreference] = useMutation(SAVE_USER_PREFERENCE)

  const { params } = useRoute<any>()
  const { fitnessMotivator } = useMemo(() => params || {}, [params])

  const { gotoNextRoute, updateOnboardingProgress } = useOnboardingProgress(
    "fitness-how-can-steppen-help",
  )

  const shuffledOptions = useMemo(() => shuffle(STEPPEN_HELP_OPTIONS), [])

  const selectOption = useCallback(
    async (item) => {
      setSelectedItem(item)

      saveUserPreference({ variables: { key: item.value } })

      logAnalyticsEvent("onboarding-ffitness-how-can-steppen-help", { how: item.value })

      updateOnboardingProgress()

      gotoNextRoute()
    },
    [gotoNextRoute, saveUserPreference, setSelectedItem, updateOnboardingProgress],
  )

  return (
    <Div bg="light" flex={1} justifyContent="center" pt={insets.top}>
      <Div h={16} />

      <FormProgressSingleBar currentFormPage={2} totalFormPages={4} />

      <Div h={25} />

      <Div alignItems="center">
        <YogaPeopleSvg style={{ aspectRatio: 211 / 140, width: "60%" }} />
      </Div>

      <Div h={40} />

      <Heading2 mx={16}>
        How do you want Steppen to help you {fitnessMotivator?.toLowerCase() || "achieve your goal"}
        ?
      </Heading2>

      <Div h={24} />

      <ScrollView>
        <Div mx={16}>
          {shuffledOptions.map((item, index) => (
            <SelectButtonWithIconAndCheckbox
              key={item.label}
              index={index}
              isSelected={selectedItem === item}
              SVG={item.Svg}
              text={item.label}
              onToggle={() => selectOption(item)}
            />
          ))}
        </Div>
      </ScrollView>

      <Div h={24} />
    </Div>
  )
}
