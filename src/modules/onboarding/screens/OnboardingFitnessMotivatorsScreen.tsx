import { gql, useMutation } from "@apollo/client"
import React, { useCallback, useMemo, useState } from "react"
import { ScrollView } from "react-native-gesture-handler"
import { Div } from "react-native-magnus"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import BuildConfidenceIconSvg from "assets/icon/colored/build-confidence.svg"
import GetStrongerIconSvg from "assets/icon/colored/get-stronger.svg"
import MentalHealthIconSvg from "assets/icon/colored/improve-mental-health.svg"
import LookBetterIconSvg from "assets/icon/colored/look-better.svg"
import HealthyHabitIconSvg from "assets/icon/colored/looking-for-health-habit.svg"
import LoseWeightIconSvg from "assets/icon/colored/lose-weight.svg"
import GymGirlsSvg from "assets/onboarding/gym-girls.svg"
import { logAnalyticsEvent } from "helper/logAnalyticsEvent"
import { shuffle } from "helper/shuffle"
import { useOnboardingProgress } from "modules/onboarding/useOnboardingProgress"
import { FormProgressSingleBar } from "src/designLibrary/form/FormProgressSingleBar"
import { SelectButtonWithIconAndCheckbox } from "src/designLibrary/SelectButtonWithIconAndCheckbox"
import { Heading2 } from "theme/Typography"

const SAVE_USER_PREFERENCE = gql`
  mutation saveUserPreference($key: String!) {
    userPreferenceAddPair(type: "onboarding-fitness-motivator", key: $key) {
      success
    }
  }
`

const MOTIVATORS = [
  {
    Svg: BuildConfidenceIconSvg,
    label: "Build up my self confidence",
    value: "build your confidence",
  },
  {
    Svg: LookBetterIconSvg,
    label: "To feel and look healthier",
    value: "feel and look healthier",
  },
  {
    Svg: GetStrongerIconSvg,
    label: "I want to get stronger",
    value: "get stronger",
  },
  {
    Svg: LoseWeightIconSvg,
    label: "I want to lose weight",
    value: "lose weight",
  },
  {
    Svg: MentalHealthIconSvg,
    label: "Improve my mental health",
    value: "improve your mental health",
  },
  {
    Svg: HealthyHabitIconSvg,
    label: "I want to continue to improve my current health & fitness routine",
    value: "maintain your current routine",
  },
]

export const OnboardingFitnessMotivatorsScreen = () => {
  const insets = useSafeAreaInsets()
  const [selectedItem, setSelectedItem] = useState()
  const [saveUserPreference] = useMutation(SAVE_USER_PREFERENCE)

  const { gotoNextRoute, updateOnboardingProgress } = useOnboardingProgress("fitness-motivators")

  const shuffledMotivators = useMemo(() => shuffle(MOTIVATORS), [])

  const selectMotivator = useCallback(
    async (item) => {
      setSelectedItem(item)

      saveUserPreference({ variables: { key: item.value } })

      logAnalyticsEvent("onboarding-fitness-motivators", { fitnessMotivator: item.value })

      updateOnboardingProgress()

      gotoNextRoute({ fitnessMotivator: item.value })
    },
    [gotoNextRoute, saveUserPreference, setSelectedItem, updateOnboardingProgress],
  )

  return (
    <Div bg="light" flex={1} justifyContent="center" pt={insets.top}>
      <Div h={16} />

      <FormProgressSingleBar currentFormPage={1} totalFormPages={4} />

      <Div h={25} />

      <Div alignItems="center" >
        <GymGirlsSvg style={{ aspectRatio: 211 / 140, width: "60%" }} />
      </Div>

      <Div h={40} />

      <Heading2 mx={16} >
        What's driving you to focus on your health & fitness?
      </Heading2>

      <Div h={24} />

      <ScrollView>
        <Div mx={16} >
          {shuffledMotivators.map((item, index) => (
            <SelectButtonWithIconAndCheckbox
              key={item.label}
              index={index}
              isSelected={selectedItem === item}
              SVG={item.Svg}
              text={item.label}
              onToggle={() => selectMotivator(item)}
            />
          ))}
        </Div>
      </ScrollView>
      
      <Div h={24} />
    </Div>
  )
}
