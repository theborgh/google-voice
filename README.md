Node.js script that generates audio files from text files using Google Cloud Text-to-Speech API.

This script processes input text via configurable regular expressions to decide which voice is used for each segment of text. It also keeps track of monthly usage and prevents requests to avoid exceeding a set quota.

The speech synthesis engine used is abstracted, so that the same script can be used with multiple engines with minimal code changes.
