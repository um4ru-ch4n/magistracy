from itertools import cycle
from math import hypot
from numpy import random
import matplotlib.pyplot as plt


def dbscan_naive(P, eps, m, distance):

    NOISE = 0
    C = 0

    visited_points = set()
    clustered_points = set()
    clusters = {NOISE: []}

    def region_query(p):
        return [q for q in P if distance(p, q) < eps]

    def expand_cluster(p, neighbours):
        if C not in clusters:
            clusters[C] = []
        clusters[C].append(p)
        clustered_points.add(p)
        while neighbours:
            q = neighbours.pop()
            if q not in visited_points:
                visited_points.add(q)
                neighbourz = region_query(q)
                if len(neighbourz) > m:
                    neighbours.extend(neighbourz)
            if q not in clustered_points:
                clustered_points.add(q)
                clusters[C].append(q)
                if q in clusters[NOISE]:
                    clusters[NOISE].remove(q)

    for p in P:
        if p in visited_points:
            continue
        visited_points.add(p)
        neighbours = region_query(p)
        if len(neighbours) < m:
            clusters[NOISE].append(p)
        else:
            C += 1
            expand_cluster(p, neighbours)

    return clusters


if __name__ == "__main__":
    P = [(random.randn()/6, random.randn()/6) for i in range(150)]
    P.extend([(random.randn()/4 + 2.5, random.randn()/5) for i in range(150)])
    P.extend([(random.randn()/5 + 1, random.randn()/2 + 1)
             for i in range(150)])
    P.extend([(i/25 - 1, + random.randn()/20 - 1) for i in range(100)])
    P.extend([(i/25 - 2.5, 3 - (i/50 - 2)**2 + random.randn()/20)
             for i in range(150)])

    clusters = dbscan_naive(P, 0.3, 10, lambda x,
                            y: hypot(x[0] - y[0], x[1] - y[1]))
    for c, points in zip(cycle('bgrcmykgrcmykgrcmykgrcmykgrcmykgrcmyk'), clusters.values()):
        X = [p[0] for p in points]
        Y = [p[1] for p in points]
        plt.scatter(X, Y, c=c)
    plt.show()
