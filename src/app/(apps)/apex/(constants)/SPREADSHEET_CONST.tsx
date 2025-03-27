
export type SPREADSHEET_URLS_TYPE = {
  simulationId: number
  title: string
  subTitle: any
  description: string
  templateSheet: {url: string}
  def?: boolean
}

export const SPREADSHEET_URLS: SPREADSHEET_URLS_TYPE[] = [
  {
    simulationId: 1,
    subTitle: `神器①`,
    title: '旅費規程',
    description: `日当と従業員給のバランスを確認できます`,
    templateSheet: {
      url: 'https://docs.google.com/spreadsheets/d/1z_tc7xIVXM8NZXvCCSQ4Mtwzf4izJaQdcuwdkZQfWwM/edit?usp=drive_link',
    },
  },
  {
    simulationId: 2,
    subTitle: `神器②`,
    title: '社宅規程',
    description: `会社が家賃を支払う事で投資相続をいくら下げられるか確認できます`,
    templateSheet: {url: 'https://docs.google.com/spreadsheets/d/1r8hrgttzgXDMusjdGyVZ9wSzNqajvLwW-iSGFqNHtMY/edit?usp=sharing'},
    def: true,
  },
  {
    simulationId: 3,
    subTitle: `神器③`,
    title: '役員報酬',
    description: `家族に所得を分散することで手取りをいくら増やせるか確認できます`,
    templateSheet: {
      url: 'https://docs.google.com/spreadsheets/d/1zXmsNaz-yCrRVBcE3uIowxZCsdz-sFGC1bgZc_N9aLk/edit?usp=drive_link',
    },
  },
  {
    simulationId: 4,
    subTitle: '',
    title: '全部節税',
    description: `①〜③を全て導入することでいくら手取りを増やせるか確認できます。`,
    templateSheet: {
      url: 'https://docs.google.com/spreadsheets/d/1m2Eg4_-MEEUJqZLwyCWca3MnHdZnvxsNnHHTioUcVOE/edit?usp=drive_link',
    },
  },
  {
    simulationId: 5,
    subTitle: '',
    title: '賃料相当額',
    description: `法人名義で家を借りたとき、会社に支払うべき家賃を税法を基に計算します。`,
    templateSheet: {
      url: 'https://docs.google.com/spreadsheets/d/1m2Eg4_-MEEUJqZLwyCWca3MnHdZnvxsNnHHTioUcVOE/edit?usp=drive_link',
    },
  },
]
