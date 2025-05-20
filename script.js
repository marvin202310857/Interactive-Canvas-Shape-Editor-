// Interactive Canvas Shape Editor

// Get canvas and context
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Circle data structure
let circles = [];
const defaultRadius = 20;
const minRadius = 5;

let selectedCircleIndex = -1;
let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;

// Draw all circles on the canvas
function drawCircles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    circles.forEach((circle, index) => {
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.fillStyle = circle.selected ? 'red' : 'blue';
        ctx.fill();
        ctx.closePath();
    });
}

// Check if point (x, y) is inside a circle
function isPointInCircle(x, y, circle) {
    const dx = x - circle.x;
    const dy = y - circle.y;
    return Math.sqrt(dx * dx + dy * dy) <= circle.radius;
}

// Get circle index at point (x, y), or -1 if none
function getCircleAtPoint(x, y) {
    for (let i = circles.length - 1; i >= 0; i--) {
        if (isPointInCircle(x, y, circles[i])) {
            return i;
        }
    }
    return -1;
}

// Canvas click event to add/select circles
canvas.addEventListener('click', function(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const clickedIndex = getCircleAtPoint(x, y);

    if (clickedIndex === -1) {
        // Clicked blank space: add new circle
        circles.forEach(c => c.selected = false);
        circles.push({ x: x, y: y, radius: defaultRadius, selected: false });
        selectedCircleIndex = -1;
    } else {
        // Clicked on a circle: select it
        circles.forEach(c => c.selected = false);
        circles[clickedIndex].selected = true;
        selectedCircleIndex = clickedIndex;
    }
    drawCircles();
});

// Mouse down event to start dragging if a circle is selected
canvas.addEventListener('mousedown', function(event) {
    if (selectedCircleIndex === -1) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const circle = circles[selectedCircleIndex];
    if (isPointInCircle(x, y, circle)) {
        isDragging = true;
        dragOffsetX = x - circle.x;
        dragOffsetY = y - circle.y;
    }
});

// Mouse move event to drag the selected circle
canvas.addEventListener('mousemove', function(event) {
    if (!isDragging || selectedCircleIndex === -1) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    circles[selectedCircleIndex].x = x - dragOffsetX;
    circles[selectedCircleIndex].y = y - dragOffsetY;

    drawCircles();
});

// Mouse up event to stop dragging
canvas.addEventListener('mouseup', function() {
    isDragging = false;
});

// Mouse leave event to stop dragging if mouse leaves canvas
canvas.addEventListener('mouseleave', function() {
    isDragging = false;
});

// Keydown event to delete selected circle on Delete key
window.addEventListener('keydown', function(event) {
    if (event.key === 'Delete' && selectedCircleIndex !== -1) {
        circles.splice(selectedCircleIndex, 1);
        selectedCircleIndex = -1;
        drawCircles();
    }
});

// Wheel event to resize selected circle
canvas.addEventListener('wheel', function(event) {
    if (selectedCircleIndex === -1) return;

    event.preventDefault();

    const circle = circles[selectedCircleIndex];
    if (event.deltaY < 0) {
        // Scroll up: increase radius
        circle.radius += 2;
    } else {
        // Scroll down: decrease radius but not below minRadius
        circle.radius = Math.max(minRadius, circle.radius - 2);
    }
    drawCircles();
});
