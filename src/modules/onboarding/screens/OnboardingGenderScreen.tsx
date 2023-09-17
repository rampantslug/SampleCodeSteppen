import { gql, useMutation, useQuery } from "@apollo/client"
import React, { useCallback, useMemo, useState } from "react"
import { Div } from "react-native-magnus"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import GenderFemaleSvg from "assets/icon/colored/gender-female.svg"
import GenderMaleSvg from "assets/icon/colored/gender-male.svg"
import GenderUnspecifiedSvg from "assets/icon/colored/gender-unspecified.svg"
import StarSvg from "assets/icon/colored/star.svg"
import { FormProgress } from "designLibrary/form/FormProgress"
import { SelectButtonWithIconAndCheckbox } from "designLibrary/SelectButtonWithIconAndCheckbox"
import logAnalyticsEvent from "helper/logAnalyticsEvent"
import { useOnboardingProgress } from "modules/onboarding/useOnboardingProgress"
import { Body, Heading1 } from "theme/Typography"

const UPDATE_USER_GENDER = gql`
  mutation updateCurrentUser($gender: Int!) {
    updateCurrentUser(data: { addMemberOnboardingProgress: "gender", gender: $gender }) {
      id
    }
  }
`

const genders = [
  {
    icon: <GenderFemaleSvg aspectRatio={1} width={24} />,
    label: "Female",
    value: 1,
  },
  {
    icon: <GenderMaleSvg aspectRatio={1} width={24} />,
    label: "Male",
    value: 0,
  },
  {
    icon: <StarSvg aspectRatio={1} width={24} />,
    label: "Other",
    value: 2,
  },
  {
    icon: <GenderUnspecifiedSvg aspectRatio={1} width={24} />,
    label: "Prefer not to say",
    value: 3,
  },
]

export const OnboardingGenderScreen = () => {
  const insets = useSafeAreaInsets()
  const [selectedItem, setSelectedItem] = useState()

  const { gotoNextRoute } = useOnboardingProgress("gender")

  const [updateGender] = useMutation(UPDATE_USER_GENDER)

  const selectGender = useCallback(
    async (item) => {
      setSelectedItem(item)

      updateGender({
        variables: {
          gender: item.value,
        },
      })
      logAnalyticsEvent("onboarding-gender", { gender: item.label })
      gotoNextRoute()
    },
    [gotoNextRoute, updateGender],
  )

  return (
    <Div bg="light" flex={1} pt={insets.top}>
      <FormProgress currentFormIndex={0} totalFormPages={2} />
      <Heading1 color="dark2" mt={64} mx={16}>
        How do you identify?
      </Heading1>
      <Body color="dark2" mt={8} mx={16}>
        At times, we'll provide gender specific recommendations
      </Body>
      <Div mx={16} my={32}>
        {genders.map((item, index) => (
          <SelectButtonWithIconAndCheckbox
            key={item.label}
            icon={item.icon}
            index={index}
            isSelected={selectedItem === item}
            text={item.label}
            onToggle={() => selectGender(item)}
          />
        ))}
      </Div>
    </Div>
  )
}
