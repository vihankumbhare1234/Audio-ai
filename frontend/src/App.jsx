import { useEffect, useMemo, useState } from 'react';
import meSpeak from 'mespeak';
import meSpeakConfig from 'mespeak/mespeak_config.json';
import enVoice from 'mespeak/voices/en/en.json';

const SUPPORTED = typeof window !== 'undefined' && 'speechSynthesis' in window;

function App() {
  const [text, setText] = useState('Hello, this is a text-to-speech demo.');
  const [voices, setVoices] = useState([]);
  const [voiceIndex, setVoiceIndex] = useState(0);
  const [status, setStatus] = useState('ready');
  const [error, setError] = useState('');
  const [speaking, setSpeaking] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [generatingDownload, setGeneratingDownload] = useState(false);

  useEffect(() => {
    meSpeak.loadConfig(meSpeakConfig);
    meSpeak.loadVoice(enVoice);
  }, []);

  useEffect(() => {
    if (!SUPPORTED) {
      setError('Speech Synthesis is not supported by this browser.');
      return;
    }

    const updateVoices = () => {
      const available = window.speechSynthesis.getVoices();
      setVoices(available);
      if (available.length > 0 && voiceIndex >= available.length) {
        setVoiceIndex(0);
      }
    };

    updateVoices();
    window.speechSynthesis.addEventListener('voiceschanged', updateVoices);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', updateVoices);
  }, [voiceIndex]);

  const selectedVoice = useMemo(() => voices[voiceIndex], [voices, voiceIndex]);

  const speakText = () => {
    if (!SUPPORTED) return;
    if (!text.trim()) {
      setError('Please enter some text first.');
      return;
    }

    window.speechSynthesis.cancel();
    setError('');
    setStatus('speaking');
    setSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(text);
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.onend = () => {
      setStatus('ready');
      setSpeaking(false);
    };
    utterance.onerror = (event) => {
      setError(`Speech error: ${event.error || 'unknown'}`);
      setStatus('ready');
      setSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeech = () => {
    if (!SUPPORTED) return;
    window.speechSynthesis.cancel();
    setStatus('ready');
    setSpeaking(false);
  };

  const generateDownload = () => {
    if (!text.trim()) {
      setError('Please enter some text first.');
      return;
    }

    setError('');
    setGeneratingDownload(true);
    setDownloadUrl('');

    try {
      const dataUrl = meSpeak.speak(text, {
        amplitude: 100,
        wordgap: 1,
        pitch: 50,
        speed: 175,
        rawdata: 'dataURL'
      });

      setDownloadUrl(dataUrl);
    } catch (err) {
      setError('Audio download generation failed.');
    } finally {
      setGeneratingDownload(false);
    }
  };

  return (
    <div className="app-shell">
      <header>
        <h1>Audio AI Text-to-Speech</h1>
        <p>Static React UI ready for GitHub Pages hosting.</p>
      </header>

      <main>
        <div className="field">
          <label htmlFor="textInput">Text to convert</label>
          <textarea
            id="textInput"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Enter the text you want spoken aloud"
          />
        </div>

        <div className="field controls">
          <div className="control-group">
            <label htmlFor="voiceSelect">Voice</label>
            <select
              id="voiceSelect"
              value={voiceIndex}
              onChange={(event) => setVoiceIndex(Number(event.target.value))}
              disabled={voices.length === 0}
            >
              {voices.length === 0 ? (
                <option>Loading voices...</option>
              ) : (
                voices.map((voice, index) => (
                  <option key={voice.name + index} value={index}>
                    {voice.name} ({voice.lang})
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="control-group buttons">
            <button onClick={speakText} disabled={!SUPPORTED || speaking}>
              Speak
            </button>
            <button onClick={stopSpeech} disabled={!SUPPORTED || !speaking} className="secondary">
              Stop
            </button>
          </div>
        </div>

        <div className="field controls">
          <div className="control-group buttons">
            <button onClick={generateDownload} disabled={generatingDownload}>
              {generatingDownload ? 'Generating...' : 'Generate Download'}
            </button>
            {downloadUrl && (
              <a href={downloadUrl} download="speech.wav" className="download-link">
                Download WAV
              </a>
            )}
          </div>
        </div>

        <div className="status-bar">
          <span>Status: {status}</span>
          <span>Browser support: {SUPPORTED ? 'Available' : 'Unavailable'}</span>
        </div>

        {error && <div className="error-box">{error}</div>}

        <section className="note-box">
          <h2>Note</h2>
          <p>
            This app now generates a downloadable WAV file entirely in the browser. Playback still uses the browser SpeechSynthesis API.
          </p>
        </section>
      </main>
    </div>
  );
}

export default App;
