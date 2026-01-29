const MusicPlayer = ({ audioUrl, downloadName = "generated-music.mp3", title = "Your Generated Music" }) => {
  if (!audioUrl) {
    return null;
  }

  return (
    <div className="music-result">
      <h2>{title}</h2>
      
      <div className="audio-player">
        <audio controls src={audioUrl} className="audio-element">
          Your browser does not support the audio element.
        </audio>
        <div className="audio-actions">
          <a 
            href={audioUrl} 
            download={downloadName}
            className="download-button"
          >
            Download MP3
          </a>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
