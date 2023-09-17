import React, { useCallback } from "react"
import { Button, Div } from "react-native-magnus"

import { Small } from "theme/Typography"

export const LeftAlignedIconButton = ({
  bordercolor,
  borderWidth = 0,
  onSelect,
  text,
  icon,
  subText,
}) => {
  const handleSelect = useCallback(() => {
    if (typeof onSelect === "function") onSelect()
  }, [onSelect])

  return (
    <Button
      alignSelf="stretch"
      bg="light1"
      borderColor={bordercolor}
      borderWidth={borderWidth}
      mb={16}
      minH={56}
      px={16}
      rounded={8}
      onPress={handleSelect}
    >
      <Div row alignItems="center" justifyContent="space-between">
        <Div row alignItems="center" flex={1} justifyContent="flex-start">
          {icon}
          <Div flex={1}>
            <Small color="dark3" fontWeight="600" ml={16}>
              {text}
            </Small>
            {subText && (
              <Small color="dark4" fontWeight="500" ml={16}>
                {subText}
              </Small>
            )}
          </Div>
        </Div>
      </Div>
    </Button>
  )
}
