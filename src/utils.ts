export const closeApp = () => {
  if (window.Telegram?.WebApp.platform !== 'unknown') {
    window.Telegram?.WebApp.close()
  } else {
    alert('Close webapp...')
  }
}
