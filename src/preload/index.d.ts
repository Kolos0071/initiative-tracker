import { ElectronAPI } from '@electron-toolkit/preload'

type BattleLogEntry = {
  id: number
  round: number
  attackerName?: string
  targetName?: string
  damage: number
  isHeal: boolean
  timestamp: string
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      getData: (msg?: any) => Promise<any>
      setData: (options: any) => Promise<void>
      // Battle log APIs
      openBattleLog: (mainWindowId: number) => Promise<void>
      getBattleLog: () => Promise<BattleLogEntry[]>
      addBattleLogEntry: (entry: BattleLogEntry) => Promise<void>
      clearBattleLog: () => Promise<void>
      closeBattleLogWindow: () => Promise<void>
      onBattleLogUpdate: (callback: () => void) => void
    }
  }
}
