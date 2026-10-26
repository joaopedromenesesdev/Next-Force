import confetti from 'canvas-confetti';

export function fireClosedWonCelebration() {
  // Disparo comemorativo estilo Stripe/Linear
  const count = 200;
  const defaults = {
    origin: { y: 0.7 }
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio)
    });
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
    colors: ['#D4AF37', '#F3E5AB', '#FFFFFF']
  });
  fire(0.2, {
    spread: 60,
    colors: ['#D4AF37', '#C5A059', '#09090B']
  });
  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
    colors: ['#E5C158', '#FFFFFF', '#B8860B']
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    colors: ['#F3E5AB', '#D4AF37']
  });
  fire(0.1, {
    spread: 120,
    startVelocity: 45,
    colors: ['#D4AF37', '#FFFFFF']
  });
}
