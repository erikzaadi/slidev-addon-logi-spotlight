import { describe, expect, it, vi } from 'vitest'
import { install, isPresentKey, spoofTitle, SUFFIX } from './spotlight'

const key = (k: string, mods: Partial<KeyboardEvent> = {}) => ({
  key: k,
  metaKey: false,
  ctrlKey: false,
  repeat: false,
  ...mods,
})

describe('isPresentKey', () => {
  it('matches Cmd/Ctrl+Enter', () => {
    expect(isPresentKey(key('Enter', { metaKey: true }))).toBe(true)
    expect(isPresentKey(key('Enter', { ctrlKey: true }))).toBe(true)
  })
  it('ignores plain Enter, other keys and repeats', () => {
    expect(isPresentKey(key('Enter'))).toBe(false)
    expect(isPresentKey(key('f', { metaKey: true }))).toBe(false)
    expect(isPresentKey(key('Enter', { metaKey: true, repeat: true }))).toBe(
      false,
    )
  })
})

describe('spoofTitle', () => {
  it('adds the suffix once on enter', () => {
    expect(spoofTitle('Deck', true)).toBe(`Deck${SUFFIX}`)
    expect(spoofTitle(`Deck${SUFFIX}`, true)).toBe(`Deck${SUFFIX}`)
  })
  it('removes it on exit and leaves other titles alone', () => {
    expect(spoofTitle(`Deck${SUFFIX}`, false)).toBe('Deck')
    expect(spoofTitle('Deck', false)).toBe('Deck')
  })
})

describe('install', () => {
  function setup() {
    vi.useFakeTimers()
    const win = new EventTarget() as unknown as Window
    const doc = Object.assign(new EventTarget(), {
      title: 'Deck',
      fullscreenElement: null as unknown,
      exitFullscreen: vi.fn(),
      body: { requestFullscreen: vi.fn() },
    })
    install(win, doc as unknown as Document)
    const press = (handledByCore = false) => {
      if (handledByCore) {
        win.addEventListener('keydown', (e) => e.preventDefault(), {
          once: true,
        })
      }
      win.dispatchEvent(
        Object.assign(
          new Event('keydown', { cancelable: true }),
          key('Enter', { metaKey: true }),
        ),
      )
      vi.runAllTimers()
    }
    return { doc, press }
  }

  it('toggles the title with fullscreen', () => {
    const { doc } = setup()
    doc.fullscreenElement = {}
    doc.dispatchEvent(new Event('fullscreenchange'))
    expect(doc.title).toBe(`Deck${SUFFIX}`)
    doc.fullscreenElement = null
    doc.dispatchEvent(new Event('fullscreenchange'))
    expect(doc.title).toBe('Deck')
  })

  it('falls back to toggling fullscreen itself', () => {
    const { doc, press } = setup()
    press()
    expect(doc.body.requestFullscreen).toHaveBeenCalledOnce()
    doc.fullscreenElement = {}
    press()
    expect(doc.exitFullscreen).toHaveBeenCalledOnce()
  })

  it('does nothing when Slidev core already handled the key', () => {
    const { doc, press } = setup()
    press(true)
    expect(doc.body.requestFullscreen).not.toHaveBeenCalled()
  })
})
