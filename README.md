Node.js script that generates audio files from text files using Google Cloud Text-to-Speech API.

This script processes input text via configurable regular expressions to segment the input and then decide which voice is used for each segment. It also keeps track of monthly usage and prevents requests to avoid exceeding a set quota.

The speech synthesis engine used is abstracted, so that the same script can be used with multiple engines with minimal code changes.

# Getting Started

Clone this repository

```bash
git clone https://github.com/theborgh/speak-transcript.git
```

Install dependencies

```bash
cd google-voice
npm install
```

You must have a Google Cloud account and a project with the Text-to-Speech API enabled. See [Google Cloud Text-to-Speech API Quickstart](https://cloud.google.com/text-to-speech/docs/quickstart-client-libraries) for more information.

Place the text you want to convert in the `input.txt` file. The script will process all text it finds here.

Rename `config.sample.js` to `config.js` and fill in the required information according to how you want the input text to be segmented and whose voice you want to speak each chunk.

You can now run the script:

```bash
npm start
```

it will generate a single audio file named `output.mp3`.
