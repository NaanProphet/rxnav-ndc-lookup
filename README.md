# rxnav-ndc-lookup

This script queries the NIH's RXNav database in bulk. It looks up a list of NDCs (National Drug Codes) and creates an output CSV with its status and associated information.

## Requirements

- Install NodeJs <https://nodejs.org/en/>
- Install dependencies `npm install`

## Usage

1. Populate `input.csv` with a single column of NDC values, with no header. If the NDC value is less than `11` characters it will be zero padded before being queried.
2. Open Terminal and execute `node run.js`
3. The output will be written to `output.csv` in the same order as the input.

Note: sample input and output files are present as templates. 

## Output Format

The output CSV has five columns:

1. NDC (National Drug Code, this represents the brand ID of the drug-dosage combo)
2. CUI (Concept Unique Identifer, this represents the generic ID of the drug-dosage combo)
3. Status
4. Concept Status
5. Concept Name

## References

See the original REST API at <https://lhncbc.nlm.nih.gov/RxNav/APIs/api-RxNorm.getNDCStatus.html>
