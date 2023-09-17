import React, { memo, useCallback, useMemo } from "react"
import { ScrollView } from "react-native-gesture-handler"
import { Button, Div, Icon, isEmptyArray } from "react-native-magnus"

import { Small } from "theme/Typography"

type Props = {
  selectedTags: any[]
  openTagsModal: (category: string) => void
  tagCategories: any
}

const TagButton: React.FC<{
  label: string
  active: boolean
  onPress: (category?: string) => () => void
}> = ({ label, active, onPress }) => {
  return (
    <Button
      bg={active ? "aqua20" : "transparent"}
      borderColor={active ? "aqua" : "dark3"}
      borderWidth={1}
      mr={8}
      pl={12}
      pr={9}
      py={5}
      rounded={34}
      onPress={onPress(label)}
    >
      <Small color="dark3">{label}</Small>
      <Icon color="dark3" fontFamily="Feather" fontSize={16} ml={4} name="chevron-down" />
    </Button>
  )
}

const TagHeader: React.FC<Props> = ({ selectedTags, openTagsModal, tagCategories }) => {
  const handlePressFilter = useCallback(
    (category?: string) => () => {
      openTagsModal(category || "")
    },
    [openTagsModal],
  )

  const hasFilters = useMemo(() => !isEmptyArray(selectedTags), [selectedTags])

  const tagsModified = useMemo(() => {
    return tagCategories
      .map((item: any) => {
        const active =
          selectedTags.findIndex((selectedTag) => selectedTag.category === item.key) !== -1
        return { ...item, active }
      })
      .sort((x: any, y: any) => x.key.localeCompare(y.key))
      .sort((x: any, y: any) => y.active - x.active)
  }, [selectedTags, tagCategories])

  return (
    <Div>
      <ScrollView
        horizontal
        keyboardShouldPersistTaps="handled"
        showsHorizontalScrollIndicator={false}
        style={{ marginVertical: 18 }}
      >
        <Div w={15} />
        <Button
          bg={hasFilters ? "aqua20" : "transparent"}
          borderColor={hasFilters ? "aqua" : "dark3"}
          borderWidth={1}
          mr={8}
          px={12}
          py={5}
          rounded={34}
          onPress={handlePressFilter()}
        >
          <Icon
            color={hasFilters ? "aqua" : "dark3"}
            fontFamily="Feather"
            fontSize={16}
            name="sliders"
          />
        </Button>
        {tagsModified.map((item: any) => (
          <TagButton
            key={item.key}
            active={item.active}
            label={item.label}
            onPress={() => handlePressFilter(item.key)}
          />
        ))}
      </ScrollView>
    </Div>
  )
}

export default memo(TagHeader)
