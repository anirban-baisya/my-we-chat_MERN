import { Skeleton, Stack } from '@chakra-ui/react'
import React from 'react'
//chat loading privew skeleton https://chakra-ui.com/docs/components/feedback/skeleton
const ChatLoading = () => { 
  return (
    <Stack>
      <Skeleton height="45px" />
      <Skeleton height="45px" />
      <Skeleton height="45px" />
      <Skeleton height="45px" />
      <Skeleton height="45px" />
      <Skeleton height="45px" />
      <Skeleton height="45px" />
      <Skeleton height="45px" />
      <Skeleton height="45px" />
      <Skeleton height="45px" />
      <Skeleton height="45px" />
      <Skeleton height="45px" />
    </Stack>
  )
}

export default ChatLoading