import { gql, useQuery } from "@apollo/client"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { DateTime } from "luxon"
import React, { memo, useCallback, useMemo, useState } from "react"
import { Button, Div, WINDOW_WIDTH } from "react-native-magnus"
import { VictoryBar, VictoryChart, VictoryContainer } from "victory-native"

import { CALORIES_BURNT_FACTS } from "./CaloriesBurntFacts"
import StatsDetailsContainer from "./components/StatsDetailsContainer"
import { steppenGraphingTheme } from "./SteppenVictoryGraphingTheme"
import FireIcon from "assets/statistics/fire-icon.svg"
import HeaderCaloriesSvg from "assets/statistics/header-calories.svg"
import minutesToDays from "helper/minutesToDays"
import pluralize from "helper/pluralize"
import { screenLibrary } from "navigation/screenLibrary"
import globalCustomisations from "theme/globalCustomisations"
import { BodyHeavy, ExtraSmall, Heading1, ParagraphLight } from "theme/Typography"
import logAnalyticsEvent from "helper/logAnalyticsEvent"

const USER_IN_JOURNEY = gql`
  query getUserActiveJourney {
    userActiveJourney {
      id
      journey_id
      title
      started_at
    }
  }
`

const CALORIES_PER_DAY = gql`
  query userSumCaloriesPerDay {
    userSumCaloriesPerDay {
      day
      calories
    }
  }
`

const CALORIES_PER_WEEK = gql`
  query userSumCaloriesPerWeek {
    userSumCaloriesPerWeek {
      week_end
      calories
    }
  }
`

const CALORIES_PER_MONTH = gql`
  query userSumCaloriesPerMonth {
    userSumCaloriesPerMonth {
      month
      calories
    }
  }
`

const OPTIONS = [
  {
    label: "Daily",
  },
  {
    label: "Weekly",
  },
  {
    label: "Monthly",
  },
]

