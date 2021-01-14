export interface Post {
  _id?: string,
  title: string,
  content: string,
  createdBy?: string
}

export interface PostUpdateResponseDTO {
  success: boolean,
  message: string,
  post?: Post,
  error?: {}
}
