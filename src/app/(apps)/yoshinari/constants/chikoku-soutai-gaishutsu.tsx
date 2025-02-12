export type CHIKOKU_SOUTAI_GAISHUTSU_KEY = `chikoku` | `soutai` | `gaishutsu`

export const CHIKOKU_SOUTAI_GAISHUTSU_FIELDS: {
  name: CHIKOKU_SOUTAI_GAISHUTSU_KEY
  label: string
  ApprovedRequestListKey: string
}[] = [
  {name: `chikoku`, label: `遅刻`, ApprovedRequestListKey: `tikokuRequestList`},
  {name: `soutai`, label: `早退`, ApprovedRequestListKey: `sotaiRequestList`},
  {name: `gaishutsu`, label: `外出`, ApprovedRequestListKey: `gaishutsuRequestList`},
]
