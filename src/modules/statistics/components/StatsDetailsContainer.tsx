import { useNavigation } from "@react-navigation/native"
import React, { memo } from "react"
import { Pressable } from "react-native"
import { ScrollView } from "react-native-gesture-handler"
import { Div, Icon } from "react-native-magnus"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { BodyHeavy } from "theme/Typography"

const StatsDetailsContainer = ({
  title,
  Background,
  backgroundColor = "dark2",
  children,
  refreshControl,
}) => {
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()

  return (
    <Div flex={1}>
      <ScrollView refreshControl={refreshControl}>
        <Background style={{ aspectRatio: 375 / 270, width: "100%", position: "absolute" }} />

        <Div row flex={1} justifyContent="center" mt={insets.top} pt={4}>
          <BodyHeavy color="light1" textAlign="center">
            {title}
          </BodyHeavy>
        </Div>

        <Div bg="light1" flex={1} mt={136} pb={32} pt={32} px={16} roundedTop={32}>
          {children}
        </Div>
      </ScrollView>

      <Div
        alignItems="center"
        bg={backgroundColor}
        h={36}
        justifyContent="center"
        left={8}
        position="absolute"
        rounded="circle"
        top={insets.top}
        w={36}
      >
        <Pressable onPress={() => navigation.goBack()}>
          <Icon color="light1" fontFamily="AntDesign" fontSize="4xl" name="arrowleft" />
        </Pressable>
      </Div>
    </Div>
  )
}

export default memo(StatsDetailsContainer)
