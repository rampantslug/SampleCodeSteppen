import { gql, useMutation } from "@apollo/client"
import React, { useCallback, useState } from "react"
import { ScrollView } from "react-native-gesture-handler"
import { Div } from "react-native-magnus"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import Calendar1dIconSvg from "assets/onboarding/calendar-1d.svg"
import Calendar1mIconSvg from "assets/onboarding/calendar-1m.svg"
import Calendar1wIconSvg from "assets/onboarding/calendar-1w.svg"
import Calendar3dIconSvg from "assets/onboarding/calendar-3d.svg"
import Calendar3mIconSvg from "assets/onboarding/calendar-3m.svg"
import Calendar3wIconSvg from "assets/onboarding/calendar-3w.svg"
import CalendarPlantPersonSvg from "assets/onboarding/calendar-plant-person.svg"
import { logAnalyticsEvent } from "helper/logAnalyticsEvent"
import { useOnboardingProgress } from "modules/onboarding/useOnboardingProgress"
import { FormProgressSingleBar } from "src/designLibrary/form/FormProgressSingleBar"
import { SelectButtonWithIconAndCheckbox } from "src/designLibrary/SelectButtonWithIconAndCheckbox"
import { Heading2 } from "theme/Typography"

const SAVE_USER_PREFERENCE = gql`
  mutation saveUserPreference($key: String!) {
    userPreferenceAddPair(type: "onboarding-fitness-results-when", key: $key) {
      success
    }
  }
`

const RESULTS_WHEN_OPTIONS = [
  {
    Svg: Calendar1dIconSvg,
    label: "Today",
    value: "1d",
  },
  {
    Svg: Calendar3dIconSvg,
    label: "In 2-3 days",
    value: "3d",
  },
  {
    Svg: Calendar1wIconSvg,
    label: "In 1 week",
    value: "1w",
  },
  {
    Svg: Calendar3wIconSvg,
    label: "In 2-3 weeks",
    value: "3w",
  },
  {
    Svg: Calendar1mIconSvg,
    label: "Within a month",
    value: "1m",
  },
  {
    Svg: Calendar3mIconSvg,
    label: "After 2-3 months",
    value: "3m",
  },
]

export const OnboardingFitnessResultsWhenScreen = () => {
  const insets = useSafeAreaInsets()
  const [selectedItem, setSelectedItem] = useState()
  const [saveUserPreference] = useMutation(SAVE_USER_PREFERENCE)

  const { gotoNextRoute, updateOnboardingProgress } = useOnboardingProgress("fitness-results-when")

  const selectOption = useCallback(
    async (item) => {
      setSelectedItem(item)

      saveUserPreference({ variables: { key: item.value } })

      logAnalyticsEvent("onboarding-fitness-results-when", { when: item.value })

      updateOnboardingProgress()

      gotoNextRoute()
    },
    [gotoNextRoute, saveUserPreference, setSelectedItem, updateOnboardingProgress],
  )

  return (
    <Div bg="light" flex={1} justifyContent="center" pt={insets.top}>
      <Div h={16} />

      <FormProgressSingleBar currentFormPage={4} totalFormPages={4} />
      
      <Div h={25} />

      <Heading2 mx={16}>
        How quickly do you expect to see results with your health & fitness?
      </Heading2>

      <Div h={24} />

      <Div alignItems="center" my={16}>
        <CalendarPlantPersonSvg aspectRatio={183 / 121} width="60%" />
      </Div>

      <Div h={40} />

      <ScrollView>
        <Div row flexWrap="wrap" mx={8} >
          {RESULTS_WHEN_OPTIONS.map((item, index) => (
            <Div key={item.label} mx={8} w="45%">
              <SelectButtonWithIconAndCheckbox
                fontSize={14}
                fontWeight="500"
                index={index}
                isSelected={selectedItem === item}
                SVG={item.Svg}
                text={item.label}
                onToggle={() => selectOption(item)}
              />
            </Div>
          ))}
        </Div>
      </ScrollView>
    </Div>
  )
}
