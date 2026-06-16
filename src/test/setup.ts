import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// Unmount React trees after every test so the DOM (and jest-dom queries) stay isolated.
afterEach(() => {
  cleanup()
})

// jsdom does not implement the native <dialog> modal methods — polyfill them so components
// using <dialog> (e.g. Modal) can mount and toggle. `open` reflects to the attribute in jsdom.
if (typeof HTMLDialogElement !== 'undefined') {
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.open = true
  }
  HTMLDialogElement.prototype.show = function show() {
    this.open = true
  }
  HTMLDialogElement.prototype.close = function close() {
    this.open = false
    this.dispatchEvent(new Event('close'))
  }
}
