import { gql, useMutation, useQuery } from "@apollo/client"
import { DateTime } from "luxon"
import React, { memo, useCallback, useMemo, useState } from "react"
import { Pressable } from "react-native"
import { Div, Icon, Overlay } from "react-native-magnus"

import { MoodEmoji, moodLabel } from "./MoodEmoji"
import { logAnalyticsEvent } from "helper/logAnalyticsEvent"
import { Body, BodyHeavy, ExtraSmall, Heading1, Small, SmallLight } from "theme/Typography"

const MoodSelector = ({ activityText, moodSelected, setVisibility }) => {
  const selectMood = useCallback(
    (value) => {
      moodSelected(value)
      setVisibility(false)
    },
    [moodSelected, setVisibility],
  )

  return (
    <Div alignItems="center">
      <BodyHeavy>{activityText}</BodyHeavy>
      <Div row alignItems="center" mt={32}>
        {[1, 2, 3, 4, 5].map((moodValue) => {
          return (
            <Pressable key={moodValue} onPress={() => selectMood(moodValue)}>
              <Div alignItems="center" justifyContent="center" mx={12}>
                <Div h={32} w={32}>
                  <MoodEmoji moodValue={moodValue} />
                </Div>
                <SmallLight color="dark1">{moodLabel(moodValue)}</SmallLight>
              </Div>
            </Pressable>
          )
        })}
      </Div>
    </Div>
  )
}

export const DayMood = memo((item) => {
  return (
    <Div mx={1}>
      <SmallLight color={item.isToday ? "dark2" : "dark5"} textAlign="center">
        {item.dayInitial}
      </SmallLight>
      <Div bg="light3" h={32} my={4} rounded={4} w={32}>
        {item.before_activity > 0 && (
          <Div alignItems="center" bg="steppenYellow40" p={5} rounded={4}>
            <MoodEmoji moodValue={item.before_activity} />
          </Div>
        )}
      </Div>
      <Div bg="light3" h={32} my={4} rounded={4} w={32}>
        {item.activity_completed && (
          <Div alignItems="center" bg="aqua10" flex={1} justifyContent="center" p={5} rounded={4}>
            <Div bg="aqua" h={16} justifyContent="center" rounded="circle" w={16}>
              <Icon color="light" fontFamily="MaterialIcons" fontSize={14} name="check" />
            </Div>
          </Div>
        )}
      </Div>
      <Div bg="light3" h={32} my={4} rounded={4} w={32}>
        {item.after_activity > 0 && (
          <Div alignItems="center" bg="steppenBlue20" p={5} rounded={4}>
            <MoodEmoji moodValue={item.after_activity} />
          </Div>
        )}
      </Div>
    </Div>
  )
})

const TodayMoodRow = ({ moodValue, title }) => {
  return (
    <Div row alignItems="center" justifyContent="space-between" my={12}>
      <Div row alignItems="center">
        {moodValue > 0 ? (
          <Div row alignItems="center" bg="steppenYellow40" h={48} pr={16} rounded="circle">
            <Div alignItems="center" h={32} mx={8} w={32}>
              <MoodEmoji moodValue={moodValue} />
            </Div>
            <Body>{moodLabel(moodValue)}</Body>
          </Div>
        ) : (
          <Div row alignItems="center" bg="light3" h={48} pr={16} rounded="circle">
            <Div alignItems="center" h={32} mx={8} w={32}>
              <Div bg="dark4" h={32} left={2} position="absolute" rounded={32} top={0} w={32} />
              <Div bg="dark5" h={32} rounded={32} w={30} />
            </Div>
            <Body color="dark5">---</Body>
          </Div>
        )}
        <Icon color="dark3" fontFamily="Feather" fontSize={24} mx={10} name="clock" />
        <Body>{title}</Body>
      </Div>
      {moodValue > 0 ? (
        <Icon color="dark5" fontFamily="MaterialIcons" fontSize={24} name="edit" />
      ) : (
        <Icon color="dark5" fontFamily="MaterialIcons" fontSize={24} name="add" />
      )}
    </Div>
  )
}

const dayPlaceholders = ["M", "T", "W", "T", "F", "S", "S"]

