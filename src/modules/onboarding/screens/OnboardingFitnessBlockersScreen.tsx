import { gql, useMutation } from "@apollo/client"
import React, { useCallback, useMemo, useState } from "react"
import { ScrollView } from "react-native-gesture-handler"
import { Button, Div } from "react-native-magnus"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import DietIconSvg from "assets/icon/colored/diet.svg"
import DontKnowWhatToDoIconSvg from "assets/icon/colored/dont-know-what-to-do.svg"
import InjuryOrHealthConcernIconSvg from "assets/icon/colored/injury-or-health-concern.svg"
import LackOfMotivationIconSvg from "assets/icon/colored/lack-of-motivation.svg"
import SelfConfidenceIconSvg from "assets/icon/colored/self-confidence.svg"
import StruggledWithConsistencyIconSvg from "assets/icon/colored/struggled-with-consistency.svg"
import TimeManagementIconSvg from "assets/icon/colored/time-management.svg"
import EatingDisorderSvg from "assets/onboarding/eating-disorder.svg"
import { logAnalyticsEvent } from "helper/logAnalyticsEvent"
import { shuffle } from "helper/shuffle"
import { useOnboardingProgress } from "modules/onboarding/useOnboardingProgress"
import { FormProgress } from "src/designLibrary/form/FormProgress"
import { SelectButtonWithIconAndCheckbox } from "src/designLibrary/SelectButtonWithIconAndCheckbox"
import { Heading2, Paragraph } from "theme/Typography"

const UPDATE_USER_FITNESS_BLOCKERS = gql`
  mutation updateCurrentUser($fitnessBlockers: [String]!) {
    updateCurrentUser(
      data: { addMemberOnboardingProgress: "fitness-blockers", fitnessBlockers: $fitnessBlockers }
    ) {
      id
    }
  }
`

const BLOCKERS = [
  {
    icon: <LackOfMotivationIconSvg aspectRatio={1} width={24} />,
    label: "Motivation",
    value: "lack of motivation",
  },
  {
    icon: <TimeManagementIconSvg aspectRatio={1} width={24} />,
    label: "Time management",
    value: "time management",
  },
  {
    icon: <StruggledWithConsistencyIconSvg aspectRatio={1} width={24} />,
    label: "Consistency",
    value: "struggled with consistency",
  },
  {
    icon: <DietIconSvg aspectRatio={1} width={24} />,
    label: "Diet",
    value: "diet",
  },
  {
    icon: <DontKnowWhatToDoIconSvg aspectRatio={1} width={24} />,
    label: "Not sure what to do",
    value: "don't know what to do",
  },
  {
    icon: <InjuryOrHealthConcernIconSvg aspectRatio={1} width={24} />,
    label: "Injury or health concern",
    value: "injury or health",
  },
  {
    icon: <SelfConfidenceIconSvg aspectRatio={1} width={24} />,
    label: "Self confidence",
    value: "self confidence",
  },
]

export const OnboardingFitnessBlockersScreen = () => {
  const insets = useSafeAreaInsets()
  const [selectedItems, setSelectedItems] = useState([])

  const { gotoNextRoute } = useOnboardingProgress("fitness-blockers")

  const [updateFitnessBlockers] = useMutation(UPDATE_USER_FITNESS_BLOCKERS)

  const shuffledBlockers = useMemo(() => shuffle(BLOCKERS), [])

  const getSelectedItemIndex = useCallback(
    (item) => selectedItems.findIndex((t) => t === item),
    [selectedItems],
  )

  const toggleItemSelection = useCallback(
    (item) => {
      const selectedItemIndex = getSelectedItemIndex(item)

      if (selectedItemIndex >= 0) {
        setSelectedItems(selectedItems.filter((_, index) => selectedItemIndex !== index))
      } else {
        setSelectedItems([...selectedItems, item])
      }
    },
    [getSelectedItemIndex, selectedItems],
  )

  const navToNext = useCallback(async () => {
    const fitnessBlockers = selectedItems.map((item) => item.value)
    updateFitnessBlockers({
      variables: {
        fitnessBlockers,
      },
    })
    logAnalyticsEvent("onboarding-fitness-blockers", { fitnessBlockers })
    gotoNextRoute()
  }, [gotoNextRoute, selectedItems, updateFitnessBlockers])

  return (
    <Div bg="light" flex={1} justifyContent="center" pt={insets.top}>
      <FormProgress currentFormIndex={1} totalFormPages={2} />
      <Div alignItems="center" my={16}>
        <EatingDisorderSvg aspectRatio={163 / 121} width="60%" />
      </Div>
      <Heading2 mx={16} my={8}>
        What do you think has stopped you from reaching your fitness goal in the past?
      </Heading2>
      <Paragraph color="dark4" mx={16}>
        (You can select multiple)
      </Paragraph>
      <ScrollView>
        <Div mx={16} my={16}>
          {shuffledBlockers.map((item, index) => (
            <SelectButtonWithIconAndCheckbox
              key={item.label}
              icon={item.icon}
              index={index}
              isSelected={getSelectedItemIndex(item) > -1}
              text={item.label}
              onToggle={() => toggleItemSelection(item)}
            />
          ))}
        </Div>
      </ScrollView>
      <Button
        alignSelf="stretch"
        bg="aqua"
        color="light"
        disabled={selectedItems.length < 1}
        flex={1}
        fontSize={14}
        fontWeight="700"
        mb={40}
        minH={56}
        mt={8}
        mx={40}
        rounded={8}
        onPress={navToNext}
      >
        Next
      </Button>
    </Div>
  )
}
