import React, { forwardRef, useState } from "react"
import { Button, Div, Icon } from "react-native-magnus"

import { Paragraph } from "theme/Typography"

export const OnBoardingRadioGroup = forwardRef(
  ({ h = 100, w = 100, fontSize = 14, fontWeight = "600", mx = 8, options, onSelect }, ref) => {
    const [userOption, setUserOption] = useState(options[0].value)

    if (ref) {
      ref.current = {
        selectNone: () => setUserOption(null),
      }
    }

    const selectHandler = (value) => {
      onSelect(value)
      setUserOption(value)
    }

    return (
      <>
        {options.map((item) => {
          return (
            <Button
              key={item.value}
              bg={
                item.value === userOption && item.backgroundSvg
                  ? "#C4BFFB"
                  : item.value === userOption
                  ? "#ECEBFF"
                  : "white"
              }
              borderColor={item.value === userOption ? "#8B80F8" : "#dedede"}
              borderWidth={1}
              color="dark2"
              flex={1}
              h={h}
              minW={w}
              mx={mx}
              my={8}
              rounded={10}
              onPress={() => selectHandler(item.value)}
            >
              {item.backgroundSvg && (
                <item.backgroundSvg
                  aspectRatio={1}
                  color={item.value === userOption ? "#8B80F8" : "#A79FF9"}
                  position="absolute"
                  top={item.svgTop}
                  width={116}
                />
              )}
              <Div alignItems="center">
                {item.iconName && (
                  <Icon
                    color={item.value === userOption ? "#8B80F8" : "dark2"}
                    fontFamily="Ionicons"
                    fontSize={36}
                    name={item.iconName}
                  />
                )}
                <Paragraph
                  color={
                    item.value === userOption && item.backgroundSvg
                      ? "white"
                      : item.value === userOption
                      ? "#8B80F8"
                      : "dark2"
                  }
                  fontSize={fontSize}
                  fontWeight={fontWeight}
                  textAlign="center"
                >
                  {item.text}
                </Paragraph>
              </Div>
            </Button>
          )
        })}
      </>
    )
  },
)
