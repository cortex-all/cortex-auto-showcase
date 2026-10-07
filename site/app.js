const viewer = document.getElementById('screen-viewer')
const image = document.getElementById('viewer-image')
const caption = document.getElementById('viewer-caption')
for (const card of document.querySelectorAll('[data-image]')) {
  card.addEventListener('click', () => {
    image.src = card.dataset.image
    image.alt = card.querySelector('img').alt
    caption.textContent = card.dataset.caption
    viewer.showModal()
  })
}
viewer.addEventListener('click', event => {
  if (event.target === viewer) {
    const rect = viewer.getBoundingClientRect()
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) viewer.close()
  }
})
document.getElementById('year').textContent = String(new Date().getFullYear())
