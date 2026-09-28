/**
 * Browser Speech Synthesis helper for Spanish and Armenian text.
 */

let currentUtterance: SpeechSynthesisUtterance | null = null;

export function speakText(
  text: string,
  lang: 'es' | 'hy',
  rate: number = 0.95,
  onStart?: () => void,
  onEnd?: () => void
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate;
  utterance.pitch = 1.0;

  // Language code selection
  if (lang === 'es') {
    utterance.lang = 'es-ES';
  } else {
    utterance.lang = 'hy-AM';
  }

  // Find matching voice if available
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    if (lang === 'es') {
      const esVoice = voices.find(
        (v) => v.lang.startsWith('es') || v.lang.includes('ES')
      );
      if (esVoice) utterance.voice = esVoice;
    } else {
      const hyVoice = voices.find(
        (v) => v.lang.startsWith('hy') || v.lang.includes('AM')
      );
      if (hyVoice) utterance.voice = hyVoice;
    }
  }

  utterance.onstart = () => {
    currentUtterance = utterance;
    if (onStart) onStart();
  };

  utterance.onend = () => {
    currentUtterance = null;
    if (onEnd) onEnd();
  };

  utterance.onerror = () => {
    currentUtterance = null;
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
  return true;
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
