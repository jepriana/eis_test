export interface NewUnit {
    name: string
    description: string | null
}

export interface Unit extends NewUnit {
    id: string
}