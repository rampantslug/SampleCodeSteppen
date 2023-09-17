import { gql, useMutation } from "@apollo/client"
import { Picker } from "@react-native-picker/picker"
import React, { useCallback, useState } from "react"
import { Button, Div } from "react-native-magnus"

import Modal from "component/Modals/Modal"
import { BodyHeavy } from "theme/Typography"
import logAnalyticsEvent from "helper/logAnalyticsEvent"

const SET_WEEKLY_WORKOUT_GOAL = gql`
  mutation updateCurrentUser($preferenceWeeklyWorkouts: Int) {
    updateCurrentUser(data: { preferenceWeeklyWorkouts: $preferenceWeeklyWorkouts }) {
      id
      preference_weekly_workouts
    }
  }
`

export const SetWeeklyWorkoutGoalModal = ({ isVisible, setIsVisible }) => {
  const [newGoal, setNewGoal] = useState()

  const [updateWeeklyWorkoutGoal] = useMutation(SET_WEEKLY_WORKOUT_GOAL)

  const updateGoal = useCallback(() => {
    logAnalyticsEvent("set-weekly-workout-goal", { goal: newGoal })
    updateWeeklyWorkoutGoal({
      variables: {
        preferenceWeeklyWorkouts: newGoal,
      },
    })
  }, [newGoal, updateWeeklyWorkoutGoal])

  const closeModal = useCallback(() => {
    setIsVisible(false)
  }, [setIsVisible])

  const save = useCallback(() => {
    updateGoal()
    setIsVisible(false)
  }, [updateGoal, setIsVisible])

  return (
    <Modal
      avoidKeyboard
      backdropOpacity={0.8}
      containerProps={{ flex: undefined }}
      isVisible={isVisible}
      onClose={closeModal}
    >
      <Div borderBottomColor="light3" borderBottomWidth={1} pb={8} pt={32}>
        <BodyHeavy color="dark2" textAlign="center">
          Pick your weekly workout goal
        </BodyHeavy>
      </Div>

      <Picker selectedValue={newGoal} onValueChange={(itemValue) => setNewGoal(itemValue)}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((numberOfWorkouts) => (
          <Picker.Item
            key={numberOfWorkouts}
            label={numberOfWorkouts.toString()}
            value={numberOfWorkouts}
          />
        ))}
      </Picker>

      <Button
        alignSelf="stretch"
        bg="aqua100"
        color="light"
        fontSize={14}
        fontWeight="700"
        minH={56}
        mx={40}
        my={24}
        rounded={8}
        onPress={save}
      >
        Save
      </Button>
    </Modal>
  )
}
