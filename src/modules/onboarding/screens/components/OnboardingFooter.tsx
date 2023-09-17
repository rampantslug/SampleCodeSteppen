import React, { forwardRef, useCallback, useRef, useState } from "react"
import { TouchableOpacity } from "react-native-gesture-handler"
import { Div, Icon, Modal } from "react-native-magnus"

import { logAnalyticsEvent } from "helper/logAnalyticsEvent"
import { Heading3, Paragraph } from "theme/Typography"

const ExplanationModal = forwardRef(({ children }, ref) => {
  const [isVisible, setIsVisible] = useState()

  const onModalWillShow = () => {
    setIsVisible(true)
  }

  const onModalWillHide = () => setIsVisible(false)

  return (
    <Modal
      ref={ref}
      h="35%"
      isVisible={isVisible}
      rounded={20}
      onBackdropPress={onModalWillHide}
      onModalWillHide={onModalWillHide}
      onModalWillShow={onModalWillShow}
    >
      <Div p={20}>
        <Div row alignItems="center">
          <Heading3 flex={1} fontSize={16} fontWeight="700">
            Why are we asking for this info?
          </Heading3>

          <TouchableOpacity onPress={onModalWillHide}>
            <Icon color="dark4" fontFamily="Ionicons" fontSize={24} name="close" />
          </TouchableOpacity>
        </Div>

        <Div h={20} />

        {children}
      </Div>
    </Modal>
  )
})

export const OnboardingFooter = ({ modalText }) => {
  const modalRef = useRef()

  const openModal = useCallback(() => {
    modalRef?.current?.open()
    logAnalyticsEvent(`onboarding-why-are-we-asking`, { modalText })
  }, [modalText])

  return (
    <Div justifyContent="flex-end" w="100%">
      <Div
        alignItems="center"
        borderColor="dark5"
        borderTopWidth={1}
        h={44}
        justifyContent="center"
        w="100%"
      >
        <TouchableOpacity onPress={openModal}>
          <Paragraph color="#8E8E93" fontSize={16} fontWeight="400" textDecorLine="underline">
            Why are we asking this information?
          </Paragraph>
        </TouchableOpacity>
      </Div>

      <ExplanationModal ref={modalRef}>
        <Paragraph color="dark2" fontSize={16} fontWeight="400">
          {modalText}
        </Paragraph>
      </ExplanationModal>
    </Div>
  )
}
