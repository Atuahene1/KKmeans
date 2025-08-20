// K-Means Clustering Demo (Vanilla JS)

const canvas = document.getElementById('kmeans-canvas');
const ctx = canvas.getContext('2d');
const kSelect = document.getElementById('k-select');
const assignBtn = document.getElementById('assign-btn');
const moveBtn = document.getElementById('move-btn');
const resetBtn = document.getElementById('reset-btn');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const POINT_RADIUS = 6;
const CENTROID_RADIUS = 10;
const COLORS = ['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33'];

let points = [];
let centroids = [];
let assignments = [];
let k = parseInt(kSelect.value);

function randomPoint() {
  return {
    x: Math.random() * (WIDTH - 40) + 20,
    y: Math.random() * (HEIGHT - 40) + 20
  };
}

function generatePoints(n=30) {
  points = [];
  for (let i = 0; i < n; i++) points.push(randomPoint());
}

function generateCentroids() {
  centroids = [];
  for (let i = 0; i < k; i++) centroids.push(randomPoint());
}

function draw() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  // Draw lines from points to centroids
  points.forEach((pt, i) => {
    if (assignments[i] !== undefined) {
      ctx.strokeStyle = COLORS[assignments[i]];
      ctx.beginPath();
      ctx.moveTo(pt.x, pt.y);
      ctx.lineTo(centroids[assignments[i]].x, centroids[assignments[i]].y);
      ctx.stroke();
    }
  });
  // Draw points
  points.forEach((pt, i) => {
    ctx.fillStyle = assignments[i] !== undefined ? COLORS[assignments[i]] : '#555';
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, POINT_RADIUS, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#333';
    ctx.stroke();
  });
  // Draw centroids
  centroids.forEach((c, i) => {
    ctx.fillStyle = COLORS[i];
    ctx.beginPath();
    ctx.arc(c.x, c.y, CENTROID_RADIUS, 0, 2 * Math.PI);
    ctx.fill();
    ctx.strokeStyle = '#900';
    ctx.stroke();
  });
}

function assignPoints() {
  assignments = points.map(pt => {
    let minDist = Infinity, idx = 0;
    centroids.forEach((c, i) => {
      const d = (pt.x - c.x) ** 2 + (pt.y - c.y) ** 2;
      if (d < minDist) { minDist = d; idx = i; }
    });
    return idx;
  });
  draw();
}

function moveCentroids() {
  for (let i = 0; i < k; i++) {
    const clusterPts = points.filter((_, idx) => assignments[idx] === i);
    if (clusterPts.length > 0) {
      centroids[i] = {
        x: clusterPts.reduce((sum, p) => sum + p.x, 0) / clusterPts.length,
        y: clusterPts.reduce((sum, p) => sum + p.y, 0) / clusterPts.length
      };
    }
  }
  draw();
}

function reset() {
  k = parseInt(kSelect.value);
  generatePoints();
  generateCentroids();
  assignments = Array(points.length).fill(undefined);
  draw();
}

kSelect.addEventListener('change', reset);
assignBtn.addEventListener('click', assignPoints);
moveBtn.addEventListener('click', moveCentroids);
resetBtn.addEventListener('click', reset);

// Initial setup
reset();