const CaloriesGraph = memo(({ allCaloriesEver }) => {
  const navigation = useNavigation()
  const [selectedOption, setSelectedOption] = useState(OPTIONS[0])
  const [graphSelectedIndex, setGraphSelectedIndex] = useState(0)

  const { data: journeyData, loading: loadingJourney } = useQuery(USER_IN_JOURNEY)
  const isInJourney = useMemo(() => {
    if (journeyData?.userActiveJourney && !loadingJourney) {
      return true
    }
  }, [journeyData, loadingJourney])

  const { data: caloriesPerDayData, loading: loadingCalories } = useQuery(CALORIES_PER_DAY)
  const caloriesPerDay = useMemo(
    () => caloriesPerDayData?.userSumCaloriesPerDay,
    [caloriesPerDayData],
  )
  const dayCaloriesForGraph = useMemo(() => {
    return caloriesPerDay?.map((item) => ({
      x: DateTime.fromISO(item.day).weekdayShort,
      y: item.calories,
    }))
  }, [caloriesPerDay])

  const { data: caloriesPerWeekData } = useQuery(CALORIES_PER_WEEK)
  const caloriesPerWeek = useMemo(
    () => caloriesPerWeekData?.userSumCaloriesPerWeek,
    [caloriesPerWeekData],
  )
  const weekCaloriesForGraph = useMemo(() => {
    return caloriesPerWeek?.map((item) => {
      const endDate = DateTime.fromISO(item.week_end)
      const dateRange = endDate.minus({ days: 6 }).day.toString() + "-" + endDate.day.toString()
      return { x: dateRange, y: item.calories }
    })
  }, [caloriesPerWeek])

  const { data: caloriesPerMonthData } = useQuery(CALORIES_PER_MONTH)
  const caloriesPerMonth = useMemo(
    () => caloriesPerMonthData?.userSumCaloriesPerMonth,
    [caloriesPerMonthData],
  )
  const monthCaloriesForGraph = useMemo(() => {
    return caloriesPerMonth?.map((item) => ({
      x: DateTime.fromFormat(item.month, "yyyy-MM-dd").monthShort,
      y: item.calories,
    }))
  }, [caloriesPerMonth])

  const activeGraphData = useMemo(() => {
    logAnalyticsEvent("calories-stats-period-change", { timePeriod: selectedOption.label })
    switch (selectedOption.label) {
      case "Daily":
        return dayCaloriesForGraph
      case "Weekly":
        return weekCaloriesForGraph
      case "Monthly":
        return monthCaloriesForGraph
      default:
        return dayCaloriesForGraph
    }
  }, [dayCaloriesForGraph, weekCaloriesForGraph, monthCaloriesForGraph, selectedOption])

  const headerText = useMemo(() => {
    if (
      caloriesPerDay?.length &&
      caloriesPerWeek?.length &&
      caloriesPerMonth?.length &&
      graphSelectedIndex != null
    ) {
      let activeDay
      switch (selectedOption.label) {
        case "Daily":
          activeDay = DateTime.fromISO(caloriesPerDay[graphSelectedIndex]?.day)
          return `${activeDay.monthShort} ${activeDay.day}`
        case "Weekly":
          activeDay = DateTime.fromISO(caloriesPerWeek[graphSelectedIndex]?.week_end)
          return `${activeDay.monthShort} ${activeDay.minus({ days: 6 }).day} - ${
            activeDay.monthShort
          } ${activeDay.day}`
        case "Monthly":
          activeDay = DateTime.fromISO(caloriesPerMonth[graphSelectedIndex]?.month)
          return `${activeDay.monthLong} ${activeDay.year}`
      }
    } else {
      return "No Data"
    }
  }, [selectedOption.label, caloriesPerDay, graphSelectedIndex, caloriesPerWeek, caloriesPerMonth])

  const selectedDataValue = useMemo(() => {
    if (
      caloriesPerDay?.length &&
      caloriesPerWeek?.length &&
      caloriesPerMonth?.length &&
      graphSelectedIndex != null
    ) {
      let calories = 0

      switch (selectedOption.label) {
        case "Daily":
          calories = caloriesPerDay[graphSelectedIndex]?.calories
          break
        case "Weekly":
          calories = caloriesPerWeek[graphSelectedIndex]?.calories
          break
        case "Monthly":
          calories = caloriesPerMonth[graphSelectedIndex]?.calories
          break
      }
      return calories || 0
    } else {
      return 0
    }
  }, [selectedOption.label, caloriesPerDay, graphSelectedIndex, caloriesPerWeek, caloriesPerMonth])

  const changeGraphMode = useCallback(
    (item) => {
      setGraphSelectedIndex(0)
      setSelectedOption(item)
      let endIndex = 0
      switch (item.label) {
        case "Daily":
          endIndex = dayCaloriesForGraph?.length - 1
          break
        case "Weekly":
          endIndex = weekCaloriesForGraph?.length - 1
          break
        case "Monthly":
          endIndex = monthCaloriesForGraph?.length - 1
          break
      }
      setGraphSelectedIndex(endIndex)
    },
    [dayCaloriesForGraph, monthCaloriesForGraph, weekCaloriesForGraph],
  )

  useFocusEffect(
    useCallback(() => {
      changeGraphMode(OPTIONS[0])
    }, [changeGraphMode]),
  )

  const navigateToFirstActivity = useCallback(() => {
    logAnalyticsEvent("stats-calories-first-activity-pressed")
    if (isInJourney) {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: screenLibrary.tabroot,
            state: {
              index: 0,
              routes: [{ name: screenLibrary.tabs.myJourney }],
            },
          },
        ],
      })
    } else {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: screenLibrary.tabroot,
            state: {
              index: 0,
              routes: [{ name: screenLibrary.tabs.calendar }],
            },
          },
        ],
      })
    }
  }, [isInJourney, navigation])

  return (
    <>
      <ExtraSmall color="dark3">{headerText}</ExtraSmall>
      <Div row alignItems="baseline">
        <Heading1>{selectedDataValue.toLocaleString()}</Heading1>
        <ParagraphLight ml={2}>calories</ParagraphLight>
      </Div>
      <VictoryChart
        containerComponent={<VictoryContainer disableContainerEvents />}
        domainPadding={{ x: 20 }}
        height={WINDOW_WIDTH * 0.5}
        padding={{ left: 40, right: 20, top: 20, bottom: 30 }}
        theme={steppenGraphingTheme}
        width={WINDOW_WIDTH - 32}
      >
        <VictoryBar
          animate={{ duration: 500 }}
          barWidth={32}
          data={activeGraphData}
          events={[
            {
              target: "data",
              eventHandlers: {
                onPressIn: (_event, _data) => {
                  return [
                    {
                      eventKey: "all",
                      mutation: () => null,
                    },
                    {
                      mutation: (props) => {
                        setGraphSelectedIndex(props.index)
                        return {
                          style: Object.assign({}, props.style, {
                            fill: globalCustomisations.colors.steppenPurple40,
                          }),
                        }
                      },
                    },
                  ]
                },
              },
            },
          ]}
          style={{ data: { fill: globalCustomisations.colors.steppenPurple100 } }}
        />
      </VictoryChart>
      {(!allCaloriesEver || allCaloriesEver < 1) && !loadingCalories && (
        <Div left={32} position="absolute" top={128} w="100%">
          <Button alignSelf="center" bg="aqua100" px={48} onPress={navigateToFirstActivity}>
            Get Moving!
          </Button>
        </Div>
      )}
      <Div h={16} />

      <Div row bg="light2" p={4} rounded={4}>
        {OPTIONS.map((item) => (
          <Button
            key={item.label}
            bg={selectedOption === item ? "steppenPurple100" : "transparent"}
            color={selectedOption === item ? "light1" : "dark5"}
            flex={1}
            py={8}
            onPress={() => changeGraphMode(item)}
          >
            {item.label}
          </Button>
        ))}
      </Div>
    </>
  )
})

