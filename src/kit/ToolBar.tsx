import { ReactNode } from 'react'

const ToolBar = ({ groups }: { groups: ReactNode[]}) => (
  <div className="pt-4 flex items-center justify-between">
    {groups.map((group, i) => (
      <>
        {i > 0 && (
          <div className="h-6 w-[1px] bg-[#11111114]" />
        )}
        <div className="flex gap-4 items-center">
          {group}
        </div>
      </>
    ))}
  </div>
)

export default ToolBar
