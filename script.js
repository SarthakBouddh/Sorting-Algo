const sleep = (delay) => new Promise(r => setTimeout(r, delay));

const toggleBtns = (btns) => {
    btns.forEach(btn => btn.toggleAttribute("disabled"));
}

const generateElements = (count, boardBox) => {
    const arr = [...new Array(100).keys()].slice(5);
    const heightUnit = boardBox.clientHeight / 100;
    const computedStyle = getComputedStyle(boardBox);
    const totalWidth = boardBox.clientWidth - parseFloat(computedStyle.paddingLeft) - parseFloat(computedStyle.paddingRight);
    const widthUnit = (totalWidth - (count + 1)) / count;

    boardBox.innerHTML = "";
    while (count--) {
        const div = document.createElement("div");
        div.classList.add("bar");
        const heightInd = Math.floor(Math.random() * arr.length);
        div.style.height = `${(arr[heightInd] + 1) * heightUnit}px`;
        div.style.width = `${widthUnit}px`;
        div.dataset.value = arr[heightInd] + 1;
        arr.splice(heightInd, 1);
        boardBox.appendChild(div);
    }
}

const renderChange = (boardBox, bars) => {
    boardBox.innerHTML = "";
    for (let bar of bars) {
        boardBox.appendChild(bar);
    }
}

const getNewBars = (boardBox) => {
    const bars = [...boardBox.querySelectorAll(".bar")];
    for(let bar of bars) {
        bar.classList.remove("active");
        bar.classList.remove("sorted");
    }
    return bars;
}

const bubbleSort = async (boardBox, delayEl) => {
    const bars = getNewBars(boardBox);
    for(let i = 0; i < bars.length; i++) {
        for(let j = 0; j < bars.length - i - 1; j++) {
            bars[j].classList.add("active");
            await sleep(delayEl.value);
            if (+bars[j].dataset.value > +bars[j + 1].dataset.value) {
                [bars[j + 1], bars[j]] = [bars[j], bars[j + 1]];
                renderChange(boardBox, bars);
            }
            bars.forEach(el => el.classList.remove("active"));
        }
        bars[bars.length - i - 1].classList.add("sorted");
    }
}


const selectionSort = async (boardBox, delayEl) => {
    const bars = getNewBars(boardBox);
    for(let i = 0 ; i < bars.length ; i++) {
        let minInd = i;
        for(let j = i ; j < bars.length ; j++) {
            bars[j].classList.add("active");
            await sleep(delayEl.value);
            if(+bars[j].dataset.value < +bars[minInd].dataset.value) {
                minInd = j;
            }
            bars.forEach(el => el.classList.remove("active"));
        }
        [bars[i], bars[minInd]] = [bars[minInd], bars[i]];
        bars[i].classList.add("sorted");
        renderChange(boardBox, bars);
    }
}

const insertionSort = async (boardBox, delayEl) => {
    const bars = getNewBars(boardBox);

    for(let i = 0 ; i < bars.length ; i++) {
        bars[i].classList.add("active");
        let j = i - 1;
        while(j >= 0) {
            await sleep(delayEl.value);
            if(+bars[j].dataset.value > +bars[j + 1].dataset.value) {
                [bars[j], bars[j + 1]] = [bars[j + 1], bars[j]];
                renderChange(boardBox, bars);
            } else {
                break;
            }
            j--;
        }

        bars[j + 1].classList.remove("active");
        bars[j + 1].classList.add("sorted");
    }
}

const mergeSort = async (boardBox, delayEl) => {
    const bars = getNewBars(boardBox);

    const merge = (left, right) => {
        const subBars = bars.slice(left, right + 1);
        subBars.sort((a, b) => +a.dataset.value - +b.dataset.value);
        for (let i = left; i <= right; i++) {
            bars[i] = subBars[i - left];
            bars[i].classList.add("sorted");
            renderChange(boardBox, bars);
        }
    }

    const mergeSortHelper = async (left, right) => {
        if (left < right) {
            const mid = Math.floor((left + right) / 2);
            await mergeSortHelper(left, mid);
            await mergeSortHelper(mid + 1, right);
            await sleep(delayEl.value);
            merge(left, right);
        }
    }

    await mergeSortHelper(0, bars.length - 1);
}

const radixSort = async (boardBox, delayEl) => {
    const bars = getNewBars(boardBox);
    const max = Math.max(...bars.map(el => +el.dataset.value));
    const maxDigits = max.toString().length;

    const getDigit = (value, pos) => {
        return ((value % Math.pow(10, pos + 1)) / Math.pow(10, pos));
    }

    for(let i = 0 ; i < maxDigits ; i++) {
        bars.forEach(el => el.classList.remove("sorted"));
        for(let j = 0 ; j < bars.length ; j++) {
            bars[j].classList.add("active");
            let k = j - 1;
            while(k >= 0) {
                await sleep(delayEl.value);
                if(getDigit(+bars[k].dataset.value, i) > getDigit(+bars[k + 1].dataset.value, i)) {
                    [bars[k], bars[k + 1]] = [bars[k + 1], bars[k]];
                    renderChange(boardBox, bars);
                } else {
                    break;
                }
                k--;
            }
            bars[k + 1].classList.remove("active");
            bars[k + 1].classList.add("sorted");
        }
    }
}

window.addEventListener("load", async () => {
    setTimeout(() => {
        window.scrollTo(0, document.body.scrollHeight);
    }, 0);

    const boardBox = document.querySelector(".box");
    const countEl = document.querySelector("input#count");
    const delayEl = document.querySelector("input#delay");
    const btns = document.querySelectorAll("button");

    const generateBtn = document.querySelector("button#generate-elements");

    generateElements(+countEl.value, boardBox);
    generateBtn.addEventListener("click", (e) => {
        if(e.target.hasAttribute("disabled")) return;
        generateElements(+countEl.value, boardBox);
    });

    const bubbleSortBtn = document.querySelector("#bubble");
    bubbleSortBtn.addEventListener("click", async (e) => {
        if(e.target.hasAttribute("disabled")) return;
        toggleBtns(btns);
        await bubbleSort(boardBox, delayEl);
        toggleBtns(btns);
    });

    const selectionSortBtn = document.querySelector("#selection");
    selectionSortBtn.addEventListener("click", async (e) => {
        if(e.target.hasAttribute("disabled")) return;
        toggleBtns(btns);
        await selectionSort(boardBox, delayEl);
        toggleBtns(btns);
    });

    const insertionSortBtn = document.querySelector("#insertion");
    insertionSortBtn.addEventListener("click", async (e) => {
        if(e.target.hasAttribute("disabled")) return;
        toggleBtns(btns);
        await insertionSort(boardBox, delayEl);
        toggleBtns(btns);
    });

    const mergeSortBtn = document.querySelector("#merge");
    mergeSortBtn.addEventListener("click", async (e) => {
        if(e.target.hasAttribute("disabled")) return;
        toggleBtns(btns);
        await mergeSort(boardBox, delayEl);
        toggleBtns(btns);
    });
});
