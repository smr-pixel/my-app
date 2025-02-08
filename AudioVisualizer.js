import React, { useEffect, useRef } from 'react';
import './AudioVisualizer.css';

const AudioVisualizer = ({ audioUrl }) => {
  const audioRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (audioUrl) {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const audioElement = audioRef.current;
      const canvasElement = canvasRef.current;
      const canvasContext = canvasElement.getContext('2d');
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaElementSource(audioElement);

      source.connect(analyser);
      analyser.connect(audioContext.destination);

      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const draw = () => {
        requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);

        canvasContext.fillStyle = 'rgb(0, 0, 0)';
        canvasContext.fillRect(0, 0, canvasElement.width, canvasElement.height);

        const barWidth = (canvasElement.width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          barHeight = dataArray[i];
          canvasContext.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
          canvasContext.fillRect(x, canvasElement.height - barHeight / 2, barWidth, barHeight / 2);
          x += barWidth + 1;
        }
      };

      draw();
    }
  }, [audioUrl]);

  return (
    <div className="audio-visualizer">
      <audio ref={audioRef} src={audioUrl} controls />
      <canvas ref={canvasRef} width="600" height="200"></canvas>
    </div>
  );
};

export default AudioVisualizer;
