export class Sankosha {
  static constans = () => {
    const inputModes = () => {
      const modes = [
        {
          dataKey: 'storage',
          label: `入荷`,
          description: `入荷時に必要なデータのみを表示します`,
          color: `#FFC0CB`,
          query: {未検品: true},
        },
        {
          dataKey: 'inspection',
          label: `検品`,
          description: `入荷時および検品時のデータを表示します`,
          color: `#ADD8E6`,
          query: {未検品: true},
        },
        {
          dataKey: 'taskManagement',
          label: `タスク`,
          description: `入荷、検品も含めて全てのデータを表示します`,
          color: `#FFFFE0`,
          query: {作業中: true},
        },
      ]
      return modes
    }
    return {inputModes}
  }
}

export type inputMode = 'storage' | 'inspection' | 'taskManagement'
