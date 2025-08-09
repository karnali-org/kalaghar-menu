import './style.css'
import menuData from './data/menu.json'

const { menuCategories } = menuData

const appRoot = document.querySelector('#app')

function createElement(tag, className, attrs = {}) {
  const el = document.createElement(tag)
  if (className) el.className = className
  for (const [key, value] of Object.entries(attrs)) {
    if (key === 'text') el.textContent = value
    else el.setAttribute(key, value)
  }
  return el
}

function renderApp() {
  appRoot.innerHTML = ''

  const header = createElement('header', 'kg-header')
  header.innerHTML = `
    <div class="brand">
      <div class="logomark" aria-hidden="true">KG</div>
      <div class="titles">
        <h1 class="brand-title">Kala Ghar</h1>
        <p class="brand-subtitle">Teashop Menu</p>
      </div>
    </div>
    <div class="search-wrap">
      <input id="search" class="search-input" type="search" placeholder="Search drinks, snacks..." autocomplete="off" />
    </div>
  `

  const tabs = createElement('nav', 'tabs', { role: 'tablist' })
  const allTab = createElement('button', 'tab is-active', { role: 'tab', 'data-slug': 'all', text: 'All' })
  tabs.appendChild(allTab)
  menuCategories.forEach((cat) => {
    const tab = createElement('button', 'tab', { role: 'tab', 'data-slug': cat.slug, text: cat.name })
    tabs.appendChild(tab)
  })

  const grid = createElement('main', 'menu-grid')

  appRoot.append(header, tabs, grid)

  let activeSlug = 'all'
  let query = ''

  function getFilteredItems() {
    const allItems = activeSlug === 'all'
      ? menuCategories.flatMap((c) => c.items.map((i) => ({ ...i, category: c.name, categorySlug: c.slug })))
      : menuCategories
          .filter((c) => c.slug === activeSlug)
          .flatMap((c) => c.items.map((i) => ({ ...i, category: c.name, categorySlug: c.slug })))

    if (!query) return allItems

    const q = query.toLowerCase()
    return allItems.filter((i) =>
      i.name.toLowerCase().includes(q) ||
      (i.description && i.description.toLowerCase().includes(q)) ||
      i.category.toLowerCase().includes(q)
    )
  }

  function formatPrice(p) {
    return `रु.${p.toFixed(0)}`
  }

  function renderGrid() {
    grid.innerHTML = ''
    const items = getFilteredItems()

    if (items.length === 0) {
      const empty = createElement('div', 'empty', { text: 'No items match your search.' })
      grid.appendChild(empty)
      return
    }

    for (const item of items) {
      const card = createElement('article', `card cat-${item.categorySlug}`)

      const header = createElement('div', 'card-head')
      const title = createElement('h3', 'item-name', { text: item.name })
      const price = createElement('div', 'item-price', { text: formatPrice(item.price) })
      header.append(title, price)

      const meta = createElement('div', 'item-meta')
      if (item.image) {
        const img = createElement('img', 'item-img', { src: item.image, alt: `${item.name} image`, width: '64', height: '64', loading: 'lazy' })
        img.decoding = 'async'
        img.referrerPolicy = 'no-referrer'
        card.prepend(img)
      }
      if (item.description) meta.append(createElement('p', 'item-desc', { text: item.description }))
      if (item.badge) meta.append(createElement('span', 'badge', { text: item.badge }))

      card.append(header, meta)
      grid.appendChild(card)
    }
  }

  tabs.addEventListener('click', (e) => {
    const btn = e.target.closest('button.tab')
    if (!btn) return
    activeSlug = btn.dataset.slug
    for (const el of tabs.querySelectorAll('button.tab')) el.classList.toggle('is-active', el === btn)
    renderGrid()
  })

  header.querySelector('#search').addEventListener('input', (e) => {
    query = e.target.value
    renderGrid()
  })

  renderGrid()
}

renderApp()

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}
