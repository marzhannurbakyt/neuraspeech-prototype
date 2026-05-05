# NeuraSpeech Prototype
Early-stage prototype of a speech analysis and feedback system for people who stutter.

## Overview
NeuraSpeech analyzes short speech recordings and extracts measurable fluency features such as:
- pause rate;
- repetition patterns;
- speech rate.
UI is currently in Russian, and an English version is in progress.

The goal is to build a fast feedback loop:
record → analyze → test intervention → re-record → compare.

## Current Status
Working:
- Acoustic feature extraction (pause detection, speech rate, repetitions).
- Basic preprocessing pipeline for recorded audio.
- Structured output for tracking speech metrics.

In progress:
- Action loop (intervention → re-record → comparison).
- Rule-based recommendation system.
- Before/after session tracking.

## How it works
1. User records speech.
2. Audio is processed through analysis pipeline.
3. System extracts fluency metrics.
4. (Next step) system suggests a single testable intervention.
5. User records again → compare results.

## Tech Stack
- Python
- Praat / Parselmouth
- openSMILE (planned)
- Wav2Vec2 (planned for disfluency detection)
- Whisper (planned for alignment)

## Why this exists
Stuttering is highly individual.
The same technique can help one person and worsen another.

Instead of applying generic solutions, this project focuses on:
→ measuring speech patterns;  
→ testing small interventions; 
→ learning what works per individual. 

## Next Steps
- Run concierge pilot with real users.
- Collect before/after speech samples.
- Validate whether small interventions produce measurable changes.
- Transition from rule-based logic → personalized models.

## Disclaimer

This is an early research prototype and not a medical or therapeutic product.
