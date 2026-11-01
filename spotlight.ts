// Logi Options+ only starts the Spotlight timer when the window title ends with this.
export const SUFFIX = ' - Google Slides'

// The clicker's start button sends one Enter keydown with metaKey set and no separate Meta keydown,
// so useMagicKeys combos miss it: read the modifier flags on the event itself.
export function isPresentKey(
  e: Pick<KeyboardEvent, 'key' | 'metaKey' | 'ctrlKey' | 'repeat'>,
) {
  return e.key === 'Enter' && (e.metaKey || e.ctrlKey) && !e.repeat
}

export function spoofTitle(title: string, fullscreen: boolean) {
  const has = title.endsWith(SUFFIX)
  if (fullscreen) {
    return has ? title : title + SUFFIX
  }
  return has ? title.slice(0, -SUFFIX.length) : title
}

export function install(win: Window = window, doc: Document = document) {
  // Adding the suffix on entering fullscreen is early enough (tested with a Spotlight 2),
  // so this covers `f`, the nav button and Slidev's own present shortcut too.
  doc.addEventListener('fullscreenchange', () => {
    doc.title = spoofTitle(doc.title, !!doc.fullscreenElement)
  })

  // Fallback for Slidev without slidevjs/slidev#2809. Wait until every listener has run:
  // if core already handled the key it called preventDefault(), and toggling again would undo it.
  win.addEventListener('keydown', (e) => {
    if (!isPresentKey(e)) {
      return
    }
    setTimeout(() => {
      if (e.defaultPrevented) {
        return
      }
      if (doc.fullscreenElement) {
        doc.exitFullscreen()
      } else {
        doc.body.requestFullscreen()
      }
    })
  })
}
