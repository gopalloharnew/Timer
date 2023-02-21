const inputHours = document.querySelector("#timer-input-hours")
const inputMinutes = document.querySelector("#timer-input-minutes")
const inputSeconds = document.querySelector("#timer-input-seconds")
const inputs = [inputHours, inputMinutes, inputSeconds]
let timer 

const startButton = document.querySelector("#start-button")
const resetButton = document.querySelector("#reset-button")
const countdownInfoDisplay = document.querySelector(".countdown-info-display")

const timerBox = document.querySelector("[data-timer-box]")

const alarm = new Audio("./alarm.wav")

// Countdown
class Countdown{
    constructor(){
        this.startDate = new Date()
        this.inputs = [...inputs]
        this.frameRate = 4
        this.timeValue = []
        startButton.classList.add("hide")
        this.inputs.forEach(inputElement =>{
            this.timeValue.push(parseInt(inputElement.value))
            inputElement.disabled = "true"
        })
        countdownInfoDisplay.textContent = inputs[0].value + ":" + inputs[1].value + ":" + inputs[2].value
        this.length = hmsToms(...this.timeValue)/1000
        this.animationFrame
        this.lastPaintTime = 0
        // window.requestAnimationFrame(this.update)
        this.update()
    }
    
    update = ()=>{
        // if(ctime - this.lastPaintTime > (1000/this.frameRate)){
        //     this.animationFrame = window.requestAnimationFrame(this.update)
        // }
        this.animationFrame = setTimeout(() => {
            this.update()
        }, 1000/this.frameRate);
        let currentDate = new Date()
        this.secondsPassed = (currentDate - this.startDate)/1000
        if(this.length<this.secondsPassed){
            this.currentTimerValue = [0, 0, 0]
            this.timeOver()
        }else{   
            this.currentTimerValue = sTohms(this.length - this.secondsPassed)
        }
        for (let i = 0; i < this.currentTimerValue.length; i++) {
            const elem = this.inputs[i]
            const value = this.currentTimerValue[i];
            elem.value = value
            addLeadingZero(elem)
        }
    }

    timeOver(){
        window.cancelAnimationFrame(this.animationFrame)
        alarm.play()
    }
}

// add leading zero
function addLeadingZero(inputElement){
    if(inputElement.value < 10){
        inputElement.value = "0" + inputElement.value
    }
}

function resetTimer(){
    startButton.classList.remove("hide")
    inputs.forEach(inputElement =>{
        inputElement.value = 00
        inputElement.removeAttribute("disabled")
        addLeadingZero(inputElement)
    })

    alarm.pause()
    alarm.currentTime = 0

    countdownInfoDisplay.textContent = inputs[0].value + ":" + inputs[1].value + ":" + inputs[2].value

    if(timer){
        // window.cancelAnimationFrame(timer.animationFrame)
        clearInterval(timer.animationFrame)
    }

    timer = null
}

// hms to ms
const hmsToms = (h,m,s) => {
    return ((h*60*60*1000) + (m*60*1000) + (s*1000))
}

const sTohms = (s) => {
    let h = Math.floor(s/(60*60))
    let min = Math.floor((s%(60*60)) / (60))
    let sec = (Math.floor(s%(60*60)) % (60))
    return [h, min, sec]
}

inputs.forEach(inputElement => {
    inputElement.addEventListener("input", ()=>{addLeadingZero(inputElement)})
});

// start
startButton.addEventListener("click", ()=>{
    timer = new Countdown()
})

resetButton.addEventListener("click", resetTimer)


// move window
const topBar = document.querySelector(".top-bar")

let topBarDown = false
let topBarDownX
let topBarDownY
topBar.addEventListener("mousedown", (e)=>{
    topBarDown = true
    topBarDownX = e.layerX
    topBarDownY = e.layerY
    postionTimer(e.x - topBarDownX, e.y - topBarDownY)
})
window.addEventListener("mousemove", (e)=>{
    if(!topBarDown) return
    postionTimer(e.x -topBarDownX , e.y - topBarDownY )
})


window.addEventListener("mouseup", (e)=>{
    topBarDown = false
})
function postionTimer(x,y){
    timerBox.style.left = x+"px"
    timerBox.style.top = y+"px"
}