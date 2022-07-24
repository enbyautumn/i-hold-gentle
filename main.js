/** @type {HTMLCanvasElement} */
let canvas = document.getElementById("canvas")
let ctx = canvas.getContext("2d")

let scale = 2

canvas.width = 612 * scale
canvas.height = 408 * scale
ctx.scale(scale, scale)

let bottomLayerPreload = new Image()
bottomLayerPreload.src = "bottom-layer.png"

let topLayerPreload = new Image()
topLayerPreload.src = "top-layer.png"

let centerX = 335
let maxWidth = 250

let bottomY = 227
let maxHeight = 200

function waitForLoad(url) {
    return new Promise((resolve, reject) => {
        let image = new Image()
        image.onload = () => resolve(image)
        image.onabort = () => reject("Image failed to load")
        image.src = url
    })
}

async function main(url) {
    console.log(url)
    let topLayer = await waitForLoad("top-layer.png")
    let bottomLayer = await waitForLoad("bottom-layer.png")

    let hold = await waitForLoad(url)

    let scalar;
    if (hold.height > hold.width) {
        scalar = hold.height / maxHeight
    } else {
        scalar = hold.width / maxWidth
    }

    ctx.drawImage(bottomLayer, 0, 0)
    ctx.drawImage(hold, centerX - ((hold.width / scalar) / 2), bottomY, (hold.width / scalar), -(hold.height / scalar))
    ctx.drawImage(topLayer, 0, 0)

    return true
}

/** @type {HTMLFormElement} */
let form = document.getElementById("form")
/** @type {HTMLInputElement} */
let input = document.getElementById("url")

form.addEventListener("submit", e => {
    e.preventDefault()
    main(`https://cors.evaexists.workers.dev/?url=${input.value}`)
})

// console.log(main("https://image.shutterstock.com/image-photo/cyber-woman-corn-600w-42829624.jpg"))

let toggle = false

canvas.ontouchstart = () => {
    if (!toggle) {
        canvas.style.width = "100vw"
        document.getElementById("title").style.display = "none"
        form.style.display = "none"
        document.body.style.backgroundColor = "black"
        toggle = true
    } else {
        canvas.style = ""
        document.getElementById("title").style.display = ""
        form.style.display = ""
        document.body.style.backgroundColor = "white"
        toggle = false
    }
}

document.onpaste = (evt) => {
    const dT = evt.clipboardData || window.clipboardData;
    const file = dT.files[0];

    if (file && file.type.startsWith("image")) {
        console.log("yes")
        main(URL.createObjectURL(file))
    }
};

window.onload = () => main("https://images.fineartamerica.com/images/artworkimages/mediumlarge/1/scottish-highland-cow-trossachs-grant-glendinning.jpg")