export interface NewRole {
    name: string
    description: string | null
}

export interface Role extends NewRole {
    id: string
}