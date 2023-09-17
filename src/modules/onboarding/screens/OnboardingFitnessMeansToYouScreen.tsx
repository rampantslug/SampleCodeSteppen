import { gql, useMutation } from "@apollo/client"
import React, { useCallback, useMemo, useState } from "react"
import { Pressable } from "react-native"
import { Button, Div } from "react-native-magnus"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import HealthyLifestyleSvg from "assets/onboarding/healthy-lifestyle.svg"
import ScaleIndicator from "assets/onboarding/scalePicker/scale-indicator.svg"
import ScaleLevel1Svg from "assets/onboarding/scalePicker/scale-level-1.svg"
import ScaleLevel2Svg from "assets/onboarding/scalePicker/scale-level-2.svg"
import ScaleLevel3Svg from "assets/onboarding/scalePicker/scale-level-3.svg"
import ScaleLevel4Svg from "assets/onboarding/scalePicker/scale-level-4.svg"
import ScaleLevel5Svg from "assets/onboarding/scalePicker/scale-level-5.svg"
import { logAnalyticsEvent } from "helper/logAnalyticsEvent"
import { useOnboardingProgress } from "modules/onboarding/useOnboardingProgress"
import { FormProgressSingleBar } from "src/designLibrary/form/FormProgressSingleBar"
import globalCustomisations from "theme/globalCustomisations"
import { Body, Heading2, ParagraphLight } from "theme/Typography"

const SAVE_USER_PREFERENCE = gql`
  mutation saveUserPreference($key: String!) {
    userPreferenceAddPair(type: "onboarding-what-fitness-means-to-you", key: $key) {
      success
    }
  }
`

const FITNESS_MEANS_TO_ME = [
  {
    Svg: ScaleLevel1Svg,
    label: "Not important",
    value: "not-important",
    selectedColor: "#B7EFE5",
    width: 40,
    height: 14,
  },
  {
    Svg: ScaleLevel2Svg,
    label: "Somewhat important",
    value: "somewhat-important",
    selectedColor: "#B7EFE5",
    width: 40,
    height: 21,
  },
  {
    Svg: ScaleLevel3Svg,
    label: "Moderately important",
    value: "moderately-important",
    selectedColor: "#93E6D8",
    width: 47,
    height: 29,
  },
  {
    Svg: ScaleLevel4Svg,
    label: "Very important",
    value: "very-important",
    selectedColor: "#6FDECB",
    width: 53,
    height: 39,
  },
  {
    Svg: ScaleLevel5Svg,
    label: "Absolutely crucial",
    value: "absolutely-crucial",
    selectedColor: "#4BD6BF",
    width: 72,
    height: 50,
  },
]

export const OnboardingFitnessMeansToYouScreen = () => {
  const insets = useSafeAreaInsets()
  const [selectedIndex, setSelectedIndex] = useState(undefined)
  const [saveUserPreference] = useMutation(SAVE_USER_PREFERENCE)

  const { gotoNextRoute, updateOnboardingProgress } = useOnboardingProgress("fitness-means-to-you")

  const currentSelectedItem = useMemo(
    () => selectedIndex != null && FITNESS_MEANS_TO_ME[selectedIndex],
    [selectedIndex],
  )

  const navToNext = useCallback(async () => {
    if (!currentSelectedItem) return

    saveUserPreference({ variables: { key: currentSelectedItem.value } })

    logAnalyticsEvent("onboarding-fitness-means-to-you", {
      means_to_you: currentSelectedItem.value,
    })

    updateOnboardingProgress()

    gotoNextRoute()
  }, [currentSelectedItem, gotoNextRoute, saveUserPreference, updateOnboardingProgress])

  return (
    <Div bg="light" flex={1} justifyContent="center" pt={insets.top}>
      <Div h={16} />

      <FormProgressSingleBar currentFormPage={3} totalFormPages={4} />

      <Div h={25} />

      <Div alignItems="center" >
        <HealthyLifestyleSvg aspectRatio={183 / 121} width="60%" />
      </Div>

      <Div h={40} />

      <Heading2 mx={16} >
        How much does your health & fitness mean to you?
      </Heading2>

      <Div flex={1} minH={16} />

      <Div bg="light" mx={16} p={24} rounded={8} shadow="sm">
        <Div row alignItems="flex-end" justifyContent="center">
          {FITNESS_MEANS_TO_ME.map((item, index) => (
            <Div key={item.label} alignItems="center" mx={5}>
              <Pressable hitSlop={5} onPress={() => setSelectedIndex(index)}>
                <item.Svg
                  color={
                    index <= selectedIndex ? item.selectedColor : globalCustomisations.colors.light5
                  }
                  style={{ width: item.width, height: item.height }}
                />
              </Pressable>

              {index === selectedIndex && (
                <ScaleIndicator
                  style={{ position: "absolute", bottom: -20, width: 12, height: 17 }}
                />
              )}
            </Div>
          ))}
        </Div>

        <Div h={24} />

        {currentSelectedItem ? (
          <Body textAlign="center">{currentSelectedItem.label}</Body>
        ) : (
          <Body color="dark4" textAlign="center">
            Select your level
          </Body>
        )}
      </Div>

      <Div flex={2} minH={16} />

      <ParagraphLight textAlign="center">
        We're here to help for all importance levels!
      </ParagraphLight>

      <Button
        alignSelf="stretch"
        bg="aqua"
        color="light"
        disabled={!currentSelectedItem}
        fontSize={14}
        fontWeight="700"
        h={56}
        mb={40}
        mt={16}
        mx={40}
        rounded={8}
        onPress={navToNext}
      >
        Next
      </Button>
    </Div>
  )
}
