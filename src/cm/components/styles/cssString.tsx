import {cl} from 'src/cm/lib/methods/common'

export class CssString {
  static border = {
    disactivateBordcerDottedBottom: `[&_.dottedBottom]:!border-[0px] `,
    dottedBottom: `p-0.5 `,
    // dottedBottom: cl(`dottedBottom border-b-[0.1px] border-dashed `, `p-0.5 `),
  }

  static fontSize = {
    cell: 'text-[16px]',
  }
  static table = {
    paddingTd: `[&_td]:!p-1 `,
    paddingTh: `[&_th]:!p-1 `,
    noBorder: `[&_td]:!border-0 [&_th]:!border-0 `,
    borderCerlls: `[&_td:not(.noEffect)]:!border-[1px] [&_th]:!border-[1px] `,
    borderCerllsY: ` [&_td]:!border-y-[1px] [&_th]:!border-y-[1px] `,
    getCellHeight: (height = 45) => {
      const result = cl(`min-h-[${height}px] `, this.fontSize.cell)
      return result
    },
    editableCellFormControllClassName: `w-full   shadow-xs rounded  onHover  p-0.5 h-[24px]`,
  }
}
