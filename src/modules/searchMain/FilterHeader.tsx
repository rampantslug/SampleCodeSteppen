import React, { memo, useCallback } from "react"
import { FlatList, Pressable } from "react-native"
import { Div, Icon } from "react-native-magnus"

import { ParagraphLight, Small } from "theme/Typography"

const ReadOnlyWorkoutTagItem = memo(({ tag, onPress }) => {
  return (
    <Div
      row
      alignItems="center"
      borderColor="aqua"
      borderWidth={1}
      mr={10}
      pl={12}
      pr={6}
      py={6}
      rounded={34}
    >
      <Small color="dark3" mr={4}>
        {tag.tag}
      </Small>
      <Pressable hitSlop={5} onPress={() => onPress(tag)}>
        <Icon color="dark3" fontFamily="MaterialCommunityIcons" fontSize={18} name="close" />
      </Pressable>
    </Div>
  )
})

type Props = {
  selectedTags: any[]
  onEditFilter: () => void
  setSelectedTags: (newTags: any) => void
}

const FilterHeader: React.FC<Props> = ({ selectedTags, onEditFilter, setSelectedTags }) => {
  const handleToggleTag = useCallback(
    ({ category, tag }) => {
      const selectedIndex = selectedTags.findIndex((selectedTag) => selectedTag.tag === tag)
      const isActive = selectedIndex !== -1

      if (!isActive) {
        setSelectedTags((previousSelectedTags: any[]) => [
          ...previousSelectedTags,
          { category, tag },
        ])
      } else {
        setSelectedTags((previousSelectedTags: any[]) =>
          previousSelectedTags.filter((_, index) => index !== selectedIndex),
        )
      }
    },
    [selectedTags, setSelectedTags],
  )

  const renderItem = useCallback(
    ({ item }) => <ReadOnlyWorkoutTagItem tag={item} onPress={handleToggleTag} />,
    [handleToggleTag],
  )

  const keyExtractor = useCallback((item, i) => i.toString(), [])

  return (
    <Div row alignItems="center" my={16} w="100%">
      <Pressable onPress={onEditFilter}>
        <Div borderColor="aqua" borderWidth={1} ml={16} mr={8} px={6} py={6} rounded={34}>
          <Icon color="aqua" fontFamily="Feather" fontSize={16} mx={8} name="sliders" />
        </Div>
      </Pressable>
      {selectedTags.length === 0 && (
        <Pressable onPress={onEditFilter}>
          <ParagraphLight color="dark3" ml={8}>
            Click to filter content
          </ParagraphLight>
        </Pressable>
      )}
      <FlatList
        horizontal
        data={selectedTags}
        keyExtractor={keyExtractor}
        ListFooterComponent={<Div w={8} />}
        ListHeaderComponent={<Div w={8} />}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
      />
    </Div>
  )
}

export default memo(FilterHeader)
