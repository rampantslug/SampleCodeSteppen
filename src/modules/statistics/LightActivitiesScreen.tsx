import { gql, useQuery } from "@apollo/client"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { DateTime } from "luxon"
import React, { FC, memo, useCallback, useMemo, useState } from "react"
import { Pressable, RefreshControl } from "react-native"
import { Button, Div, Icon, WINDOW_WIDTH } from "react-native-magnus"
import { Circle, Svg, SvgProps } from "react-native-svg"
import { VictoryPie, VictoryBar, VictoryChart, VictoryContainer } from "victory-native"

import StatsDetailsContainer from "./components/StatsDetailsContainer"
import { steppenGraphingTheme } from "./SteppenVictoryGraphingTheme"
import StarSVG from "assets/lightActivities/exerciseAndSport/star.svg"
import HeaderActivitiesSvg from "assets/statistics/header-activities.svg"
import RunningSvg from "assets/statistics/running-icon.svg"
import { ALL_LIGHT_ACTIVITIES } from "constant/enums/lightActivities"
import minutesToDays from "helper/minutesToDays"
import { screenLibrary } from "navigation/screenLibrary"
import globalCustomisations from "theme/globalCustomisations"
import {
  Body,
  BodyHeavy,
  ExtraSmall,
  Heading1,
  Paragraph,
  ParagraphLight,
  SmallLight,
} from "theme/Typography"
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

const LIGHT_ACTIVITIES_PER_WEEK = gql`
  query userLightActivitiesPerWeek {
    userLightActivitiesPerWeek {
      week_end
      activities {
        id
        activity_type
        data
      }
    }
  }
`

