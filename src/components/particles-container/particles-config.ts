export const options = {
  fpsLimit: 60,
  interactivity: {
    events: {
      onClick: {
        enable: true,
        mode: 'push',
      },
    },
    modes: {
      push: {
        quantity: 1,
      },
      remove: {
        quantity: 1,
      },
    },
  },
  particles: {
    color: {
      value: '#000',
    },
    links: {
      color: '#000',
      distance: 175,
      enable: true,
      opacity: 0.5,
      width: 1,
    },
    move: {
      enable: true,
      outModes: {
        default: 'bounce' as const,
      },
      random: false,
      speed: 0.05,
      straight: false,
    },
    number: {
      density: {
        enable: true,
      },
      value: 150,
      limit: {
        value: 150,
      },
    },
    opacity: {
      value: 0.5,
    },
    size: {
      value: { min: 0, max: 0 },
    },
  },
  detectRetina: true,
};
