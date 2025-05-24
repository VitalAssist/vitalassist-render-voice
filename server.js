const express = require("express");
const cors = require("cors");
const fs = require("fs");
const { exec } = require("child_process");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("VitalAssist voice server is running.");
});

app.post("/api/voice", (req, res) => {
  const text = req.body.text || "Hello from VitalAssist.";
  const filename = `voice_${Date.now()}.mp3`;
  const command = `edge-tts --voice en-US-JennyNeural --text "${text}" --write-media ${filename}`;

  exec(command, (err) => {
    if (err) {
      console.error("TTS Error:", err);
      return res.status(500).send("TTS failed.");
    }
    res.sendFile(__dirname + "/" + filename, () => {
      fs.unlink(filename, () => {});
    });
  });
});

app.listen(PORT, () => {
  console.log(`Voice server running at http://localhost:${PORT}`);
});