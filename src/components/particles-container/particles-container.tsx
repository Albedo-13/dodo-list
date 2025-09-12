import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim'; // if you are going to use `loadSlim`, install the "@tsparticles/slim" package too.
import { useEffect } from 'react';

import { options } from './particles-config';

export function ParticlesContainer() {
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    });
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full z-[-1]">
      <Particles id="tsparticles" options={options} />
    </div>
  );
}
