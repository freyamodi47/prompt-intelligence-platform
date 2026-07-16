# Spec: Prompt Analyzer

## What it does
Takes a user's prompt (and optional bad response) and
diagnoses what is wrong with it across 6 dimensions.

## Dimensions scored (each out of 10)
- Clarity — is the instruction clear?
- Context — enough background given?
- Examples — few-shot examples included?
- Format — output format specified?
- Role — is Claude given a persona?
- Constraints — are limits defined?

## Output
- Score for each dimension
- One sentence explaining what is wrong per dimension
- Overall grade (A/B/C/D/F)