#!/bin/bash

echo "🔧 Adding software-crm research entry..."

# Find the line with the marketing-ppc methodology (now the last one)
LAST_METHOD_LINE=$(grep -n "Google Ads Performance Study 2023" src/data/researchData.js | cut -d: -f1)
echo "Found last methodology at line: $LAST_METHOD_LINE"

# Create backup
cp src/data/researchData.js src/data/researchData-before-crm-addition.js

# Create new file with addition
{
    # Everything up to and including the methodology line
    head -n $LAST_METHOD_LINE src/data/researchData.js
    
    # Add the new entry
    echo "  },"
    echo "  'software-crm': {"
    echo "    sources: ['salesforce', 'hubspot', 'pipedrive'],"
    echo "    caseStudies: ["
    echo "      {"
    echo "        company: \"Sales Organization\","
    echo "        industry: \"Professional Services\","
    echo "        investment: 55000,"
    echo "        roi: 320,"
    echo "        timeframe: 8,"
    echo "        description: \"CRM implementation, 40% improvement in sales productivity\""
    echo "      },"
    echo "      {"
    echo "        company: \"Manufacturing Company\","
    echo "        industry: \"Manufacturing\","
    echo "        investment: 70000,"
    echo "        roi: 280,"
    echo "        timeframe: 10,"
    echo "        description: \"Customer relationship management, better lead tracking\""
    echo "      }"
    echo "    ],"
    echo "    benchmarks: {"
    echo "      averageROI: \"250-400%\","
    echo "      implementationTime: \"6-12 months\","
    echo "      paybackPeriod: \"8-15 months\""
    echo "    },"
    echo "    methodology: \"CRM ROI Analysis 2023 and Sales Technology Performance Study\""
    echo "  }"
    echo "};"
    echo ""
    
    # Skip the original closing and add the rest
    tail -n +$((LAST_METHOD_LINE + 3)) src/data/researchData.js
    
} > temp_research_file.js

# Replace original file
mv temp_research_file.js src/data/researchData.js

echo "✅ software-crm addition complete"
