import {GetDevice, getWindow} from 'src/cm/hooks/useWindowSize'
import {CSSProperties} from 'react'
import {MyFormType, MyTableType} from '@cm/types/types'
export const getTableStickyStyles = (props: any) => {
  const commons = {
    background: '#f4f4f4',
    position: 'sticky',
  }
  return {
    kado: {
      top: 0,
      left: 0,
      ...commons,
      ...props?.style,
    },
    header: {
      top: 0,
      ...commons,
      ...props?.style,
    },
    footer: {
      bottom: 0,
      ...commons,
      ...props?.style,
    },
    left: {
      left: 0,

      ...commons,
      ...props?.style,
    },
  }
}
export const stylesByDevice = {
  SP: {
    Modal: {},
    Form: {
      maxWidth: '90vw',
      maxHeight: '70vh',
    },
    Table: {
      // maxHeight: '70vh',
      maxWidth: '85vw',
    },
  },

  TB: {
    Modal: {},
    Form: {
      maxWidth: '90vw',
      maxHeight: '75vh',
    },
    Table: {
      // maxHeight: '70vh',
      maxWidth: '85vw',
    },
  },

  PC: {
    Modal: {},
    Form: {
      maxWidth: '90vw',
      maxHeight: '70vh',
    },
    Table: {
      // maxHeight: '70vh',
      maxWidth: '85vw',
    },
  },
}

export const myTableDefault: MyTableType = {
  tableId: '',
  className: '',
  style: {
    overflow: 'auto', //必須
    minWidth: 240,
    ...stylesByDevice?.[GetDevice(getWindow().width)]?.Table,
  },
  create: {},
  search: {},
  sort: {},
  pagination: {},
  header: false,
  drag: false,
  fixedCols: 0,
}

export const myFormDefault: MyFormType = {
  create: {},
  delete: {},
  className: '',
  style: {
    padding: '5px 5px 0 5px',
    overflow: 'auto', //必須
    minHeight: 100,
    // minWidth: Math.min(250),

    margin: 'auto',
    background: '#ffffff',
    ...stylesByDevice?.[GetDevice(getWindow().width)]?.Form,
  },
  customActions: undefined,
}

/**モーダルでoverflowはせずに、中のコンポーネントで制御する */
export const myModalDefault: CSSProperties = {
  borderRadius: 10,
  // backgroundColor: 'white',
  position: 'absolute',
  top: 0,
  marginTop: 30,
  // padding: '10px 10px',
  // minWidth: 280,
  width: 'fit-content',
  height: 'fit-content',
  maxHeight: '80vh', //スマホ時に、アドレスバーで隠れてしまうので、これ以上上げない
  maxWidth: '95vw',
  overflow: 'auto',

  ...stylesByDevice?.[GetDevice(getWindow().width)]?.Modal,
}

export const limitEditting = (props: {exclusiveTo?: boolean; myTable?: MyTableType; myForm?: MyFormType}) => {
  const {
    exclusiveTo,
    myTable = {update: false, delete: false},
    myForm = {
      update: false,
      delete: false,
    },
  } = props
  if (!exclusiveTo) {
    return {
      myTable,
      myForm,
    }
  }
}

export const controlDefaultStyle: CSSProperties = {
  width: 190,
  minHeight: 30,
  maxWidth: '85vw',
  margin: `auto 0`,
}
