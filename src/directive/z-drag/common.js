// 获取鼠标所在div的位置
export function getDirection(ev, el) {
    let xP, yP, offset, dir;
    dir = '';

    xP = ev.offsetX;
    yP = ev.offsetY;
    offset = 10;

    if (yP < offset) dir += 'n';
    else if (yP > el.offsetHeight - offset) dir += 's';
    if (xP < offset) dir += 'w';
    else if (xP > el.offsetWidth - offset) dir += 'e';

    return dir;
}