import {forSelectConfig} from '@cm/types/types'

export const userForSelect: forSelectConfig = {
  where: {apps: {has: `yoshinari`}},
}
