export interface User {
  id: number
  name: string
  email: string
  role: string
  status: string
  registrationDate: string
  lastActivity: string
  avatar: string | null
  loginCount: number
  postsCount: number
  commentsCount: number
  sendWelcomeEmail?: boolean
}

export interface EditForm {
  name: string
  email: string
  role: string
}
