const Tool = ({ type, onClick }: {
  type: 'Undo' | 'Redo' | 'Draw' | 'Erase' | 'Invert' | 'Clear',
  onClick?: () => void
}) => (
  <button
    className=""
    onClick={onClick}
  >
    {type}
  </button>
)

export default Tool
