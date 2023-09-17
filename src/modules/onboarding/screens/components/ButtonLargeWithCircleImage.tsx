import React, { useCallback } from "react"
import { Pressable } from "react-native"
import { Div } from "react-native-magnus"

import { Paragraph } from "theme/Typography"

export const ButtonLargeWithCircleImage = ({
  backgroundColor,
  onSelect,
  text,
  image,
  width = 168,
}) => {
  const handleSelect = useCallback(() => {
    if (typeof onSelect === "function") onSelect()
  }, [onSelect])

  return (
    <Pressable
      style={{
        backgroundColor,
        borderRadius: 8,
        width,
        height: 120,
        marginHorizontal: 4,
        marginVertical: 6,
      }}
      onPress={handleSelect}
    >
      <Div bottom={0} position="absolute" right={0} style={{ aspectRatio: 1 }} w="50%">
        {image}
      </Div>
      <Paragraph color="light" ml={16} mt={12} w="75%">
        {text}
      </Paragraph>
    </Pressable>
  )
}
