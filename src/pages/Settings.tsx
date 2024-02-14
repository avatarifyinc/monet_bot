import { useHapticFeedback, useWebApp } from '@vkruglikov/react-telegram-web-app'
import { useState } from 'react'

import { useGetSettings, usePostSettings } from '../api'
import { useInit } from '../hooks'
import { useStore } from '../store'

import Button from '../kit/Button'
import Header from '../kit/Header'
import HelpButton from '../kit/HelpButton'
import Input from '../kit/Input'
import Screen from '../kit/Screen'

import { RATIOS_TITLED, STYLES_TITLED } from '../const'
import { closeApp } from '../utils'

function Settings() {
  useInit()
  const WebApp = useWebApp()
  const [, notificationOccurred] = useHapticFeedback()
  const { settings, setSettings, resetSettings, setPostError } = useStore()
  const {
    isLoading: isSettingsLoading,
    error: settingsError,
    // data: settings
  } = useGetSettings()
  const postSettings = usePostSettings()
  const [isBusy, setIsBusy] = useState(false)

  if (!settings || isSettingsLoading || settingsError) {
    return null // todo loader | handle error
  }

  const save = async () => {
    setIsBusy(true)
    try {
      const resJson = await postSettings()
      console.log('postSettings res', resJson)
      notificationOccurred('success')
      setTimeout(() => {
        window.Telegram?.WebApp.close()
        WebApp.close()
      }, 100)
    } catch (e) {
      setPostError(e as Error)
    } finally {
      setIsBusy(false)
    }
  }

  return (
    <Screen isBottomButton>
      <Header onBack={() => { closeApp() }} />

      <div className="flex items-center justify-between">
        <h4 className="">Settings</h4>
        <Button
          theme="text"
          text="Reset"
          onClick={resetSettings}
        />
      </div>
      <div className="mt-6">
        <div className="mb-[9px] text-[17px] leading-[22px] font-semibold">Ratio</div>
        <div className="flex flex-wrap gap-2">
          {RATIOS_TITLED.map(ratio => (
            <Button
              theme="radio"
              text={ratio.title}
              key={ratio.title}
              isActive={JSON.stringify(settings.aspect_ratio) === JSON.stringify(ratio.value)}
              onClick={() => {
                setSettings({
                  ...settings,
                  aspect_ratio: ratio.value,
                })
              }}
            />
          ))}
        </div>
      </div>
      <div className="mt-6">
        <div className="mb-[9px] text-[17px] leading-[22px] font-semibold">Styles</div>
        <div className="flex flex-wrap gap-2">
          {STYLES_TITLED.map(style => (
            <Button
              theme="radio"
              text={style.title}
              key={style.title}
              isActive={settings.style === style.value}
              onClick={() => {
                setSettings({
                  ...settings,
                  style: style.value,
                })
              }}
            />
          ))}
        </div>
      </div>
      <div className="mt-6">
        <div className="mb-[9px] flex items-center justify-start gap-1">
          <div className="text-[17px] leading-[22px] font-semibold">Negative prompt</div>
          <HelpButton />
        </div>
        <Input
          placeholder="Prompt"
          value={settings.negative_prompt}
          onChange={newValue => {
            setSettings({
              ...settings,
              negative_prompt: newValue,
            })
          }}
        />
      </div>
      <Button
        isBottom
        text="Save"
        onClick={save}
        // disabled={isButtonDisabled}
        isBusy={isBusy}
      />
    </Screen>
  )
}

export default Settings