const LIGHT_ACTIVITIES_PER_MONTH = gql`
  query userLightActivitiesPerMonth {
    userLightActivitiesPerMonth {
      month
      activities {
        id
        activity_type
        data
      }
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

const LightActivitiesGraph = memo(({ lightActivitiesPerDay, loadingDayData, totalMinutes }) => {
  const navigation = useNavigation()
  const [selectedOption, setSelectedOption] = useState(OPTIONS[0])
  const [graphSelectedIndex, setGraphSelectedIndex] = useState(0)
  const [isShowingMore, setIsShowingMore] = useState(false)

  const { data: journeyData, loading: loadingJourney } = useQuery(USER_IN_JOURNEY)
  const isInJourney = useMemo(() => {
    if (journeyData?.userActiveJourney && !loadingJourney) {
      return true
    }
  }, [journeyData, loadingJourney])

  const dayLightActivitiesForGraph = useMemo(() => {
    return lightActivitiesPerDay?.map((item) => ({
      x: DateTime.fromISO(item.day).weekdayShort,
      y: item.activities.length,
    }))
  }, [lightActivitiesPerDay])

  const { data: lightActivitiesPerWeekData } = useQuery(LIGHT_ACTIVITIES_PER_WEEK)
  const lightActivitiesPerWeek = useMemo(
    () => lightActivitiesPerWeekData?.userLightActivitiesPerWeek,
    [lightActivitiesPerWeekData],
  )
  const weekLightActivitiesForGraph = useMemo(() => {
    return lightActivitiesPerWeek?.map((item) => {
      const endDate = DateTime.fromISO(item.week_end)
      const dateRange = endDate.minus({ days: 6 }).day.toString() + "-" + endDate.day.toString()
      return { x: dateRange, y: item.activities.length }
    })
  }, [lightActivitiesPerWeek])

  const { data: lightActivitiesPerMonthData } = useQuery(LIGHT_ACTIVITIES_PER_MONTH)
  const lightActivitiesPerMonth = useMemo(
    () => lightActivitiesPerMonthData?.userLightActivitiesPerMonth,
    [lightActivitiesPerMonthData],
  )
  const monthLightActivitiesForGraph = useMemo(() => {
    return lightActivitiesPerMonth?.map((item) => ({
      x: DateTime.fromFormat(item.month, "yyyy-MM-dd").monthShort,
      y: item.activities.length,
    }))
  }, [lightActivitiesPerMonth])

  const activeGraphData = useMemo(() => {
    logAnalyticsEvent("light-activities-stats-period-change", { timePeriod: selectedOption.label })
    switch (selectedOption.label) {
      case "Daily":
        return dayLightActivitiesForGraph
      case "Weekly":
        return weekLightActivitiesForGraph
      case "Monthly":
        return monthLightActivitiesForGraph
      default:
        return dayLightActivitiesForGraph
    }
  }, [
    dayLightActivitiesForGraph,
    weekLightActivitiesForGraph,
    monthLightActivitiesForGraph,
    selectedOption,
  ])

  const headerText = useMemo(() => {
    if (
      lightActivitiesPerDay?.length > 0 &&
      lightActivitiesPerWeek?.length > 0 &&
      lightActivitiesPerMonth?.length > 0 &&
      graphSelectedIndex != null
    ) {
      let activeDay
      switch (selectedOption.label) {
        case "Daily":
          activeDay = DateTime.fromISO(lightActivitiesPerDay[graphSelectedIndex]?.day)
          return `${activeDay.monthShort} ${activeDay.day}`
        case "Weekly":
          activeDay = DateTime.fromISO(lightActivitiesPerWeek[graphSelectedIndex]?.week_end)
          return `${activeDay.monthShort} ${activeDay.minus({ days: 6 }).day} - ${
            activeDay.monthShort
          } ${activeDay.day}`
        case "Monthly":
          activeDay = DateTime.fromISO(lightActivitiesPerMonth[graphSelectedIndex]?.month)
          return `${activeDay.monthLong} ${activeDay.year}`
      }
    } else {
      return "No Data"
    }
  }, [
    selectedOption.label,
    lightActivitiesPerDay,
    graphSelectedIndex,
    lightActivitiesPerWeek,
    lightActivitiesPerMonth,
  ])

  const selectedDataValue = useMemo(() => {
    if (
      lightActivitiesPerDay?.length > 0 &&
      lightActivitiesPerWeek?.length > 0 &&
      lightActivitiesPerMonth?.length > 0 &&
      graphSelectedIndex != null
    ) {
      let activityCount = 0

      switch (selectedOption.label) {
        case "Daily":
          activityCount = lightActivitiesPerDay[graphSelectedIndex]?.activities.length
          break
        case "Weekly":
          activityCount = lightActivitiesPerWeek[graphSelectedIndex]?.activities.length
          break
        case "Monthly":
          activityCount = lightActivitiesPerMonth[graphSelectedIndex]?.activities.length
          break
      }
      return activityCount
    } else {
      return 0
    }
  }, [
    selectedOption.label,
    lightActivitiesPerDay,
    graphSelectedIndex,
    lightActivitiesPerWeek,
    lightActivitiesPerMonth,
  ])

  const selectedColumnDetails = useMemo(() => {
    let columnDetails: any[] = []
    if (selectedDataValue > 0) {
      let activities = []
      const groupedActivities: {
        name: any
        SVG: FC<SvgProps>
        numberOfTimes: number
        totalMinutes: any
        distance: any
      }[] = []

      switch (selectedOption.label) {
        case "Daily":
          activities = lightActivitiesPerDay[graphSelectedIndex]?.activities
          break
        case "Weekly":
          activities = lightActivitiesPerWeek[graphSelectedIndex]?.activities
          break
        case "Monthly":
          activities = lightActivitiesPerMonth[graphSelectedIndex]?.activities
          break
      }
      if (activities.length > 0) {
        activities.forEach((activity: { data: string }) => {
          const data = JSON.parse(activity?.data)
          if (data.description) {
            const actObj = JSON.parse(data.description)

            const existingActivity = groupedActivities.find((a) => a.name === actObj.activity_type)
            if (existingActivity) {
              existingActivity.totalMinutes += actObj.total_minutes
              existingActivity.numberOfTimes += 1
            } else {
              const svg =
                ALL_LIGHT_ACTIVITIES.find((i) => i.label === actObj.activity_type)?.SVG || StarSVG
              groupedActivities.push({
                name: actObj.activity_type,
                SVG: svg,
                numberOfTimes: 1,
                totalMinutes: actObj.total_minutes,
                distance: actObj.distance,
              })
            }
          }
        })

        groupedActivities.sort((a, b) => b.totalMinutes - a.totalMinutes)
        let finalGroup = groupedActivities
        if (groupedActivities.length > 3) {
          const frontPart = groupedActivities.slice(0, 2)
          const lastPart = groupedActivities.slice(2)
          const others = {
            name: "Others",
            SVG: StarSVG,
            totalMinutes: 0,
            numberOfTimes: 0,
            distance: 0,
          }
          lastPart.forEach((a) => {
            others.totalMinutes += a.totalMinutes
            others.numberOfTimes += a.numberOfTimes
          })
          finalGroup = [...frontPart, others]
        }

        columnDetails = finalGroup.map((a) => ({ ...a, time: minutesToDays(a.totalMinutes) }))
      }
    }
    return columnDetails
  }, [
    selectedOption.label,
    lightActivitiesPerDay,
    graphSelectedIndex,
    lightActivitiesPerWeek,
    lightActivitiesPerMonth,
    selectedDataValue,
  ])

  const selectedDailyDate = useMemo(() => {
    const options = {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    }
    return lightActivitiesPerDay != null
      ? DateTime.fromISO(lightActivitiesPerDay[graphSelectedIndex]?.day).toLocaleString(options)
      : null
  }, [graphSelectedIndex, lightActivitiesPerDay])

  const changeGraphMode = useCallback(
    (item) => {
      setGraphSelectedIndex(0)
      setSelectedOption(item)
      let endIndex = 0
      switch (item.label) {
        case "Daily":
          endIndex = dayLightActivitiesForGraph?.length - 1
          break
        case "Weekly":
          endIndex = weekLightActivitiesForGraph?.length - 1
          break
        case "Monthly":
          endIndex = monthLightActivitiesForGraph?.length - 1
          break
      }
      setGraphSelectedIndex(endIndex)
    },
    [dayLightActivitiesForGraph, monthLightActivitiesForGraph, weekLightActivitiesForGraph],
  )

  useFocusEffect(
    useCallback(() => {
      changeGraphMode(OPTIONS[0])
    }, [changeGraphMode]),
  )

  const navigateToFirstActivity = useCallback(() => {
    logAnalyticsEvent("stats-light-activities-first-activity-pressed")
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

  const dailyContent = useMemo(() => {
    return (
      <Div>
        <ExtraSmall color="dark3">{selectedDailyDate}</ExtraSmall>
        <Div h={8} />
        {selectedColumnDetails.length === 0 && (
          <Body color="dark2" my={2}>
            No data
          </Body>
        )}
        {selectedColumnDetails.map((activity, index) => (
          <Div key={index.toString()} row alignItems="center" justifyContent="flex-start" my={2}>
            <Body color="dark2">{activity.name}</Body>
            <Div w={8} />
            <activity.SVG style={{ aspectRatio: 1, width: 24 }} />
            <Div w={2} />
            <Icon color="dark5" fontFamily="Entypo" fontSize={22} mx={-5} name="dot-single" />
            <Div w={2} />
            <ParagraphLight color="dark3">{activity.totalMinutes} minutes</ParagraphLight>
            {activity?.distance > 0 && (
              <>
                <Div w={2} />
                <Icon color="dark5" fontFamily="Entypo" fontSize={22} mx={-5} name="dot-single" />
                <Div w={2} />
                <ParagraphLight color="dark3">{activity.distance.toString()} miles</ParagraphLight>
              </>
            )}
          </Div>
        ))}
        {(!totalMinutes || totalMinutes < 1) && !loadingDayData && (
          <Div position="absolute" right={0} top={8}>
            <Button bg="aqua100" px={16} onPress={navigateToFirstActivity}>
              Complete Your 1st Activity
            </Button>
          </Div>
        )}

        <Div h={8} />
        <Div row borderTopColor="light3" borderTopWidth={1} justifyContent="space-between">
          {dayLightActivitiesForGraph?.map((day, index) => (
            <Div key={index.toString()} alignItems="center">
              {index === graphSelectedIndex ? (
                <Icon color="dark" fontFamily="AntDesign" fontSize={8} name="caretdown" />
              ) : (
                <Div h={8} />
              )}
              <ExtraSmall color="dark4">{day.x}</ExtraSmall>
              <Pressable
                style={{ alignSelf: "center" }}
                onPress={() => setGraphSelectedIndex(index)}
              >
                {day.y > 0 ? (
                  <>
                    {index === graphSelectedIndex ? (
                      <Div
                        alignItems="center"
                        bg="aqua100"
                        h={48}
                        justifyContent="center"
                        my={6}
                        rounded="circle"
                        w={48}
                      >
                        <Icon color="light1" fontFamily="Octicons" fontSize={36} name="check" />
                      </Div>
                    ) : (
                      <Div
                        alignItems="center"
                        bg="aqua100"
                        h={36}
                        justifyContent="center"
                        my={12}
                        rounded="circle"
                        w={36}
                      >
                        <Icon color="light1" fontFamily="Octicons" fontSize={24} name="check" />
                      </Div>
                    )}
                  </>
                ) : (
                  <Div bg="light3" h={36} my={12} rounded="circle" w={36} />
                )}
              </Pressable>
            </Div>
          ))}
        </Div>
      </Div>
    )
  }, [
    dayLightActivitiesForGraph,
    graphSelectedIndex,
    loadingDayData,
    navigateToFirstActivity,
    selectedColumnDetails,
    selectedDailyDate,
    totalMinutes,
  ])

  const weeklyMonthlyContent = useMemo(() => {
    return (
      <>
        <Div row alignItems="center" justifyContent="space-between">
          <ExtraSmall color="dark3">{headerText}</ExtraSmall>
          <Button
            bg="transparent"
            color="aqua100"
            fontSize={12}
            textDecorLine="underline"
            onPress={() => setIsShowingMore(!isShowingMore)}
          >
            {isShowingMore ? "See less" : "See more"}
          </Button>
        </Div>
        <Div row alignItems="baseline">
          <Heading1>{selectedDataValue}</Heading1>
          <ParagraphLight ml={2}>activities</ParagraphLight>
        </Div>
        {isShowingMore && (
          <Div bg="light3" p={6} rounded={8}>
            {selectedColumnDetails.map((activity, index) => (
              <Div
                key={index.toString()}
                row
                alignItems="center"
                justifyContent="space-between"
                my={3}
              >
                <Div row alignItems="center">
                  <activity.SVG style={{ aspectRatio: 1, width: 20 }} />
                  <Div row alignItems="baseline">
                    <ParagraphLight color="dark2" mx={4}>
                      {activity.name}
                    </ParagraphLight>
                    <SmallLight color="dark3">{`(${activity.numberOfTimes} times)`}</SmallLight>
                  </Div>
                </Div>
                <Div row alignItems="baseline">
                  {activity.time.h > 0 && (
                    <>
                      <Body color="dark3">{activity.time.h}</Body>
                      <SmallLight color="dark3" ml={2} mr={4}>
                        hours
                      </SmallLight>
                    </>
                  )}
                  <Body color="dark3">{activity.time.m}</Body>
                  <SmallLight color="dark3" ml={2} mr={4}>
                    minutes
                  </SmallLight>
                </Div>
              </Div>
            ))}
          </Div>
        )}
        <Div h={16} />

        <VictoryChart
          containerComponent={<VictoryContainer disableContainerEvents />}
          domainPadding={{ x: 20 }}
          height={WINDOW_WIDTH * 0.5}
          padding={{ left: 40, right: 20, top: 20, bottom: 30 }}
          theme={steppenGraphingTheme}
          width={WINDOW_WIDTH - 32}
        >
          <VictoryBar
            animate={{ duration: 1000 }}
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
                              fill: globalCustomisations.colors.aqua60,
                            }),
                          }
                        },
                      },
                    ]
                  },
                },
              },
            ]}
            style={{ data: { fill: globalCustomisations.colors.aqua100 } }}
          />
        </VictoryChart>
        {(!totalMinutes || totalMinutes < 1) && (
          <Div left={32} position="absolute" top={164} w="100%">
            <Button alignSelf="center" bg="aqua100" px={16} onPress={navigateToFirstActivity}>
              Complete Your 1st Activity
            </Button>
          </Div>
        )}
      </>
    )
  }, [
    activeGraphData,
    headerText,
    isShowingMore,
    navigateToFirstActivity,
    selectedColumnDetails,
    selectedDataValue,
    totalMinutes,
  ])

  return (
    <>
      {selectedOption.label === "Daily" ? dailyContent : weeklyMonthlyContent}
      <Div h={16} />
      <Div row bg="light2" p={4} rounded={4}>
        {OPTIONS.map((item) => (
          <Button
            key={item.label}
            bg={selectedOption === item ? "aqua100" : "transparent"}
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

const LIGHT_ACTIVITIES_SUMMARY = gql`
  query userLifetimeLightActivities {
    userLifetimeLightActivities {
      light_activities_total_minutes
      light_activities_count
    }
  }
