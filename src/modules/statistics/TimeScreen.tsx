import { gql, useQuery } from "@apollo/client"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
import { DateTime } from "luxon"
import React, { memo, useCallback, useMemo, useState } from "react"
import { Button, Div, WINDOW_WIDTH } from "react-native-magnus"
import { VictoryBar, VictoryChart, VictoryContainer } from "victory-native"

import StatsDetailsContainer from "./components/StatsDetailsContainer"
import { steppenGraphingTheme } from "./SteppenVictoryGraphingTheme"
import ChronoOutlineSvg from "assets/statistics/chrono-main100.svg"
import FitnessSvg from "assets/statistics/fitness.svg"
import HeaderTimeSvg from "assets/statistics/header-time.svg"
import StopwatchIconColorFlip from "assets/statistics/stopwatch-icon-color-flip.svg"
import StopwatchIcon from "assets/statistics/stopwatch-icon.svg"
import WhenMiddaySvg from "assets/statistics/when-midday.svg"
import WhenMorningSvg from "assets/statistics/when-morning.svg"
import WhenNightSvg from "assets/statistics/when-night.svg"
import WhenNoDataSvg from "assets/statistics/when-no-data.svg"
import { ProgressRing } from "component/general/ProgressRing"
import minutesToDays from "helper/minutesToDays"
import { screenLibrary } from "navigation/screenLibrary"
import globalCustomisations from "theme/globalCustomisations"
import {
  BodyHeavy,
  ExtraSmall,
  Heading1,
  Heading3,
  Paragraph,
  ParagraphHeavy,
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

const ACTIVITY_TIME_PER_DAY = gql`
  query userSumActivitiesTimePerDay {
    userSumActivitiesTimePerDay {
      day
      time_minutes
    }
  }
`

const ACTIVITY_TIME_PER_MONTH = gql`
  query userSumActivitiesTimePerMonth {
    userSumActivitiesTimePerMonth {
      month
      time_minutes
    }
  }
`

const OPTIONS = [
  {
    label: "Daily",
    suggested: 30,
    suggestedUnits: "Minutes",
  },
  {
    label: "Weekly",
    suggested: 2.5,
    suggestedUnits: "Hours",
  },
  {
    label: "Monthly",
    suggested: 10,
    suggestedUnits: "Hours",
  },
]

const ActivitiesOverTimeGraph = memo(({ activityTimePerWeek, totalMinutes }) => {
  const navigation = useNavigation()
  const [selectedOption, setSelectedOption] = useState(OPTIONS[0])
  const [graphSelectedIndex, setGraphSelectedIndex] = useState(0)

  const { data: journeyData, loading: loadingJourney } = useQuery(USER_IN_JOURNEY)
  const isInJourney = useMemo(() => {
    if (journeyData?.userActiveJourney && !loadingJourney) {
      return true
    }
  }, [journeyData, loadingJourney])

  const { data: activityTimePerDayData, loading: loadingActivity } = useQuery(ACTIVITY_TIME_PER_DAY)
  const activityTimePerDay = useMemo(
    () => activityTimePerDayData?.userSumActivitiesTimePerDay,
    [activityTimePerDayData],
  )
  const dayActivityForGraph = useMemo(() => {
    return activityTimePerDay?.map((item) => ({
      x: DateTime.fromISO(item.day).weekdayShort,
      y: item.time_minutes,
    }))
  }, [activityTimePerDay])

  const weekActivityForGraph = useMemo(() => {
    return activityTimePerWeek?.map((item) => {
      const endDate = DateTime.fromISO(item.week_end)
      const dateRange = endDate.minus({ days: 6 }).day.toString() + "-" + endDate.day.toString()
      return { x: dateRange, y: item.time_minutes }
    })
  }, [activityTimePerWeek])

  const { data: activityTimePerMonthData } = useQuery(ACTIVITY_TIME_PER_MONTH)
  const activityTimePerMonth = useMemo(
    () => activityTimePerMonthData?.userSumActivitiesTimePerMonth,
    [activityTimePerMonthData],
  )
  const monthActivityForGraph = useMemo(() => {
    return activityTimePerMonth?.map((item) => ({
      x: DateTime.fromISO(item.month).monthShort,
      y: item.time_minutes,
    }))
  }, [activityTimePerMonth])

  const activeGraphData = useMemo(() => {    
    logAnalyticsEvent("time-stats-period-change", { timePeriod: selectedOption.label })
    switch (selectedOption.label) {
      case "Daily":
        return dayActivityForGraph
      case "Weekly":
        return weekActivityForGraph
      case "Monthly":
        return monthActivityForGraph
      default:
        return dayActivityForGraph
    }
  }, [dayActivityForGraph, weekActivityForGraph, monthActivityForGraph, selectedOption])

  const headerText = useMemo(() => {
    if (
      activityTimePerDay?.length &&
      activityTimePerWeek?.length &&
      activityTimePerMonth?.length &&
      graphSelectedIndex != null
    ) {
      let activeDay
      switch (selectedOption.label) {
        case "Daily":
          activeDay = DateTime.fromISO(activityTimePerDay[graphSelectedIndex].day)
          return `${activeDay.monthShort} ${activeDay.day}`
        case "Weekly":
          activeDay = DateTime.fromISO(activityTimePerWeek[graphSelectedIndex].week_end)
          return `${activeDay.monthShort} ${activeDay.minus({ days: 6 }).day} - ${
            activeDay.monthShort
          } ${activeDay.day}`
        case "Monthly":
          activeDay = DateTime.fromISO(activityTimePerMonth[graphSelectedIndex].month)
          return `${activeDay.monthLong} ${activeDay.year}`
      }
    } else {
      return "No Data"
    }
  }, [
    selectedOption.label,
    activityTimePerDay,
    graphSelectedIndex,
    activityTimePerWeek,
    activityTimePerMonth,
  ])

  const selectedDataValueMinutes = useMemo(() => {
    if (
      activityTimePerDay?.length &&
      activityTimePerWeek?.length &&
      activityTimePerMonth?.length &&
      graphSelectedIndex != null
    ) {
      let timeMinutes = 0

      switch (selectedOption.label) {
        case "Daily":
          timeMinutes = activityTimePerDay[graphSelectedIndex].time_minutes
          break
        case "Weekly":
          timeMinutes = activityTimePerWeek[graphSelectedIndex].time_minutes
          break
        case "Monthly":
          timeMinutes = activityTimePerMonth[graphSelectedIndex].time_minutes
          break
      }
      return timeMinutes
    } else {
      return 0
    }
  }, [
    selectedOption.label,
    activityTimePerDay,
    graphSelectedIndex,
    activityTimePerWeek,
    activityTimePerMonth,
  ])

  const selectedDataValue = useMemo(
    () => minutesToDays(selectedDataValueMinutes),
    [selectedDataValueMinutes],
  )

  const changeGraphMode = useCallback(
    (item) => {
      setGraphSelectedIndex(0)
      setSelectedOption(item)
      let endIndex = 0
      switch (item.label) {
        case "Daily":
          endIndex = dayActivityForGraph?.length - 1
          break
        case "Weekly":
          endIndex = weekActivityForGraph?.length - 1
          break
        case "Monthly":
          endIndex = monthActivityForGraph?.length - 1
          break
      }
      setGraphSelectedIndex(endIndex)
    },
    [dayActivityForGraph, monthActivityForGraph, weekActivityForGraph],
  )

  useFocusEffect(
    useCallback(() => {
      changeGraphMode(OPTIONS[0])
    }, [changeGraphMode]),
  )

  const navigateToFirstActivity = useCallback(() => {
    logAnalyticsEvent("stats-time-first-activity-pressed")
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
        {selectedDataValue.d > 0 && (
          <>
            <Heading1 color="dark2">{selectedDataValue.d}</Heading1>
            <ParagraphLight color="dark2" ml={2} mr={4}>
              days
            </ParagraphLight>
          </>
        )}
        {selectedDataValue.h > 0 && (
          <>
            <Heading1 color="dark2">{selectedDataValue.h}</Heading1>
            <ParagraphLight color="dark2" ml={2} mr={4}>
              hours
            </ParagraphLight>
          </>
        )}
        <Heading1 color="dark2">{selectedDataValue.m}</Heading1>
        <ParagraphLight color="dark2" ml={2} mr={4}>
          minutes
        </ParagraphLight>
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
                        return { style: Object.assign({}, props.style, { fill: "#8B80F8" }) }
                      },
                    },
                  ]
                },
              },
            },
          ]}
          style={{ data: { fill: globalCustomisations.colors.steppenDarkPurple } }}
        />
      </VictoryChart>
      {(!totalMinutes || totalMinutes < 1) && !loadingActivity && (
        <Div left={32} position="absolute" top={128} w="100%">
          <Button alignSelf="center" bg="aqua100" px={16} onPress={navigateToFirstActivity}>
            Complete Your 1st Activity
          </Button>
        </Div>
      )}

      {selectedOption.label === "Daily" && (
        <Div row alignItems="baseline" justifyContent="space-between">
          <SmallLight color="dark3">Suggested daily workout time</SmallLight>
          <Div row alignItems="baseline">
            <Heading1 color={selectedDataValueMinutes >= 30 ? "alternateText80" : "errorRed"}>
              30
            </Heading1>
            <ParagraphLight
              color={selectedDataValueMinutes >= 30 ? "alternateText80" : "errorRed"}
              ml={2}
            >
              minutes
            </ParagraphLight>
          </Div>
        </Div>
      )}

      {selectedOption.label === "Weekly" && (
        <Div row alignItems="baseline" justifyContent="space-between">
          <SmallLight color="dark3">Suggested weekly workout time</SmallLight>
          <Div row alignItems="baseline">
            <Heading1 color={selectedDataValueMinutes > 150 ? "alternateText80" : "errorRed"}>
              2.5
            </Heading1>
            <ParagraphLight
              color={selectedDataValueMinutes > 150 ? "alternateText80" : "errorRed"}
              ml={2}
            >
              hours
            </ParagraphLight>
          </Div>
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

const USER_WORKOUT_RANK = gql`
  query userRankedAgainstOthersThisWeek {
    userRankedAgainstOthersThisWeek
  }
`

const SteppenActivityRank = memo(() => {
  const { data: userRankingData } = useQuery(USER_WORKOUT_RANK)
  const userRanking = useMemo(
    () => userRankingData?.userRankedAgainstOthersThisWeek,
    [userRankingData],
  )

  return (
    <Div row alignItems="center" bg="aqua10" px={12} py={20} rounded={8}>
      <FitnessSvg style={{ aspectRatio: 76 / 59, width: 76 }} />
      <Div w={12} />
      <Div flex={1}>
        <Heading3 color="dark2">Steppen Activity Rank</Heading3>
        <ParagraphLight color="dark2" numberOfLines={2}>
          You are among the <Paragraph color="aqua100">top {userRanking}% most active</Paragraph>{" "}
          Steppen users
        </ParagraphLight>
      </Div>
    </Div>
  )
})

const AverageSessionLength = memo(({ averageActivityLength }) => {
  return (
    <Div bg="steppenPurple20" p={12} rounded={8}>
      <Div row alignItems="center">
        <Div bg="steppenPurple100" p={4} rounded="circle">
          <StopwatchIcon style={{ aspectRatio: 1, width: 20 }} />
        </Div>
        <BodyHeavy color="dark2" ml={8}>
          Average session length
        </BodyHeavy>
      </Div>
      <Div h={16} />

      <Div row alignItems="baseline">
        {averageActivityLength ? (
          <>
            <Heading1 color="dark2">{averageActivityLength}</Heading1>
            <ParagraphLight color="dark3" ml={2}>
              minutes
            </ParagraphLight>
          </>
        ) : (
          <ParagraphLight color="dark3" ml={2}>
            No data
          </ParagraphLight>
        )}
      </Div>
    </Div>
  )
})

const TotalWorkoutTimeEver = memo(({ totalWorkoutTimeEver }) => {
  return (
    <Div bg="steppenPurple100" p={12} rounded={8}>
      <Div row alignItems="center">
        <Div bg="light1" p={4} rounded="circle">
          <StopwatchIconColorFlip style={{ aspectRatio: 1, width: 20 }} />
        </Div>
        <BodyHeavy color="light1" ml={8}>
          Total workout time ever
        </BodyHeavy>
      </Div>
      <Div h={16} />
      <Div row alignItems="baseline">
        {totalWorkoutTimeEver.m ? (
          <>
            {totalWorkoutTimeEver.d > 0 && (
              <>
                <Heading1 color="light1">{totalWorkoutTimeEver.d}</Heading1>
                <ParagraphLight color="light1" ml={2} mr={4}>
                  days
                </ParagraphLight>
              </>
            )}
            {totalWorkoutTimeEver.h > 0 && (
              <>
                <Heading1 color="light1">{totalWorkoutTimeEver.h}</Heading1>
                <ParagraphLight color="light1" ml={2} mr={4}>
                  hours
                </ParagraphLight>
              </>
            )}
            <Heading1 color="light1">{totalWorkoutTimeEver.m}</Heading1>
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

const WorkoutTimeThisWeek = memo(({ progressPercentage, weekTotalHours }) => {
  return (
    <Div bg="aqua20" flex={1} h={253} p={12} rounded={8}>
      <Div alignSelf="center" flex={1} w={111}>
        <ChronoOutlineSvg
          style={{ aspectRatio: 111 / 112, width: 111, position: "absolute", top: 0, right: 0 }}
        />
        <Div position="absolute" right={11} top={17}>
          <ProgressRing
            indicatorColor={globalCustomisations.colors.steppenDarkGreen}
            indicatorWidth={5}
            progress={progressPercentage}
            size={90}
            trackColor={globalCustomisations.colors.light1}
            trackWidth={5}
          />
        </Div>
        <Div
          alignItems="center"
          h={111}
          justifyContent="center"
          position="absolute"
          right={0}
          top={6}
          w={111}
        >
          {weekTotalHours ? (
            <>
              <Heading1 color="dark2">{weekTotalHours}</Heading1>
              <ExtraSmall color="dark3" mt={-6}>
                hours
              </ExtraSmall>
            </>
          ) : (
            <Heading3 color="dark3">--</Heading3>
          )}
        </Div>
      </Div>
      {progressPercentage ? (
        <Paragraph color="dark2">
          You are {progressPercentage.toString()}% towards health professionals recommended 2.5
          hours of weekly activity
        </Paragraph>
      ) : (
        <Paragraph color="dark3">
          How close to the health professionals recommended weekly activity level are you?
        </Paragraph>
      )}
    </Div>
  )
})

const WHEN_MOST_ACTIVE = gql`
  query userLifetimeActivitiesWhenMostActive {
    userLifetimeActivitiesWhenMostActive {
      time_of_day
      percentage_of_activities
    }
  }
`

const WHEN_OPTIONS = [
  {
    title: "",
    titleColor: "dark2",
    description: "",
    descriptionColor: "dark3",
    background: WhenNoDataSvg,
  },
  {
    title: "You are an early riser",
    titleColor: "dark2",
    description: "of your workouts are completed before 9am",
    descriptionColor: "dark3",
    background: WhenMorningSvg,
  },
  {
    title: "You are a midday mover",
    titleColor: "dark2",
    description: "of your workouts are completed during the day",
    descriptionColor: "dark3",
    background: WhenMiddaySvg,
  },
  {
    title: "You are a night owl",
    titleColor: "light1",
    description: "of your workouts are completed at night",
    descriptionColor: "light3",
    background: WhenNightSvg,
  },
]

const WhenMostActive = memo(() => {
  const { data: whenMostActiveData } = useQuery(WHEN_MOST_ACTIVE)
  const whenMostActive = useMemo(
    () => whenMostActiveData?.userLifetimeActivitiesWhenMostActive,
    [whenMostActiveData],
  )

  const userMostActive = useMemo(() => {
    if (!whenMostActive) return WHEN_OPTIONS[0]
    if (whenMostActive.time_of_day === "morning") return WHEN_OPTIONS[1]
    if (whenMostActive.time_of_day === "midday") return WHEN_OPTIONS[2]
    if (whenMostActive.time_of_day === "night") return WHEN_OPTIONS[3]
    return WHEN_OPTIONS[0]
  }, [whenMostActive])

  const BackgroundSVG = useMemo(() => {
    return userMostActive.background
  }, [userMostActive])

  return (
    <Div>
      <BackgroundSVG style={{ aspectRatio: 160 / 253, height: 253 }} />
      <Div position="absolute" py={16}>
        <Heading3 color={userMostActive.titleColor} mx={8} textAlign="center">
          {userMostActive.title}
        </Heading3>
        <Div h={8} />
        <ParagraphHeavy color={userMostActive.descriptionColor} mx={4} textAlign="center">
          {whenMostActive ? `${whenMostActive.percentage_of_activities}% ` : ""}
          <ParagraphLight color={userMostActive.descriptionColor}>
            {userMostActive.description}
          </ParagraphLight>
        </ParagraphHeavy>
      </Div>
    </Div>
  )
})

const ACTIVITY_ALL_TIME = gql`
  query userLifetimeActivities {
    userLifetimeActivities {
      average_activity_length_minutes
      all_activities_total_minutes
    }
  }
`

const ACTIVITY_TIME_PER_WEEK = gql`
  query userSumActivitiesTimePerWeek {
    userSumActivitiesTimePerWeek {
      week_end
      time_minutes
    }
  }
`

const TimeScreen = () => {
  const { data: activityAllTimeData } = useQuery(ACTIVITY_ALL_TIME)
  const allTimeCompletions = useMemo(
    () => activityAllTimeData?.userLifetimeActivities,
    [activityAllTimeData],
  )

  const totalWorkoutTimeEver = useMemo(
    () => minutesToDays(allTimeCompletions?.all_activities_total_minutes),
    [allTimeCompletions?.all_activities_total_minutes],
  )

  const { data: activityTimePerWeekData } = useQuery(ACTIVITY_TIME_PER_WEEK)
  const activityTimePerWeek = useMemo(
    () => activityTimePerWeekData?.userSumActivitiesTimePerWeek,
    [activityTimePerWeekData],
  )

  const weekTotalHours = useMemo(
    () =>
      !activityTimePerWeek
        ? 0
        : Math.round(activityTimePerWeek[activityTimePerWeek.length - 1].time_minutes / 6) / 10,
    [activityTimePerWeek],
  )

  const progressPercentage = useMemo(
    () => (weekTotalHours > 2.5 ? 100 : Math.floor((weekTotalHours / 2.5) * 100)),
    [weekTotalHours],
  )

  return (
    <StatsDetailsContainer
      Background={HeaderTimeSvg}
      backgroundColor="steppenPurple100"
      title="Time"
    >
      <ActivitiesOverTimeGraph
        activityTimePerWeek={activityTimePerWeek}
        totalMinutes={allTimeCompletions?.all_activities_total_minutes}
      />

      <Div h={32} />

      <Heading1 color="dark2">Highlights</Heading1>

      <Div h={16} />

      <SteppenActivityRank />

      <Div h={16} />

      <AverageSessionLength
        averageActivityLength={allTimeCompletions?.average_activity_length_minutes}
      />

      <Div h={16} />

      <TotalWorkoutTimeEver totalWorkoutTimeEver={totalWorkoutTimeEver} />

      <Div h={16} />

      <Div row alignItems="center">
        <WorkoutTimeThisWeek
          progressPercentage={progressPercentage}
          weekTotalHours={weekTotalHours}
        />

        <Div w={8} />

        <WhenMostActive />
      </Div>
    </StatsDetailsContainer>
  )
}

export default memo(TimeScreen)
