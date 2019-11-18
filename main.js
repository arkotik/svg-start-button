function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
	const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
	return [centerX + (radius * Math.cos(angleInRadians)), centerY + (radius * Math.sin(angleInRadians))];
}

function describeArc(x, y, radius, startAngle, endAngle, mirror = false) {
	const [x1, y1] = polarToCartesian(x, y, radius, endAngle);
	const [x2, y2] = polarToCartesian(x, y, radius, startAngle);
	const arcSweep = endAngle - startAngle <= 180 ? '0' : '1';
	return [[x1, y1], [radius, radius, 0, arcSweep, +mirror, x2, y2]];
}

function getIntersection([[x1, y1], [x2, y2]], [[x3, y3], [x4, y4]]) {
	const denominator = ((y4 - y3) * (x2 - x1)) - ((x4 - x3) * (y2 - y1));
	const ua = (((x4 - x3) * (y1 - y3)) - ((y4 - y3) * (x1 - x3))) / denominator;
	const ub = (((x2 - x1) * (y1 - y3)) - ((y2 - y1) * (x1 - x3))) / denominator;
	return [x1 + ua * (x2 - x1), y1 + ua  * (y2 - y1)];
}

function move([[x1, y1], [x2, y2]], moveX = 0, moveY = 0) {
	return [[x1 + moveX, y1 + moveY], [x2 + moveX, y2 + moveY]];
}
function combine([innerStart, innerArc], [outerStart, outerArc]) {
	return ['M', ...innerStart, '\nA', ...innerArc, '\nL', ...outerStart, '\nA', ...outerArc, 'z'].join(' ');
}

function getPath(R, start, size = 120, width = 10, diff = 2) {
	const int = 180 - size;
	const center = [256, 256];
	const s1 = start;
	const e1 = s1 + size;
	const s2 = e1 + int;
	const e2 = s2 + size;
	const inner1 = describeArc(...center, R, s1, e1);
	const outer1 = describeArc(...center, R + width, e1 + diff, s1 - diff, true);

	const inner2 = describeArc(...center, R, s2, e2);
	const outer2 = describeArc(...center, R + width, e2 + diff, s2 - diff, true);

	return `${combine(inner1, outer1)}\n${combine(inner2, outer2)}`;
}

const arc1 = getPath(200, 100, 120, 10, 3);
const arc2 = getPath(220, 70, 120, 10, 3);
const arc3 = getPath(240, 30, 120, 10, 3);

console.log('arc1\n', arc1);
console.log('arc2\n', arc2);
console.log('arc3\n', arc3);

document.getElementById('arcs-1').setAttribute('d', arc1);
document.getElementById('arcs-2').setAttribute('d', arc2);
document.getElementById('arcs-3').setAttribute('d', arc3);