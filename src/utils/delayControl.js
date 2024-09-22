let delayTime = 0;
let isPause = false;
let resolve;

function setDelayTime(newDelayTime) {
    delayTime = newDelayTime;
}

const delay = () => {
    return new Promise((res) => {
        resolve = res;
        setTimeout(() => {
            if (!isPause) {
                resolve();
            }
        }, delayTime)
    }); // Wait for certain amount of tiie between each loop
}

const pause = () => {
    isPause = !isPause;
    if (!isPause) {
        resolve();
    };
}

export { setDelayTime, delay, pause }