`

const TotalLightActivitiesEver = memo(({ lightActivitiesSummary }) => {
  return (
    <Div bg="aqua10" p={12} rounded={8}>
      <Div row alignItems="center">
        <Div bg="light1" p={4} rounded="circle">
          <RunningSvg
            color={globalCustomisations.colors.steppenPurple100}
            style={{ aspectRatio: 1, width: 20 }}
          />
        </Div>
        <BodyHeavy color="dark2" ml={8}>
          Total activities completed ever
        </BodyHeavy>
      </Div>
      <Div h={16} />
      {lightActivitiesSummary ? (
        <Div row alignItems="baseline">
          <Heading1 color="dark2">{lightActivitiesSummary?.light_activities_count}</Heading1>
          <ParagraphLight color="dark3" ml={2}>
            activities
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

const TotalTimeOfLightActivities = memo(({ totalLightActivitiesTimeEver }) => {
  return (
    <Div bg="steppenBlue80" p={12} rounded={8}>
      <Div row alignItems="center">
        <Div bg="light1" p={4} rounded="circle">
          <RunningSvg
            color={globalCustomisations.colors.steppenBlue100}
            style={{ aspectRatio: 1, width: 20 }}
          />
        </Div>
        <BodyHeavy color="light1" ml={8}>
          Total time spent on light activities
        </BodyHeavy>
      </Div>
      <Div h={16} />
      <Div row alignItems="baseline">
        {totalLightActivitiesTimeEver.m ? (
          <>
            {totalLightActivitiesTimeEver.d > 0 && (
              <>
                <Heading1 color="light1">{totalLightActivitiesTimeEver.d}</Heading1>
                <ParagraphLight color="light1" ml={2} mr={4}>
                  days
                </ParagraphLight>
              </>
            )}
            {totalLightActivitiesTimeEver.h > 0 && (
              <>
                <Heading1 color="light1">{totalLightActivitiesTimeEver.h}</Heading1>
                <ParagraphLight color="light1" ml={2} mr={4}>
                  hours
                </ParagraphLight>
              </>
            )}
            <Heading1 color="light1">{totalLightActivitiesTimeEver.m}</Heading1>
            <ParagraphLight color="light1" ml={2} mr={4}>
              minutes
            </ParagraphLight>
          </>
        ) : (
          <ParagraphLight color="light1" ml={2}>
            No data
          </ParagraphLight>
        )}
      </Div>
    </Div>
  )
})

const LIGHT_ACTIVITIES_MOST_COMPLETED = gql`
  query userMostCompletedLightActivities {
    userMostCompletedLightActivities {
      name
      completions
    }
  }
