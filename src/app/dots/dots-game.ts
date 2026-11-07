export const cellsPerSide = 10;
export const cornersPerSide = cellsPerSide + 1;

export type Player = 'Blue' | 'Red';
type Point = { x: number; y: number };
type Edge = { a: number; b: number; player: Player };

export const corners: Point[] = Array.from({ length: cornersPerSide ** 2 }, (_, index) => ({
  x: index % cornersPerSide,
  y: Math.floor(index / cornersPerSide),
}));

function opposite(player: Player): Player {
  return player === 'Blue' ? 'Red' : 'Blue';
}

function edgeKey(a: number, b: number): string {
  return a < b ? `${a}:${b}` : `${b}:${a}`;
}

function indexAt(x: number, y: number): number {
  return y * cornersPerSide + x;
}

function areaTwice(ring: number[]): number {
  return ring.reduce((area, index, i) => {
    const a = corners[index];
    const b = corners[ring[(i + 1) % ring.length]];
    return area + a.x * b.y - b.x * a.y;
  }, 0);
}

function inside(point: Point, ring: number[]): boolean {
  let contained = false;
  for (let i = 0; i < ring.length; i++) {
    const a = corners[ring[i]];
    const b = corners[ring[(i + 1) % ring.length]];
    if (point === a) return false;
    if ((a.y > point.y) !== (b.y > point.y) &&
      point.x < a.x + (b.x - a.x) * (point.y - a.y) / (b.y - a.y)) {
      contained = !contained;
    }
  }
  return contained;
}

export class DotsGame {
  private readonly dots = Array<Player | null>(corners.length).fill(null);
  private readonly territory = Array<Player | null>(corners.length).fill(null);
  private readonly edges = new Map<string, Edge>();
  private turn: Player = 'Blue';
  private filled = 0;

  play(index: number): boolean {
    if (!Number.isInteger(index) || this.dots[index] !== null) return false;

    const player = this.turn;
    this.dots[index] = player;
    this.filled++;
    for (const ring of this.closedRings(player, index)) {
      ring.forEach((a, i) => {
        const b = ring[(i + 1) % ring.length];
        this.edges.set(edgeKey(a, b), { a, b, player });
      });
      corners.forEach((point, i) => {
        if (inside(point, ring)) this.territory[i] = player;
      });
    }
    this.turn = opposite(player);
    return true;
  }

  snapshot() {
    const captured = this.dots.map((dot, index) => {
      const owner = this.territory[index];
      return dot && owner && dot !== owner ? owner : null;
    });
    return {
      dots: [...this.dots],
      edges: [...this.edges.values()],
      captured,
      blue: captured.filter((player) => player === 'Blue').length,
      red: captured.filter((player) => player === 'Red').length,
      turn: this.turn,
      finished: this.filled === corners.length,
    };
  }

  private closedRings(player: Player, move: number): number[][] {
    const graph = this.graph(player);
    const visited = new Set<string>();
    const rings: number[][] = [];

    // Walking the next clockwise face for each directed edge finds each bounded face once.
    graph.forEach((neighbors, start) => {
      for (const next of neighbors) {
        if (visited.has(`${start}:${next}`)) continue;
        const walk: number[] = [];
        let a = start;
        let b = next;
        do {
          visited.add(`${a}:${b}`);
          walk.push(a);
          const around = graph[b];
          const reverse = around.indexOf(a);
          [a, b] = [b, around[(reverse + around.length - 1) % around.length]];
        } while (a !== start || b !== next);

        if (!walk.includes(move)) continue;

        // Split at repeated vertices so an out-and-back spur never becomes a capture line.
        const path: number[] = [];
        for (const vertex of [...walk, start]) {
          const previous = path.indexOf(vertex);
          if (previous === -1) {
            path.push(vertex);
          } else {
            const ring = path.splice(previous + 1);
            ring.unshift(vertex);
            if (ring.includes(move) && areaTwice(ring) > 0) rings.push(ring);
          }
        }
      }
    });

    return rings;
  }

  private graph(player: Player): number[][] {
    const graph = corners.map(() => [] as number[]);
    const connect = (a: number, b: number) => {
      if (this.dots[a] !== player || this.dots[b] !== player) return;
      graph[a].push(b);
      graph[b].push(a);
    };

    for (let y = 0; y < cornersPerSide; y++) {
      for (let x = 0; x < cornersPerSide; x++) {
        const a = indexAt(x, y);
        if (x < cellsPerSide) connect(a, a + 1);
        if (y < cellsPerSide) connect(a, a + cornersPerSide);
        if (x === cellsPerSide || y === cellsPerSide) continue;

        const right = a + 1;
        const below = a + cornersPerSide;
        const diagonal = below + 1;
        // Only diagonals can cross. Keep committed lines and choose one diagonal
        // when both are available; the four perimeter edges are available then too.
        const descending = this.edges.has(edgeKey(a, diagonal));
        const ascending = this.edges.has(edgeKey(right, below));
        if (!ascending && (descending || (this.dots[a] === player && this.dots[diagonal] === player))) {
          connect(a, diagonal);
        } else if (!descending) {
          connect(right, below);
        }
      }
    }

    graph.forEach((neighbors, index) => {
      const { x, y } = corners[index];
      neighbors.sort((a, b) =>
        Math.atan2(corners[a].y - y, corners[a].x - x) - Math.atan2(corners[b].y - y, corners[b].x - x),
      );
    });
    return graph;
  }
}
