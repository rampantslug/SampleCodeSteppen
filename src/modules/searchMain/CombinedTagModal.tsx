import React, { memo, useCallback, useMemo } from "react"
import { Pressable } from "react-native"
import { Button, Div, Icon, isEmptyArray, Modal } from "react-native-magnus"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import AtHomeSvg from "assets/discovery/at-home.svg"
import BeginnerWorkoutsSvg from "assets/discovery/beginner-workouts.svg"
import GymSvg from "assets/discovery/gym.svg"
import IntSvg from "assets/discovery/int.svg"
import Clock10Svg from "assets/discovery/preferences/clock-10.svg"
import Clock20Svg from "assets/discovery/preferences/clock-20.svg"
import Clock30Svg from "assets/discovery/preferences/clock-30.svg"
import Clock45PlusSvg from "assets/discovery/preferences/clock-45-plus.svg"
import Clock45Svg from "assets/discovery/preferences/clock-45.svg"
import TrendingSvg from "assets/discovery/trending.svg"
import { logAnalyticsEvent } from "helper/logAnalyticsEvent"
import { PageMarginContainer } from "theme/PageMarginContainer"
import { Body, Heading3, ParagraphHeavy, Small } from "theme/Typography"

type Props = {
  showModal: boolean
  onClose: () => void
  tags: { [key: string]: any }
  selectedTags: any[]
  setSelectedTags: (newTags: any) => void
}

const TagButton: React.FC<{ active: boolean; label: string; onPress: () => void }> = ({
  active,
  label,
  onPress,
}) => {
  return (
    <Div p={4}>
      <Button
        bg={active ? "aqua20" : "transparent"}
        borderColor={active ? "aqua" : "dark4"}
        borderWidth={1}
        px={12}
        py={7}
        rounded={20}
        onPress={onPress}
      >
        <Small color={active ? "dark2" : "dark3"}>{label}</Small>
      </Button>
    </Div>
  )
}

const TagButtonWithIcon = ({
  label,
  ThumbnailImage,
  tag,
  category,
  selectedTags,
  handleToggleTag,
}) => {
  const selectedIndex = useMemo(
    () => selectedTags.findIndex((selectedTag) => selectedTag.tag === tag),
    [selectedTags, tag],
  )
  const isSelected = useMemo(() => selectedIndex !== -1, [selectedIndex])

  const toggleTag = useCallback(() => {
    handleToggleTag(isSelected, selectedIndex, category, tag)
  }, [category, handleToggleTag, isSelected, selectedIndex, tag])

  return (
    <Div p={4}>
      <Button
        bg={isSelected ? "aqua20" : "transparent"}
        borderColor={isSelected ? "aqua" : "dark4"}
        borderWidth={1}
        px={7}
        py={7}
        rounded={8}
        onPress={toggleTag}
      >
        <Div alignItems="center">
          <ThumbnailImage style={{ aspectRatio: 1, width: 40, alignSelf: "center" }} />
          {label && (
            <Small color={isSelected ? "dark2" : "dark3"} mt={4}>
              {label}
            </Small>
          )}
        </Div>
      </Button>
    </Div>
  )
}

const StandardCategory = ({ label, category, tags, selectedTags, handleToggleTag }) => {
  return (
    <Div my={8}>
      <Heading3 borderBottomWidth={1} borderColor="light4" mx={8}>
        {label}
      </Heading3>
      <Div>
        <Div row flexWrap="wrap" justifyContent="flex-start" mt={8}>
          {tags &&
            category &&
            !isEmptyArray(tags[category]) &&
            tags[category]?.map((item: any, index: number) => {
              const selectedIndex = selectedTags.findIndex(
                (selectedTag) => selectedTag.tag === item.tag,
              )
              const isSelected = selectedIndex !== -1

              return (
                <TagButton
                  key={index}
                  active={isSelected}
                  label={item.tag}
                  onPress={() =>
                    handleToggleTag(isSelected, selectedIndex, label.toLowerCase(), item.tag)
                  }
                />
              )
            })}
        </Div>
      </Div>
    </Div>
  )
}

