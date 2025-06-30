import "./global.scss"
import "./style.scss"

const items = [
    {
        count: "24",
        desc: "НЕБОЛЬШОЕ КОЛИЧЕСТВО КВАРТИР  ОБЕСПЕЧИВАЕТ ПРИВАТНОСТЬ ПРОЖИВАНИЯ",
    },
    { count: "16", desc: "КВАРТИР ОСТАЛОСЬ" },
    { count: "2", desc: "ПЕНТХАУСА ОСТАЛОСЬ" },
]

let activeIndex = 0

let itemEls: HTMLElement[] = []

// Calculation positions for items in orbit
function getPositions(count: number, height: number) {
    const radius = height / 2
    const centerX = 0
    const centerY = height / 2

    const delta = Math.PI / (count + 1)
    return Array.from({ length: count }, (_, i) => {
        const angle = -Math.PI / 2 + delta * (i + 1)
        const x = centerX + radius * Math.cos(angle)
        const y = centerY + radius * Math.sin(angle)
        return { x, y }
    })
}

// Update active item
function updateActive(newIndex: number, oldIndex: number) {
    itemEls[newIndex].classList.add("advantages__inner-item--active")
    itemEls[oldIndex].classList.remove("advantages__inner-item--active")
}

function initialRender() {
    const orbitInner = document.querySelector<HTMLDivElement>("#inner")
    const orbit = document.querySelector<HTMLDivElement>("#orbit")
    if (!orbitInner || !orbit) return
    const positions = getPositions(items.length, orbit.clientHeight)

    orbitInner.innerHTML = `
        ${items
            .map((item, i) => {
                const { x, y } = positions[i]
                return `
                  <div class="advantages__inner-item ${
                      i === activeIndex ? "advantages__inner-item--active" : ""
                  }" style="left:${x}px; top:${y}px;">
                    <div class="advantages__dot"></div>
                    <div class="advantages__text">
                      <h1 class="advantages__text-count">${item.count}</h1>
                      <h2 class="advantages__text-desc">${item.desc}</h2>
                    </div>
                  </div>
                `
            })
            .join("")}

  `
    itemEls = Array.from(
        orbitInner?.querySelectorAll(".advantages__inner-item") || []
    ) as HTMLElement[]
}

// Scroll logic
const galleryBlock = document.querySelector<HTMLDivElement>("#gallery-block")
if (galleryBlock) {
    let isScrolling = false
    galleryBlock.addEventListener("wheel", (e) => {
        if (isScrolling) return
        isScrolling = true
        setTimeout(() => (isScrolling = false), 400)
        const oldIndex = activeIndex
        if (e.deltaY > 0) {
            activeIndex = activeIndex < items.length - 1 ? activeIndex + 1 : 0
        } else if (e.deltaY < 0) {
            activeIndex = activeIndex > 0 ? activeIndex - 1 : items.length - 1
        }
        updateActive(activeIndex, oldIndex)
    })
}

// Update positions for window resize
function updatePositions() {
    const orbit = document.querySelector<HTMLDivElement>("#orbit")
    if (!orbit) return
    const positions = getPositions(items.length, orbit.clientHeight)
    itemEls.forEach((el, i) => {
        el.style.left = positions[i].x + "px"
        el.style.top = positions[i].y + "px"
    })
}

// Resize logic
window.addEventListener("resize", () => {
    updatePositions()
})

initialRender()
