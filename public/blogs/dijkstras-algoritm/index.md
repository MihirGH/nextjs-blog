---
title: Dijkstra's Algorithm and its proof of correctness
date: 2023-11-10
spoiler: Dijkstra's algorithm for shortest path in a graph with non-negative edge weights and its proof of correctness
cta: graphs
---

## Algorithm

Input to the function is a graph `G = <V, E>` weighted by the cost function `w`: `E` &rarr; `Z`<sup>+</sup> and a source vertex `s`. We assume that there are no negative cost edges. We will use adjacency list representation for our graph.

```tsx
type Node = {
  value: number;
};

class Graph {
  private adjList: Map<Node, Array<{ target: Node; weight: number }>>;
  public getNodes(): Node[];
  public getNeighbors(): Array<{ target: Node; weight: number }>;
}

type Return = Map<Node, number>;

function DIJKSTRA(graph: Graph, source: Node): Return {
  const nodes = graph.getNodes();

  // initialize all the other nodes' distance with infinity
  const distanceMap = new Map(nodes.map((node) => [node, Math.Infinity]));
  const predecessorMap = new Map<Node, Node | null>();
  distanceMap.set(source, 0);
  predecessorMap.set(source, null);

  function relaxEdge(u: Node, v: Node, w: number) {
    const du = distanceMap.get(u);
    const dv = distanceMap.get(v);

    if (dv <= du + w) return;

    distanceMap.set(v, du + w);
    predecessorMap.set(v, u);
  }

  // we will refer to the visitedSet as processed set or cloud in our proof
  const visitedSet = new Set<Node>();

  const minHeap = new MinHeap<{ node: Node; distance: number }>();
  minHeap.push({ node: source, distance: distanceMap.get(source) });

  while (!minHeap.isEmpty()) {
    const { node: u, distance: du } = minHeap.pop();
    // mark the node as visited
    visitedSet.add(u);

    u.getNeighbors().forEach((neighbor) => {
      const { target: v, weight: w } = neighbor;
      // if the node has already been visited then it means that
      // distanceMap.get(v) will have the shortest path till v
      // so we don't need to do anything here
      if (visitedSet.has(v)) return;

      relaxEdge(u, v, w);
      minHeap.push({ node: v, distance: distanceMap.get(v) });
    });
  }

  return distanceMap;
}
```

## Proof of correctness

Let `d[u]` denote the shortest distance calculated by above algorithm between source node and some node `u` in the vertex set `V`. Let `D[u]` be the actual shortest distance from source vertex to vertex `u`.

For correctness, we need to prove that for all `u` in the vertex set `V`, `d[u] = D[u]`.

### Proof by Contradiction

Let's assume that `u` is a first such vertex that is pulled into the cloud such that `d[u] > D[u]`.
Without loss of generality, let's assume that `y` is the first vertex along the shortest path from `s` to `u` and `x` is its predecessor.

`D[u] = D[y] + D[y, u]`, i.e., `D[u] >= D[y]` since all the edges have non-negative weights. In other words,

`D[y] <= D[u]` -- (Obs. 1)

Since `x` has already been added to the cloud, `d[x] = D[x]` and during its edge relaxation step, we would have set `d[y]` as `D[x] + w(x, y)`.

But since `y` is along the shortest path to `u` we can say that, the subpath from `s` to `y` is also the shortest path and hence, `D[y] = D[x] + w(x, y)` which is nothing but `d[y]`.

`d[y] = D[y]` -- (Obs. 2)

Since `u` was chosen before `y` by our algorithm, `d[u] <= d[y]`.

By second observation, `d[u] <= D[y]` and by first observation `D[y] <= D[u]` which implies that `d[u] <= D[u]` -- which is a contradiction to our assumption that `d[u] > D[u]`.

## References

1. [Dijkstra's algorithm - Proof by Heather Guarnera](https://www.youtube.com/watch?v=HXhJIDB6EcM)
2. [Dijkstra's algorithm - Correctness by Induction](https://web.engr.oregonstate.edu/~glencora/wiki/uploads/dijkstra-proof.pdf)
3. [Correctness of Dijkstra's algorithm by K. Subramani](https://community.wvu.edu/~krsubramani/courses/fa05/gaoa/qen/dijk.pdf)