const getMondayThisWeek = () => {
  const today = new Date()
  const first = today.getDate() - today.getDay() + 1
  const monday = new Date(today.setDate(first))
  return DateTime.fromJSDate(monday)
}

const ADD_MOOD = gql`
  mutation upsertUserMood($day: String!, $data: UserMoodInput!) {
    upsertUserMood(day: $day, data: $data) {
      success
    }
  }
`

const USER_MOODS = gql`
  query getUserMoods($id: String!, $fromDate: String!, $daysIncluded: Int!) {
    getUserMoods(id: $id, fromDate: $fromDate, daysIncluded: $daysIncluded) {
      id
      day
      before_activity
      after_activity
      activity_completed
      user_id
    }
  }
`
const USER = gql`
  query user {
    getUser {
      id
      fullname
    }
  }
`

const Mood = () => {
  const [isBeforeSelectorVisible, setIsBeforeSelectorVisible] = useState(false)
  const [isAfterSelectorVisible, setIsAfterSelectorVisible] = useState(false)

  const [mondayOfSelectedWeek, setMondayOfSelectedWeek] = useState(getMondayThisWeek())

  const today = useMemo(() => DateTime.now(), [])

  const { data: userData, loading: isLoadingUser } = useQuery(USER)
  const user = useMemo(() => userData?.getUser, [userData])

  const { data: userMoodTodayData } = useQuery(USER_MOODS, {
    variables: {
      id: global.currentUserId?.toString(),
      fromDate: today.toSQLDate(),
      daysIncluded: 1,
    },
    skip: !mondayOfSelectedWeek,
    fetchPolicy: "network-only",
  })
  const todaysMood = useMemo(() => userMoodTodayData?.getUserMoods[0], [userMoodTodayData])

  const { data: userMoodsWeekData } = useQuery(USER_MOODS, {
    variables: {
      id: global.currentUserId?.toString(),
      fromDate: mondayOfSelectedWeek.toSQLDate(),
      daysIncluded: 7,
    },
    skip: !mondayOfSelectedWeek,
    fetchPolicy: "network-only",
  })
  const selectedWeekMoods = useMemo(
    () => userMoodsWeekData?.getUserMoods || [],
    [userMoodsWeekData],
  )

  const [addMoodMutation] = useMutation(ADD_MOOD, {
    refetchQueries: ["getUserMoods"],
  })

  const userMoodsVisible = useMemo(
    () =>
      dayPlaceholders.map((item, index) => {
        if (!mondayOfSelectedWeek) {
          return null
        }

        const dayToFind = mondayOfSelectedWeek.plus({ days: index }).toSQLDate()
        const matchingMood = selectedWeekMoods.find((mood) => mood.day === dayToFind)
        return {
          dayInitial: item,
          day: matchingMood?.day,
          isToday: matchingMood?.day === today.toSQLDate(),
          before_activity: matchingMood?.before_activity,
          after_activity: matchingMood?.after_activity,
          activity_completed: matchingMood?.activity_completed,
        }
      }),
    [mondayOfSelectedWeek, selectedWeekMoods, today],
  )

  const updateBeforeActivityMood = useCallback(
    async (value) => {
      await addMoodMutation({
        variables: {
          day: DateTime.now().toSQLDate(),
          data: {
            beforeActivity: value,
          },
        },
      })
      logAnalyticsEvent("mood-progressPage-setTodaysMood", { type: "beforeActivity" })
    },
    [addMoodMutation],
  )

  const updateAfterActivityMood = useCallback(
    async (value) => {
      await addMoodMutation({
        variables: {
          day: DateTime.now().toSQLDate(),
          data: {
            afterActivity: value,
          },
        },
      })
      logAnalyticsEvent("mood-progressPage-setTodaysMood", { type: "afterActivity" })
    },
    [addMoodMutation],
  )

  const daysBetweenSelectedMondayAndToday = useMemo(
    () => today.diff(mondayOfSelectedWeek, ["days"]).toObject().days || 0,
    [mondayOfSelectedWeek, today],
  )

  const selectedWeekText = useMemo(() => {
    if (daysBetweenSelectedMondayAndToday < 7) {
      return "This week"
    } else if (daysBetweenSelectedMondayAndToday < 14) {
      return "Last week"
    } else {
      return `${(daysBetweenSelectedMondayAndToday / 7).toFixed()} weeks ago`
    }
  }, [daysBetweenSelectedMondayAndToday])

  return (
    <>
      <Div row alignItems="center" justifyContent="space-between" m="baseMargin">
        <Heading1>Mood</Heading1>
        <Icon color="dark4" fontFamily="MaterialIcons" fontSize={16} ml={4} name="lock-outline" />
      </Div>
      <Div bg="steppenYellow20" mx="baseMargin" pb={8} pt={20} px={16} rounded={16}>
        <BodyHeavy mb={12} textAlign="center">
          Today's mood
        </BodyHeavy>
        <Pressable onPress={() => setIsBeforeSelectorVisible(true)}>
          <TodayMoodRow moodValue={todaysMood?.before_activity} title="Before Activity" />
        </Pressable>
        <Pressable onPress={() => setIsAfterSelectorVisible(true)}>
          <TodayMoodRow moodValue={todaysMood?.after_activity} title="After Activity" />
        </Pressable>
      </Div>

      <Div alignItems="center" bg="steppenYellow20" m="baseMargin" py={20} rounded={16}>
        <BodyHeavy textAlign="center">The impact of activities on your mood</BodyHeavy>
        <Div h={24} />
        <Div row alignItems="center" bg="steppenYellow100" h={24} rounded="circle">
          <Pressable
            onPress={() => {
              setMondayOfSelectedWeek(mondayOfSelectedWeek.minus({ days: 7 }))
              logAnalyticsEvent("mood-adjustTableRange", { adjustment: "minus-7-days" })
            }}
          >
            <Icon color="light" fontFamily="MaterialIcons" fontSize={24} name="chevron-left" />
          </Pressable>
          <Small color="light" mx={8}>
            {selectedWeekText}
          </Small>
          {daysBetweenSelectedMondayAndToday > 7 ? (
            <Pressable
              onPress={() => {
                setMondayOfSelectedWeek(mondayOfSelectedWeek.plus({ days: 7 }))
                logAnalyticsEvent("mood-adjustTableRange", { adjustment: "plus-7-days" })
              }}
            >
              <Icon color="light" fontFamily="MaterialIcons" fontSize={24} name="chevron-right" />
            </Pressable>
          ) : (
            <Div w={24} />
          )}
        </Div>
        <Div h={18} />
        <Div row>
          <Div mr={16} my={16}>
            <ExtraSmall my={7} textAlign="right">
              Before{"\n"}activity
            </ExtraSmall>
            <ExtraSmall my={7} textAlign="right">
              Activity{"\n"}completed?
            </ExtraSmall>
            <ExtraSmall my={7} textAlign="right">
              After{"\n"}activity
            </ExtraSmall>
          </Div>
          {userMoodsVisible.map((item, index) => (
            <DayMood key={index} {...item} />
          ))}
        </Div>
      </Div>
      <Overlay
        alignItems="center"
        bg="steppenYellow20"
        p={32}
        rounded={16}
        visible={isBeforeSelectorVisible}
        onBackdropPress={() => setIsBeforeSelectorVisible(false)}
      >
        <MoodSelector
          activityText={`${
            user?.fullname?.split(" ")[0]
          }, how are you feeling before your activity?`}
          moodSelected={updateBeforeActivityMood}
          setVisibility={setIsBeforeSelectorVisible}
        />
      </Overlay>
      <Overlay
        alignItems="center"
        bg="steppenYellow20"
        p={32}
        rounded={16}
        visible={isAfterSelectorVisible}
        onBackdropPress={() => setIsAfterSelectorVisible(false)}
      >
        <MoodSelector
          activityText={`${
            user?.fullname?.split(" ")[0]
          }, how are you feeling after your activity?`}
          moodSelected={updateAfterActivityMood}
          setVisibility={setIsAfterSelectorVisible}
        />
      </Overlay>
    </>
  )
}

export default memo(Mood)
