// Modal Dialog
// A dialog is a window overlaid on either the 
// primary window or another dialog window. Content behind a modal dialog is inert, meaning that users cannot interact with it , https://chakra-ui.com/docs/components/overlay/modal 
//for display profile details
import React from 'react'

import { ViewIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  IconButton,
  Text,
  Image,
} from "@chakra-ui/react";

const ProfileModal = ({ user, children }) => { //it takes 2 things user, children
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {children ? ( //if children are suplied then display the children
        <span onClick={onOpen}>{children}</span>
      ) : (//if children are not suplied then display the view icon
        <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
      )}

      <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered> {/*this part takes from chakrai ui modal snippet*/}
        <ModalOverlay />
        <ModalContent h="410px">
          <ModalHeader
            fontSize="40px"
            fontFamily="Work sans"
            d="flex"
            justifyContent="center"
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            d="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <Image
              borderRadius="full"
              boxSize="150px"
              src={user.pic}
              alt={user.name}
            />
            
            <Text
              fontSize={{ base: "28px", md: "30px" }}
              fontFamily="Work sans"
            >
              Email: {user.email}
            </Text> {/*for displaying email*/}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;