import React, { useCallback, useRef, useState } from "react"
import { TouchableOpacity, RefreshControl, ScrollView } from "react-native"
import { Div } from "react-native-magnus"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import ProgressPage from "./ProgressPage"
import ActivityStatistics from "../statistics/ActivityStatistics"
import CharacterRunning from "assets/statistics/character-running.svg"
import CharacterSitting from "assets/statistics/character-sitting.svg"
import { logAnalyticsEvent } from "helper/logAnalyticsEvent"
import globalCustomisations from "theme/globalCustomisations"
import { Body, Heading1 } from "theme/Typography"

const { baseMargin } = globalCustomisations.spacing

const OPTIONS = [
  {
    label: "Stats",
    headerText: "Your Statistics",
    headerBackground: <CharacterRunning style={{ aspectRatio: 147 / 122, width: 147 }} />,
  },
  {
    label: "Progress",
    headerText: "Your Progress",
    headerBackground: <CharacterSitting style={{ aspectRatio: 147 / 115, width: 147 }} />,
  },
]

const StatsProgressScreen = () => {
  const { top } = useSafeAreaInsets()
  const [selectedOption, setSelectedOption] = useState(OPTIONS[0])
  const [loadingStats, setLoadingStats] = useState(false)

  const activityStatsRef = useRef<any>(null)

  const selectOption = useCallback((item) => {
    logAnalyticsEvent("choose-progress-option", { option: item.label })
    setSelectedOption(item)
  }, [])

  const onRefresh = useCallback(() => {
    activityStatsRef?.current?.refetchData()
  }, [activityStatsRef])

  return (
    <Div bg="light1" flex={1}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={!!loadingStats} onRefresh={onRefresh} />}
      >
        <Div row alignItems="center" mb={8} pt={top}>
          <Div flex={1} mt={32}>
            <Heading1 mx={16}>{selectedOption.headerText}</Heading1>
            <Div h={16} />

            <Div row>
              {OPTIONS.map((item) => (
                <Div
                  key={item.label}
                  alignItems="center"
                  alignSelf="flex-start"
                  bg={item === selectedOption ? "aqua" : "light1"}
                  h={36}
                  justifyContent="center"
                  mb={baseMargin}
                  ml={baseMargin}
                  px={baseMargin}
                  py={4}
                  rounded={18}
                >
                  <TouchableOpacity onPress={() => selectOption(item)}>
                    <Body color={item === selectedOption ? "light1" : "light4"}>{item.label}</Body>
                  </TouchableOpacity>
                </Div>
              ))}
            </Div>
          </Div>
          {selectedOption.headerBackground}
        </Div>

        {selectedOption.label === "Stats" ? (
          <ActivityStatistics ref={activityStatsRef} setLoadingStats={setLoadingStats} />
        ) : (
          <ProgressPage />
        )}
      </ScrollView>
    </Div>
  )
}

export default StatsProgressScreen
