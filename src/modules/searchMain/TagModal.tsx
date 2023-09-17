import React, { memo, useCallback, useMemo, useState } from "react"
import { FlatList, Pressable } from "react-native"
import { Button, Div, Icon, Input, isEmptyArray, Modal, ScrollDiv } from "react-native-magnus"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { logAnalyticsEvent } from "helper/logAnalyticsEvent"
import { DiscoveryTabs } from "modules/myfit/DiscoveryEvents"
import { SearchTabEvents } from "modules/searchMain/SearchEvents"
import { PageMarginContainer } from "theme/PageMarginContainer"
import { Body, Heading2, Heading3, Paragraph, ParagraphHeavy, Small } from "theme/Typography"

type Props = {
  tab: DiscoveryTabs
  showModal: string | null
  onClose: () => void
  tags: { [key: string]: any }
  selectedTags: any[]
  tagCategories: any
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

const TagModal: React.FC<Props> = ({
  tab,
  tags,
  selectedTags,
  showModal,
  onClose,
  setSelectedTags,
  tagCategories,
}) => {
  const [category, setCategory] = useState<string>()
  const [searchTerm, setSearchTerm] = useState<string>("")
  const { bottom } = useSafeAreaInsets()

  const filterCategory: string = useMemo(() => category || showModal || "", [category, showModal])
  const title = useMemo(
    () =>
      filterCategory && filterCategory !== ""
        ? tagCategories.find((item: any) => item.key === filterCategory)?.label
        : undefined,
    [tagCategories, filterCategory],
  )

  const handleClose = useCallback(() => {
    setCategory("")
    setSearchTerm("")
    onClose()
  }, [onClose])

  const handleClearTags = useCallback(() => {
    logAnalyticsEvent(SearchTabEvents.SEARCH_TAG_REMOVED_ALL(tab))
    if (filterCategory && filterCategory !== "") {
      setSelectedTags((prevSelectedTags: any[]) =>
        prevSelectedTags.filter((item) => item.category !== filterCategory),
      )
    } else {
      setSelectedTags([])
      handleClose()
    }
  }, [filterCategory, handleClose, setSelectedTags, tab])

  const handleChangeSearchTerm = useCallback((query: string) => {
    setSearchTerm(query)
  }, [])

  const handleToggleTag = useCallback(
    (isActive: boolean, selectedIndex: number, cat: string, tag: string) => {
      if (!isActive) {
        logAnalyticsEvent(SearchTabEvents.SEARCH_TAG_ADDED(tab), { category: cat, tag })
        setSelectedTags((previousSelectedTags: any[]) => [
          ...previousSelectedTags,
          { category: cat, tag },
        ])
      } else {
        logAnalyticsEvent(SearchTabEvents.SEARCH_TAG_REMOVED(tab), { category: cat, tag })
        setSelectedTags((previousSelectedTags: any[]) =>
          previousSelectedTags.filter((_, index) => index !== selectedIndex),
        )
      }
    },
    [setSelectedTags, tab],
  )

  const AllFilters = useMemo(() => {
    const handleSelectCategory = (categoryKey: string) => () => {
      setCategory(categoryKey)
    }

    const renderCategory = ({ item, index }: { item: any; index: number }) => {
      const isActive =
        selectedTags.findIndex((selectedTag) => selectedTag.category === item.key) !== -1
      return (
        <Button
          key={index}
          bg="transparent"
          p={4}
          w="33.3%"
          onPress={handleSelectCategory(item.key)}
        >
          <Div
            alignItems="center"
            bg={isActive ? "aqua20" : "transparent"}
            borderColor={isActive ? "aqua" : "dark4"}
            borderWidth={1}
            flex={1}
            py={24}
            rounded={10}
          >
            <Div alignItems="center" justifyContent="center">
              <Icon
                color={isActive ? "aqua" : "dark4"}
                fontFamily={item.iconFamily}
                fontSize={item.iconSize || 24}
                name={item.icon}
              />
              <Paragraph color={isActive ? "dark2" : "dark4"} mt={2}>
                {item.label}
              </Paragraph>
            </Div>
          </Div>
        </Button>
      )
    }

    return (
      <Div>
        <Heading2 color="dark" mb={20} mt={28}>
          All Filters
        </Heading2>
        <FlatList
          data={tagCategories}
          numColumns={3}
          renderItem={renderCategory}
          scrollEnabled={false}
          style={{ width: "100%" }}
        />
      </Div>
    )
  }, [tagCategories, selectedTags])

  const TagList = useMemo(
    () => (
      <Div flex={1}>
        <Input
          bg="light2"
          borderWidth={0}
          h={54}
          placeholder="Search"
          rounded={16}
          suffix={
            searchTerm !== "" ? (
              <Button bg="transparent" hitSlop={5} p={0} onPress={() => handleChangeSearchTerm("")}>
                <Icon color="dark4" fontFamily="Ionicons" fontSize={22} name="close" />
              </Button>
            ) : null
          }
          value={searchTerm}
          onChangeText={handleChangeSearchTerm}
        />
        <ScrollDiv mb={12}>
          <Div row flexWrap="wrap" justifyContent="flex-start" mt={24}>
            {tags &&
              filterCategory &&
              !isEmptyArray(tags[filterCategory]) &&
              tags[filterCategory]
                ?.filter((item: any) => item.tag.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((item: any, index: number) => {
                  const selectedIndex = selectedTags.findIndex(
                    (selectedTag) =>
                      selectedTag.category === filterCategory && selectedTag.tag === item.tag,
                  )
                  const isSelected = selectedIndex !== -1

                  return (
                    <TagButton
                      key={index}
                      active={isSelected}
                      label={item.tag}
                      onPress={() =>
                        handleToggleTag(isSelected, selectedIndex, filterCategory, item.tag)
                      }
                    />
                  )
                })}
          </Div>
        </ScrollDiv>
      </Div>
    ),
    [handleToggleTag, filterCategory, searchTerm, handleChangeSearchTerm, selectedTags, tags],
  )

  return (
    <Modal
      backdropOpacity={0.2}
      h="90%"
      isVisible={showModal !== null}
      pb={bottom}
      rounded={15}
      onBackdropPress={handleClose}
    >
      <Button
        bg="transparent"
        m={8}
        position="absolute"
        right={0}
        top={0}
        zIndex={1}
        onPress={handleClearTags}
      >
        <Body color="aqua">Clear All</Body>
      </Button>
      <Div left={0} m={15} position="absolute" top={0} zIndex={1}>
        <Pressable onPress={handleClose}>
          <Icon color="aqua" fontFamily="Ionicons" fontSize={32} name="close-circle-outline" />
        </Pressable>
      </Div>
      <Div flexDir="row" justifyContent="center" px={20} py={20} w="100%">
        <Heading3 textAlign="center">{title}</Heading3>
      </Div>

      <PageMarginContainer flex={1}>
        <Div flex={1}>{!filterCategory || filterCategory === "" ? AllFilters : TagList}</Div>
        <Div>
          <Button block bg="aqua" py={15} rounded="lg" onPress={handleClose}>
            <ParagraphHeavy color="light1">Apply Filters</ParagraphHeavy>
          </Button>
        </Div>
      </PageMarginContainer>
    </Modal>
  )
}

export default memo(TagModal)
