<script lang="ts">
  import { onMount } from "svelte";
  import * as THREE from "three";

  import { sleep } from "../libs/utils";

  const generatePositions = async (count: number) => {
    const positions = [[0, 0, 0]];

    while (positions.length <= count) {
      const index = Math.floor(Math.random() * 3);
      const value = Math.random() < 0.5 ? -1 : 1;
      const positionsCopy = structuredClone(positions);
      const random =
        positionsCopy[Math.floor(Math.random() * positionsCopy.length)];

      random[index] += value;

      if (!positions.some((arr) => arr.every((num, i) => num === random[i]))) {
        positions.push(random);
      }
    }

    return positions;
  };

  onMount(async () => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#ffffff");
    const camera = new THREE.PerspectiveCamera(35);
    const canvasDomEl: Element | null = document.querySelector("#top_blocks");

    if (canvasDomEl) {
      const positions = await generatePositions(500);

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: canvasDomEl,
      });
      renderer.setSize(250, 250);
      renderer.setPixelRatio(window.devicePixelRatio * 2);

      camera.position.set(25, 25, 25);
      camera.lookAt(scene.position);

      const cubes = new THREE.Group();
      scene.add(cubes);

      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshBasicMaterial({ color: "#000000" });
      const outlineMaterial = new THREE.LineBasicMaterial({
        color: "#ffffff",
      });
      const edges = new THREE.EdgesGeometry(geometry);

      const firstCube = new THREE.Mesh(geometry, material);
      const firstOutline = new THREE.LineSegments(edges, outlineMaterial);

      firstCube.position.set(0, 0, 0);
      firstOutline.position.set(0, 0, 0);
      firstOutline.renderOrder = 1;
      cubes.add(firstCube);
      scene.add(firstOutline);

      renderer.render(scene, camera);

      for (const position of positions) {
        const cube = new THREE.Mesh(geometry, material);
        const outline = new THREE.LineSegments(edges, outlineMaterial);

        cube.position.set(...(position as [number, number, number]));
        outline.position.set(...(position as [number, number, number]));
        outline.renderOrder = 1;

        cubes.add(cube);
        scene.add(outline);

        renderer.render(scene, camera);

        await sleep(25);
      }
    }
  });
</script>

<canvas id="top_blocks" />
