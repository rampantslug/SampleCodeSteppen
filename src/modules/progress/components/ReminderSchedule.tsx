import { gql, useMutation, useQuery } from "@apollo/client"
import React, { createRef, memo, useCallback, useMemo } from "react"
import { TouchableOpacity } from "react-native"
import { Div, Dropdown, Skeleton, Toggle } from "react-native-magnus"

import { logAnalyticsEvent } from "helper/logAnalyticsEvent"
import { ProgressEvents } from "modules/progress/progressEvents"
import { Heading2, Paragraph } from "theme/Typography"

const dropdownRef = createRef<any>()

const defaultDays = 7

const pickerValues = [
  {
    label: "everyday",
    value: 1,
  },
  {
    label: "2 days",
    value: 2,
  },
  {
    label: "3 days",
    value: 3,
  },
  {
    label: "4 days",
    value: 4,
  },
  {
    label: "5 days",
    value: 5,
  },
  {
    label: "6 days",
    value: 6,
  },
  {
    label: "7 days",
    value: 7,
  },
  {
    label: "14 days",
    value: 14,
  },
  {
    label: "30 days",
    value: 30,
  },
]

const GET_USER_PROGRESS_PHOTO_REMINDER_FREQUENCY = gql`
  query getCurrentUser {
    getUser {
      id
      progress_photo_reminder_frequency
    }
  }
`

const SET_PROGRESS_PHOTO_REMINDER_FREQUENCY = gql`
  mutation setProgressPhotoReminderFrequency($frequency: Int) {
    setProgressPhotoReminderFrequency(frequency: $frequency) {
      success
      user {
        id
        progress_photo_reminder_frequency
      }
    }
  }
`

const ReminderSchedule = () => {
  const [setRemindNDay] = useMutation(SET_PROGRESS_PHOTO_REMINDER_FREQUENCY)
  const { data, loading } = useQuery(GET_USER_PROGRESS_PHOTO_REMINDER_FREQUENCY, {
    notifyOnNetworkStatusChange: true,
  })

  const remindNDay = useMemo(() => data?.getUser?.progress_photo_reminder_frequency, [data])

  const onToggle = useCallback(() => {
    const frequency = remindNDay ? null : defaultDays
    logAnalyticsEvent(ProgressEvents.ON_PROGRESS_PHOTO_REMINDER_TOGGLED, { frequency })
    setRemindNDay({
      variables: { frequency },
    })
  }, [remindNDay, setRemindNDay])

  const onSelect = useCallback(
    (frequency: number) => () => {
      logAnalyticsEvent(ProgressEvents.ON_PROGRESS_PHOTO_REMINDER_FREQUENCY_CHANGED, { frequency })
      setRemindNDay({
        variables: { frequency },
      })
    },
    [setRemindNDay],
  )

  const toggleDropdown = useCallback(() => {
    logAnalyticsEvent(ProgressEvents.ON_SET_PROGRESS_PHOTO_REMINDER_FREQUENCY)
    dropdownRef?.current?.open()
  }, [])

  const ToggleLabel = useMemo(() => {
    if (!remindNDay) {
      return <Paragraph maxW="70%">Want to be reminded to take your progress picture?</Paragraph>
    }

    return (
      <Div row alignItems="center">
        <Paragraph mr="halfMargin">Remind me{remindNDay > 1 ? " every" : ""}</Paragraph>
        <TouchableOpacity activeOpacity={0.5} onPress={toggleDropdown}>
          <Div bg="aqua20" borderColor="aqua" borderWidth={1} p="halfMargin" rounded={8}>
            <Paragraph>{remindNDay > 1 ? `${remindNDay} days` : "everyday"}</Paragraph>
          </Div>
        </TouchableOpacity>
      </Div>
    )
  }, [remindNDay, toggleDropdown])

  if (loading) {
    return (
      <Div row alignItems="center" justifyContent="space-between" mb="baseMargin" mx="baseMargin">
        <Skeleton.Box h={24} rounded={8} w={200} />
        <Skeleton.Box h={24} rounded={8} w={44} />
      </Div>
    )
  }

  return (
    <>
      <Div row alignItems="center" justifyContent="space-between" mb="baseMargin" mx="baseMargin">
        {ToggleLabel}
        <Toggle activeBg="aqua" bg="dark5" h={24} on={!!remindNDay} w={44} onPress={onToggle} />
      </Div>
      <Dropdown
        ref={dropdownRef}
        roundedTop="xl"
        title={<Heading2 textAlign="center">Remind me every</Heading2>}
      >
        {pickerValues.map(({ label, value }) => (
          <Dropdown.Option key={label} value={value} onPress={onSelect(value)}>
            {label}
          </Dropdown.Option>
        ))}
      </Dropdown>
    </>
  )
}

export default memo(ReminderSchedule)
