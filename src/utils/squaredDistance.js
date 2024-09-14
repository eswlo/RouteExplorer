export default function squaredDistance(cell1, cell2) {
    const x = Math.abs(cell1.x - cell2.x);
    const y = Math.abs(cell1.y - cell2.y);
    return (x*x + y*y);
}