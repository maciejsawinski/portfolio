<script lang="ts">
  import { onMount } from "svelte";
  import * as THREE from "three";

  import sleep from "../utils/sleep";
  import random from "../utils/random";

  const cubeGen = (
    sceneInstance: THREE.Scene,
    geometry: THREE.BoxGeometry,
    material: THREE.MeshBasicMaterial,
    position: [x: number, y: number, z: number]
  ) => {
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(...position);
    sceneInstance.add(cube);
  };

  onMount(async () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const canvasDomEl: Element | null = document.querySelector("#blocks");

    if (canvasDomEl) {
      const renderer = new THREE.WebGLRenderer({
        canvas: canvasDomEl,
      });
      renderer.setSize(500, 500);

      camera.position.set(25, 25, 25);
      camera.lookAt(scene.position);

      const cubes = new THREE.Group();
      scene.add(cubes);

      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshBasicMaterial({ color: "white" });

      const firstCube = new THREE.Mesh(geometry, material);
      firstCube.position.set(0, 0, 0);
      cubes.add(firstCube);

      renderer.render(scene, camera);

      for (let i = 0; i < 100; i++) {
        await sleep(100);

        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(random(-20, 20), random(-20, 20), random(-20, 20));

        let closestCube: THREE.Object3D | any = null;
        let closestDistance = Infinity;
        cubes.children.forEach((existingCube) => {
          const distance = existingCube.position.distanceTo(cube.position);
          if (distance < closestDistance) {
            closestCube = existingCube;
            closestDistance = distance;
          }
        });

        if (closestCube instanceof THREE.Object3D) {
          const newPosition = closestCube.position
            .clone()
            .add(cube.position.clone().sub(closestCube.position));
          cube.position.copy(newPosition);

          cubes.add(cube);
        }

        renderer.render(scene, camera);
      }

      // const animate = () => {
      //   requestAnimationFrame(animate);

      //   renderer.render(scene, camera);
      // };
      // animate();
    }
  });
</script>

<canvas id="blocks" />