`

const PIE_COLORS = ["#328FFF", "#4BD6BF", "#9D94F4", "#FFC466"]

const MostCompletedPieChart = memo(() => {
  const { data: lightActivitiesMostCompletedData } = useQuery(LIGHT_ACTIVITIES_MOST_COMPLETED)
  const lightActivitiesMostCompleted = useMemo(
    () => lightActivitiesMostCompletedData?.userMostCompletedLightActivities || [],
    [lightActivitiesMostCompletedData],
  )

  return (
    <Div bg="steppenYellow20" p={12} rounded={8}>
      <Div row alignItems="center">
        <Div bg="steppenYellow100" p={4} rounded="circle">
          <RunningSvg
            color={globalCustomisations.colors.light1}
            style={{ aspectRatio: 1, width: 20 }}
          />
        </Div>
        <Body color="dark2" ml={8}>
          Your most completed light activities
        </Body>
      </Div>
      <Div h={16} />
      <Div row alignItems="center">
        <Svg height={150} width={150}>
          <Circle cx={75} cy={75} fill="transparent" r={42} stroke="#999999" strokeWidth={0.25} />
          <Circle cx={75} cy={75} fill="transparent" r={73} stroke="#999999" strokeWidth={0.25} />
          {lightActivitiesMostCompleted.length === 0 && (
            <Circle cx={75} cy={75} fill="transparent" r={58} stroke="#FFEDCF" strokeWidth={16} />
          )}
          <VictoryPie
            colorScale={PIE_COLORS}
            cornerRadius={2}
            data={lightActivitiesMostCompleted}
            endAngle={390}
            height={150}
            innerRadius={48}
            labels={() => null}
            radius={66}
            standalone={false}
            startAngle={30}
            width={150}
            x="name"
            y="completions"
          />
        </Svg>
        <Div w={16} />
        {lightActivitiesMostCompleted.length === 0 && (
          <ParagraphLight color="dark2" ml={32}>
            No data
          </ParagraphLight>
        )}
        <Div flex={1}>
          {lightActivitiesMostCompleted?.map((item, index) => (
            <Div
              key={index}
              row
              alignItems="center"
              alignSelf="stretch"
              justifyContent="space-between"
            >
              <Div row alignItems="center">
                <Div bg={PIE_COLORS[index]} h={12} p={4} rounded={4} w={12} />
                <Paragraph color="dark2" ml={8}>
                  {item.name}
                </Paragraph>
              </Div>
              <SmallLight color="dark3">{item.completions}</SmallLight>
            </Div>
          ))}
        </Div>
      </Div>
    </Div>
  )
})

const LIGHT_ACTIVITIES_PER_DAY = gql`
  query userLightActivitiesPerDay {
    userLightActivitiesPerDay {
      day
      activities {
        id
        activity_type
        data
      }
    }
  }