const CombinedTagmodal: React.FC<Props> = ({
  tags,
  selectedTags,
  showModal,
  onClose,
  setSelectedTags,
}) => {
  const { bottom } = useSafeAreaInsets()

  const handleClose = useCallback(() => {
    logAnalyticsEvent("workout-search-tags-applied", {
      tags: selectedTags.map((tag) => tag.tag),
    })
    onClose()
  }, [selectedTags, onClose])

  const handleClearTags = useCallback(() => {
    setSelectedTags([])
  }, [setSelectedTags])

  const handleToggleTag = useCallback(
    (isActive: boolean, selectedIndex: number, cat: string, tag: string) => {
      if (!isActive) {
        setSelectedTags((previousSelectedTags: any[]) => [
          ...previousSelectedTags,
          { category: cat, tag },
        ])
      } else {
        setSelectedTags((previousSelectedTags: any[]) =>
          previousSelectedTags.filter((_, index) => index !== selectedIndex),
        )
      }
    },
    [setSelectedTags],
  )

  return (
    <Modal
      backdropOpacity={0.2}
      h="90%"
      isVisible={showModal}
      pb={bottom}
      rounded={15}
      onBackdropPress={handleClose}
    >
      <Div left={0} m={15} position="absolute" top={0} zIndex={1}>
        <Pressable onPress={handleClose}>
          <Icon color="aqua" fontFamily="Ionicons" fontSize={32} name="close-circle-outline" />
        </Pressable>
      </Div>
      <Div justifyContent="center" mx={4} px={12} py={20}>
        <Heading3 textAlign="center">Filters</Heading3>
      </Div>

      <PageMarginContainer scroll flex={1}>
        <Div my={8}>
          <Heading3 borderBottomWidth={1} borderColor="light4" mx={8}>
            Location
          </Heading3>
          <Div row flexWrap="wrap" justifyContent="flex-start" pt={8}>
            <TagButtonWithIcon
              category="location"
              handleToggleTag={handleToggleTag}
              label="Home"
              selectedTags={selectedTags}
              tag="Home"
              ThumbnailImage={AtHomeSvg}
            />
            <TagButtonWithIcon
              category="location"
              handleToggleTag={handleToggleTag}
              label="At Gym"
              selectedTags={selectedTags}
              tag="At Gym"
              ThumbnailImage={GymSvg}
            />
          </Div>
        </Div>

        <StandardCategory
          category="style"
          handleToggleTag={handleToggleTag}
          label="Style"
          selectedTags={selectedTags}
          tags={tags}
        />
        <Div my={8}>
          <Heading3 borderBottomWidth={1} borderColor="light4" mx={8}>
            Difficulty
          </Heading3>
          <Div row flexWrap="wrap" justifyContent="flex-start" pt={8}>
            <TagButtonWithIcon
              category="difficulty"
              handleToggleTag={handleToggleTag}
              label="Beginner"
              selectedTags={selectedTags}
              tag="Beginner"
              ThumbnailImage={BeginnerWorkoutsSvg}
            />
            <TagButtonWithIcon
              category="difficulty"
              handleToggleTag={handleToggleTag}
              label="Intermediate"
              selectedTags={selectedTags}
              tag="Intermediate"
              ThumbnailImage={IntSvg}
            />
            <TagButtonWithIcon
              category="difficulty"
              handleToggleTag={handleToggleTag}
              label="Advanced"
              selectedTags={selectedTags}
              tag="Advanced"
              ThumbnailImage={TrendingSvg}
            />
          </Div>
        </Div>
        <StandardCategory
          category="bodyPart"
          handleToggleTag={handleToggleTag}
          label="Body Part"
          selectedTags={selectedTags}
          tags={tags}
        />
        <StandardCategory
          category="equipment"
          handleToggleTag={handleToggleTag}
          label="Equipment"
          selectedTags={selectedTags}
          tags={tags}
        />
        <Div my={8}>
          <Heading3 borderBottomWidth={1} borderColor="light4" mx={8}>
            Time
          </Heading3>
          <Div row flexWrap="wrap" justifyContent="flex-start" pt={8}>
            <TagButtonWithIcon
              category="time"
              handleToggleTag={handleToggleTag}
              selectedTags={selectedTags}
              tag="10 mins"
              ThumbnailImage={Clock10Svg}
            />
            <TagButtonWithIcon
              category="time"
              handleToggleTag={handleToggleTag}
              selectedTags={selectedTags}
              tag="20 mins"
              ThumbnailImage={Clock20Svg}
            />
            <TagButtonWithIcon
              category="time"
              handleToggleTag={handleToggleTag}
              selectedTags={selectedTags}
              tag="30 mins"
              ThumbnailImage={Clock30Svg}
            />
            <TagButtonWithIcon
              category="time"
              handleToggleTag={handleToggleTag}
              selectedTags={selectedTags}
              tag="40 mins"
              ThumbnailImage={Clock45Svg}
            />
            <TagButtonWithIcon
              category="time"
              handleToggleTag={handleToggleTag}
              selectedTags={selectedTags}
              tag="50 mins"
              ThumbnailImage={Clock45PlusSvg}
            />
          </Div>
        </Div>
        <StandardCategory
          category="qualified"
          handleToggleTag={handleToggleTag}
          label="Creator Type"
          selectedTags={selectedTags}
          tags={tags}
        />
        <StandardCategory
          category="timed"
          handleToggleTag={handleToggleTag}
          label="Workout Type"
          selectedTags={selectedTags}
          tags={tags}
        />
      </PageMarginContainer>
      <Div row alignItems="center" justifyContent="space-between" px={20} py={20}>
        <Pressable disabled={selectedTags?.length === 0} onPress={handleClearTags}>
          <Body color={selectedTags.length > 0 ? "aqua" : "dark3"}>Clear All</Body>
        </Pressable>
        <Button bg="aqua" py={15} rounded="lg" onPress={handleClose}>
          <ParagraphHeavy color="light1">Apply Filters</ParagraphHeavy>
        </Button>
      </Div>
    </Modal>
  )
}

export default memo(CombinedTagmodal)