const AverageCaloriesPerActivity = memo(({ averageCaloriesPerAct }) => {
  return (
    <Div bg="steppenPurple20" p={12} rounded={8}>
      <Div row alignItems="center">
        <Div bg="light1" p={4} rounded="circle">
          <FireIcon
            color={globalCustomisations.colors.steppenYellow100}
            style={{ aspectRatio: 1, width: 20 }}
          />
        </Div>
        <BodyHeavy color="dark2" ml={8}>
          Average calories a session
        </BodyHeavy>
      </Div>
      <Div h={16} />
      {averageCaloriesPerAct > 0 ? (
        <Div row alignItems="baseline">
          <Heading1 color="dark2">{averageCaloriesPerAct.toLocaleString()}</Heading1>
          <ParagraphLight color="dark3" ml={2}>
            kCal
          </ParagraphLight>
        </Div>
      ) : (
        <ParagraphLight color="dark2" ml={2}>
          No data
        </ParagraphLight>
      )}
    </Div>
  )
})

const TotalCaloriesEver = memo(({ allCaloriesEver }) => {
  const randomCalorieFact = useMemo(() => {
    const index = Math.floor(Math.random() * CALORIES_BURNT_FACTS.length)
    return CALORIES_BURNT_FACTS[index]
  }, [])

  const calorieFactDescription = useMemo(() => {
    const duration = minutesToDays(allCaloriesEver / randomCalorieFact.caloriesBurntPerMinute)
    const days = duration.d > 0 ? pluralize(duration.d, "day") + " " : ""
    const hours = duration.h > 0 ? pluralize(duration.h, "hour") + " " : ""
    const minutes = duration.m > 0 ? pluralize(duration.m, "minute") + " " : ""
    return `${randomCalorieFact.description} ${days}${hours}${minutes}straight`
  }, [allCaloriesEver, randomCalorieFact])

  return (
    <Div bg="steppenYellow20" overflow="hidden" p={12} rounded={8}>
      <Div
        bg="steppenYellow40"
        h={170}
        position="absolute"
        right={-50}
        rounded="circle"
        top={-90}
        w={170}
      />
      {allCaloriesEver > 0 && (
        <Div position="absolute" right={24} top={8} w={80}>
          {randomCalorieFact.image}
        </Div>
      )}
      <Div row alignItems="center">
        <Div bg="steppenYellow100" p={4} rounded="circle">
          <FireIcon
            color={globalCustomisations.colors.light1}
            style={{ aspectRatio: 1, width: 20 }}
          />
        </Div>
        <BodyHeavy color="dark2" ml={8}>
          Total calories
        </BodyHeavy>
      </Div>
      <Div h={32} />
      {allCaloriesEver > 0 ? (
        <>
          <Div row alignItems="baseline">
            <Heading1 color="dark2">{allCaloriesEver.toLocaleString()}</Heading1>
            <ParagraphLight color="dark2" ml={2}>
              kCal
            </ParagraphLight>
          </Div>
          <ParagraphLight color="dark4" ml={2}>
            {calorieFactDescription}
          </ParagraphLight>
        </>
      ) : (
        <ParagraphLight color="dark2">No data</ParagraphLight>
      )}
    </Div>
  )
})

const CALORIES_ALL_TIME = gql`
  query userLifetimeCalories {
    userLifetimeCalories {
      average_calories_per_activity
      all_activities_calories
    }
  }
`

const CaloriesScreen = () => {
  const { data: caloriesAllTimeData } = useQuery(CALORIES_ALL_TIME)
  const caloriesAllTime = useMemo(
    () => caloriesAllTimeData?.userLifetimeCalories,
    [caloriesAllTimeData],
  )

  return (
    <StatsDetailsContainer
      Background={HeaderCaloriesSvg}
      backgroundColor="steppenPurple80"
      title="Calories"
    >
      <CaloriesGraph allCaloriesEver={caloriesAllTime?.all_activities_calories} />

      <Div h={32} />

      <Heading1 color="dark2">Highlights</Heading1>

      <Div h={16} />

      <AverageCaloriesPerActivity
        averageCaloriesPerAct={caloriesAllTime?.average_calories_per_activity}
      />

      <Div h={16} />

      <TotalCaloriesEver allCaloriesEver={caloriesAllTime?.all_activities_calories} />
    </StatsDetailsContainer>
  )
}

export default memo(CaloriesScreen)
