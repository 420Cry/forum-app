import type { PostVisibility } from './post'

export type PostUploadPayload = {
  author_id: string
  content: string
  image?: File | null
  visibility: PostVisibility
}
