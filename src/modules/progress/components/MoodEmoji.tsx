import React, { useMemo } from "react"

import { moodEmojis } from "modules/mood/moodEmojis"

export const MoodEmoji = ({ moodValue }) => {
  const { Emoji, label } = useMemo(
    () => moodEmojis[moodValue > 0 && moodValue < 6 ? moodValue - 1 : 2],
    [moodValue],
  )

  return <Emoji />
}

export const moodLabel = (moodValue: number): string => {
  if (moodValue == null || moodValue < 0 || moodValue > 5) {
    return ""
  }
  return moodEmojis[moodValue - 1].label.toString()
}
