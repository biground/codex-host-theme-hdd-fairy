import { renderHddIcon } from '../../shared/hdd-icons.mjs'

const normalizePath = (path) => path.trim().replaceAll('\\', '/').replace(/\/+$/, '')

export function mountRightbarFilesEnhance(api, getSettings) {
  const mounts = new Map()

  const clear = (tree) => {
    for (const row of tree.querySelectorAll('[data-hf-file-match], [data-hf-file-changed]')) {
      row.removeAttribute('data-hf-file-match')
      row.removeAttribute('data-hf-file-changed')
    }
  }

  const disposeTree = (tree, state) => {
    clear(tree)
    state.mount.dispose()
    mounts.delete(tree)
  }

  const dispose = () => {
    for (const [tree, state] of mounts) disposeTree(tree, state)
  }

  const update = (tree, state) => {
    const query = state.input.value.trim().toLocaleLowerCase()
    const paths = [...document.querySelectorAll('[data-diff-row="path"]')]
      .map((row) => normalizePath(row.textContent)).filter(Boolean)
    const rows = [...tree.querySelectorAll('li[data-files-entry][data-files-path]')]
    for (const row of rows.reverse()) {
      const path = normalizePath(row.getAttribute('data-files-path'))
      const matches = !query || path.toLocaleLowerCase().includes(query) || !!row.querySelector('li[data-hf-file-match="true"]')
      const changed = row.getAttribute('data-files-entry') === 'file' && paths.some((item) =>
        item === path || normalizePath(tree.getAttribute('data-files-root')) + '/' + item.replace(/^\.\//, '') === path)
      const matchValue = query ? String(matches) : null
      const changedValue = changed ? '1' : null
      for (const [name, value] of [['data-hf-file-match', matchValue], ['data-hf-file-changed', changedValue]]) {
        if (row.getAttribute(name) === value) continue
        if (value === null) row.removeAttribute(name)
        else row.setAttribute(name, value)
      }
    }
    state.clear.hidden = !query
  }

  const reconcile = () => {
    const settings = getSettings()
    if (!settings.enableWebTheme || !settings.panelRightbarEnabled || !settings.webRightbarFilesEnhance || api.signal.aborted) {
      dispose()
      return
    }
    const selector = '[data-sidebar-right-session] [data-files-state="tree"]'
    const trees = document.querySelector(selector) ? [...document.querySelectorAll(selector)] : []
    for (const [tree, state] of mounts) {
      if (!trees.includes(tree) || !state.mount.container.isConnected) disposeTree(tree, state)
    }
    for (const tree of trees) {
      let state = mounts.get(tree)
      if (!state) {
        const header = tree.querySelector(':scope > [class*="_header"]')
        if (!header) continue
        const mount = api.dom.mount(header, 'after')
        if (!mount) continue
        mount.container.setAttribute('data-cx-ext-owned', '')
        mount.container.className = 'hf-files-subbar'
        mount.container.innerHTML = `<label class="hf-files-search-wrap">${renderHddIcon('search')}<input class="hf-files-search" type="search" placeholder="筛选文件" aria-label="筛选文件"></label><button class="hf-files-clear" type="button" aria-label="清空筛选">${renderHddIcon('x')}</button>`
        const input = mount.container.querySelector('input')
        const clearButton = mount.container.querySelector('button')
        state = { mount, input, clear: clearButton }
        mounts.set(tree, state)
        input.addEventListener('input', () => update(tree, state))
        clearButton.addEventListener('click', () => { input.value = ''; update(tree, state); input.focus() })
      }
      update(tree, state)
    }
  }
  return { reconcile, dispose }
}

