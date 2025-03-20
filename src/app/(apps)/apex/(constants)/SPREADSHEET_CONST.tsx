export type SPREADSHEET_URLS_TYPE = {
  simulationId: number
  title: string
  templateSheet: {url: string}
  def?: boolean
}

export const SPREADSHEET_URLS: SPREADSHEET_URLS_TYPE[] = [
  {
    simulationId: 1,
    title: '全部節税',
    templateSheet: {
      url: 'https://docs.google.com/spreadsheets/d/1m2Eg4_-MEEUJqZLwyCWca3MnHdZnvxsNnHHTioUcVOE/edit?usp=drive_link',
    },
  },
  {
    simulationId: 2,
    title: '旅費規程',
    templateSheet: {
      url: 'https://docs.google.com/spreadsheets/d/1z_tc7xIVXM8NZXvCCSQ4Mtwzf4izJaQdcuwdkZQfWwM/edit?usp=drive_link',
    },
  },
  {
    simulationId: 3,
    title: '社宅規程',
    templateSheet: {url: 'https://docs.google.com/spreadsheets/d/1r8hrgttzgXDMusjdGyVZ9wSzNqajvLwW-iSGFqNHtMY/edit?usp=sharing'},
    def: true,
  },
  {
    simulationId: 4,
    title: '役員報酬',
    templateSheet: {
      url: 'https://docs.google.com/spreadsheets/d/1zXmsNaz-yCrRVBcE3uIowxZCsdz-sFGC1bgZc_N9aLk/edit?usp=drive_link',
    },
  },
]
