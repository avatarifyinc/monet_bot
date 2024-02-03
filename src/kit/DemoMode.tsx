import { useInitData } from '@vkruglikov/react-telegram-web-app'

const DemoMode = () => {
  const [, initData] = useInitData()

  return !!initData ? null : (
    <div className="fixed top-0 width-auto left-[50%] -translate-x-[50%] px-3 text-[11px] leading-[1em] font-semibold bg-[#3a3] text-white rounded-b-md">Demo mode</div>
  )
}

export default DemoMode
