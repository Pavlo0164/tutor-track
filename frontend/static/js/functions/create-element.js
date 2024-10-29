export default function createElement(
	tag,
	classEl,
	attr,
	innerTextEl,
	parentElement
) {
	const element = document.createElement(tag)
	if (classEl) {
		if (Array.isArray(classEl))
			classEl.forEach((el) => element.classList.add(el))
		else element.classList.add(classEl)
	}
	if (attr) {
		Object.entries(attr).forEach(([key, value]) => {
			element.setAttribute(key, value)
		})
	}
	if (innerTextEl) element.innerText = innerTextEl
	if (parentElement) parentElement.append(element)
	return element
}
