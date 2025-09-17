export interface Subarea {
  id: string
  label: string
  value: number
  note: string
  noteVisible: boolean
}

export interface Area {
  subs: Subarea[]
}

export type Labels = [string, string, string, string]

export type Areas = Record<number, Area>
