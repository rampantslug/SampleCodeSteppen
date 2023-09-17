import { gql, useMutation } from "@apollo/client"
import React, { useCallback, useState } from "react"
import { ScrollView } from "react-native"
import { Div } from "react-native-magnus"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import FlowerPotSvg from "assets/onboarding/ageRange/flower-pot.svg"
import FruitTreeSvg from "assets/onboarding/ageRange/fruit-tree.svg"
import PlantSvg from "assets/onboarding/ageRange/plant.svg"
import SeedSvg from "assets/onboarding/ageRange/seed.svg"
import SproutSvg from "assets/onboarding/ageRange/sprout.svg"
import TomatoSvg from "assets/onboarding/ageRange/tomato.svg"
import TreeSvg from "assets/onboarding/ageRange/tree.svg"
import { FormProgress } from "designLibrary/form/FormProgress"
import { SelectButtonWithIconAndCheckbox } from "designLibrary/SelectButtonWithIconAndCheckbox"
import { logAnalyticsEvent } from "helper/logAnalyticsEvent"
import { useOnboardingProgress } from "modules/onboarding/useOnboardingProgress"
import { Body, Heading1 } from "theme/Typography"

const UPDATE_AGE_RANGE = gql`
  mutation updateCurrentUser($ageRange: String!) {
    updateCurrentUser(data: { addMemberOnboardingProgress: "age-range", ageRange: $ageRange }) {
      id
    }
  }
`

const ageRanges = [
  {
    icon: <SeedSvg style={{ aspectRatio: 1, width: 24 }} />,
    label: "<12",
  },
  {
    icon: <SproutSvg style={{ aspectRatio: 1, width: 24 }} />,
    label: "12-15",
  },
  {
    icon: <PlantSvg style={{ aspectRatio: 1, width: 24 }} />,
    label: "16-18",
  },
  {
    icon: <TomatoSvg style={{ aspectRatio: 1, width: 24 }} />,
    label: "19-22",
  },
  {
    icon: <FlowerPotSvg style={{ aspectRatio: 1, width: 24 }} />,
    label: "23-26",
  },
  {
    icon: <TreeSvg style={{ aspectRatio: 1, width: 24 }} />,
    label: "27-30",
  },
  {
    icon: <FruitTreeSvg style={{ aspectRatio: 1, width: 24 }} />,
    label: "30+",
  },
]

export const OnboardingAgeScreen = () => {
  const insets = useSafeAreaInsets()
  const [selectedItem, setSelectedItem] = useState()

  const { gotoNextRoute } = useOnboardingProgress("age-range")

  const [updateAgeRange] = useMutation(UPDATE_AGE_RANGE)

  const selectAgeRange = useCallback(
    async (item) => {
      setSelectedItem(item)

      updateAgeRange({
        variables: {
          ageRange: item.label,
        },
      })
      logAnalyticsEvent("onboarding-age-range", { ageRange: item.label })
      gotoNextRoute()
    },
    [gotoNextRoute, updateAgeRange],
  )

  return (
    <Div bg="light" flex={1} pt={insets.top}>
      <FormProgress currentFormIndex={1} totalFormPages={2} />

      <Heading1 color="dark2" mt={64} mx={16}>
        How old are you?
      </Heading1>

      <Body color="dark2" mt={8} mx={16}>
        This helps us recommend the right workouts
      </Body>

      <ScrollView>
        <Div mx={16} my={32}>
          {ageRanges.map((item, index) => (
            <SelectButtonWithIconAndCheckbox
              key={item.label}
              icon={item.icon}
              index={index}
              isSelected={selectedItem === item}
              text={item.label}
              onToggle={() => selectAgeRange(item)}
            />
          ))}
        </Div>
      </ScrollView>
    </Div>
  )
}
