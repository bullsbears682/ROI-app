#!/bin/bash

echo "🔧 Adding cloud-aws research entry..."

# Find the line with the software-crm methodology (now the last one)
LAST_METHOD_LINE=$(grep -n "CRM ROI Analysis 2023" src/data/researchData.js | cut -d: -f1)
echo "Found last methodology at line: $LAST_METHOD_LINE"

# Create backup
cp src/data/researchData.js src/data/researchData-before-aws-addition.js

# Create new file with addition
{
    # Everything up to and including the methodology line
    head -n $LAST_METHOD_LINE src/data/researchData.js
    
    # Add the new entry
    echo "  },"
    echo "  'cloud-aws': {"
    echo "    sources: ['aws', 'gartner', 'forrester'],"
    echo "    caseStudies: ["
    echo "      {"
    echo "        company: \"E-commerce Platform\","
    echo "        industry: \"Technology\","
    echo "        investment: 95000,"
    echo "        roi: 340,"
    echo "        timeframe: 12,"
    echo "        description: \"AWS migration, improved scalability and reduced infrastructure costs\""
    echo "      },"
    echo "      {"
    echo "        company: \"Media Company\","
    echo "        industry: \"Media\","
    echo "        investment: 120000,"
    echo "        roi: 290,"
    echo "        timeframe: 15,"
    echo "        description: \"Cloud-first architecture, enhanced content delivery and performance\""
    echo "      }"
    echo "    ],"
    echo "    benchmarks: {"
    echo "      averageROI: \"250-400%\","
    echo "      implementationTime: \"8-18 months\","
    echo "      paybackPeriod: \"10-20 months\""
    echo "    },"
    echo "    methodology: \"AWS Cloud Economics Study 2023 and Public Cloud ROI Analysis\""
    echo "  }"
    echo "};"
    echo ""
    
    # Skip the original closing and add the rest
    tail -n +$((LAST_METHOD_LINE + 3)) src/data/researchData.js
    
} > temp_research_file.js

# Replace original file
mv temp_research_file.js src/data/researchData.js

echo "✅ cloud-aws addition complete"