`

const LightActivitiesScreen = () => {
  const { data: lightActivitiesSummaryData, refetch: refetchCompletions } =
    useQuery(LIGHT_ACTIVITIES_SUMMARY)
  const lightActivitiesSummary = useMemo(
    () => lightActivitiesSummaryData?.userLifetimeLightActivities,
    [lightActivitiesSummaryData],
  )

  const totalLightActivitiesTimeEver = useMemo(
    () => minutesToDays(lightActivitiesSummary?.light_activities_total_minutes),
    [lightActivitiesSummary],
  )

  const {
    data: lightActivitiesPerDayData,
    loading: loadingDayData,
    refetch: refetchDayData,
  } = useQuery(LIGHT_ACTIVITIES_PER_DAY)
  const lightActivitiesPerDay = useMemo(
    () => lightActivitiesPerDayData?.userLightActivitiesPerDay,
    [lightActivitiesPerDayData],
  )

  const onRefresh = useCallback(() => {
    refetchCompletions()
    refetchDayData()
  }, [refetchCompletions, refetchDayData])

  return (
    <StatsDetailsContainer
      Background={HeaderActivitiesSvg}
      backgroundColor="steppenPurple40"
      refreshControl={<RefreshControl refreshing={!!loadingDayData} onRefresh={onRefresh} />}
      title="Light Activity"
    >
      <LightActivitiesGraph
        lightActivitiesPerDay={lightActivitiesPerDay}
        loadingDayData={loadingDayData}
        totalMinutes={lightActivitiesSummary?.light_activities_total_minutes}
      />

      <Div h={32} />

      <Heading1 color="dark2">Highlights</Heading1>

      <Div h={16} />

      <TotalLightActivitiesEver lightActivitiesSummary={lightActivitiesSummary} />

      <Div h={16} />

      <TotalTimeOfLightActivities totalLightActivitiesTimeEver={totalLightActivitiesTimeEver} />

      <Div h={16} />

      <MostCompletedPieChart />
    </StatsDetailsContainer>
  )
}

export default memo(LightActivitiesScreen)
