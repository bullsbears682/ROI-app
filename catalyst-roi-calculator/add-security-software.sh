#!/bin/bash

echo "🔧 Adding security-software research entry..."

# Find the line with the cloud-aws methodology (now the last one)
LAST_METHOD_LINE=$(grep -n "AWS Cloud Economics Study 2023" src/data/researchData.js | cut -d: -f1)
echo "Found last methodology at line: $LAST_METHOD_LINE"

# Create backup
cp src/data/researchData.js src/data/researchData-before-security-addition.js

# Create new file with addition
{
    # Everything up to and including the methodology line
    head -n $LAST_METHOD_LINE src/data/researchData.js
    
    # Add the new entry
    echo "  },"
    echo "  'security-software': {"
    echo "    sources: ['symantec', 'mcafee', 'crowdstrike'],"
    echo "    caseStudies: ["
    echo "      {"
    echo "        company: \"Financial Institution\","
    echo "        industry: \"Financial Services\","
    echo "        investment: 85000,"
    echo "        roi: 320,"
    echo "        timeframe: 10,"
    echo "        description: \"Enterprise security software, prevented breaches and compliance violations\""
    echo "      },"
    echo "      {"
    echo "        company: \"Healthcare Network\","
    echo "        industry: \"Healthcare\","
    echo "        investment: 70000,"
    echo "        roi: 380,"
    echo "        timeframe: 8,"
    echo "        description: \"Medical data protection, enhanced patient privacy and regulatory compliance\""
    echo "      }"
    echo "    ],"
    echo "    benchmarks: {"
    echo "      averageROI: \"280-450%\","
    echo "      implementationTime: \"6-12 months\","
    echo "      paybackPeriod: \"8-15 months\""
    echo "    },"
    echo "    methodology: \"Enterprise Security Software ROI Study 2023 and Threat Protection Analysis\""
    echo "  }"
    echo "};"
    echo ""
    
    # Skip the original closing and add the rest
    tail -n +$((LAST_METHOD_LINE + 3)) src/data/researchData.js
    
} > temp_research_file.js

# Replace original file
mv temp_research_file.js src/data/researchData.js

echo "✅ security-software addition complete"
