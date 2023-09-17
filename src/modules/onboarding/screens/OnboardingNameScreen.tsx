import { gql, useMutation } from "@apollo/client"
import React, { useCallback, useState } from "react"
import { Pressable, TextInput } from "react-native"
import { Button, Div } from "react-native-magnus"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import linkWithFallback from "helper/linkWithFallback"
import { useOnboardingProgress } from "modules/onboarding/useOnboardingProgress"
import { Heading1, Heading2, Small } from "theme/Typography"

const UPDATE_USER_NAME = gql`
  mutation updateCurrentUser($fullname: String!) {
    updateCurrentUser(data: { addMemberOnboardingProgress: "name", fullname: $fullname }) {
      id
    }
  }
`

export const OnboardingNameScreen = () => {
  const insets = useSafeAreaInsets()
  const [name, setName] = useState("")

  const { gotoNextRoute } = useOnboardingProgress("name")

  const [updateName] = useMutation(UPDATE_USER_NAME)

  const navToNext = useCallback(async () => {
    updateName({
      variables: {
        fullname: name.toString(),
      },
    })
    gotoNextRoute()
  }, [gotoNextRoute, name, updateName])

  const doLinkToTerms = useCallback(() => {
    linkWithFallback(
      "https://steppen.notion.site/App-Data-Privacy-d6ab8cfe50ec450a9ed8284ae6fb2321",
    )
  }, [])

  return (
    <Div bg="aqua" flex={1} justifyContent="center" pt={insets.top}>
      <Heading1 color="light" mt={64} mx={16}>
        Tell us about yourself
      </Heading1>
      <Heading2 color="light" fontWeight="500" mt={8} mx={16}>
        My first name is...
      </Heading2>
      <TextInput
        autoCapitalize="words"
        autoComplete="given-name"
        autoFocus={true}
        color="white"
        inputMode="text"
        keyboardType="default"
        placeholder="Enter your name"
        placeholderTextColor="#fff8"
        returnKeyType="done"
        style={{
          fontSize: 20,
          fontWeight: "500",
          marginHorizontal: 16,
          paddingVertical: 12,
        }}
        textContentType="givenName"
        value={name}
        onChangeText={setName}
      />

      <Div flex={1} justifyContent="flex-start" py={64}>
        <Button
          alignSelf="stretch"
          bg="light"
          color="aqua"
          disabled={!name}
          fontSize={14}
          fontWeight="700"
          minH={56}
          mx={40}
          rounded={8}
          onPress={navToNext}
        >
          Continue
        </Button>

        <Div h={16} />

        <Pressable onPress={doLinkToTerms}>
          <Div row px="baseMargin" w="100%">
            <Small color="light">By pressing Continue I agree to the </Small>
            <Small color="light" textDecorLine="underline">
              terms and conditions
            </Small>
            <Small color="light">.</Small>
          </Div>
        </Pressable>
      </Div>
    </Div>
  )
}
