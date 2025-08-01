#!/bin/bash

echo "🔧 Adding marketing-social research entry..."

LAST_METHOD_LINE=$(grep -n "Mobile Commerce Performance Study 2023" src/data/researchData.js | cut -d: -f1)
echo "Found last methodology at line: $LAST_METHOD_LINE"

cp src/data/researchData.js src/data/researchData-before-social-addition.js

{
    head -n $LAST_METHOD_LINE src/data/researchData.js
    echo "  },"
    echo "  'marketing-social': {"
    echo "    sources: ['facebook', 'instagram', 'linkedin'],"
    echo "    caseStudies: ["
    echo "      {"
    echo "        company: \"Beauty Brand\","
    echo "        industry: \"Cosmetics\","
    echo "        investment: 35000,"
    echo "        roi: 420,"
    echo "        timeframe: 6,"
    echo "        description: \"Instagram and TikTok campaigns, viral content strategy, 400% follower growth\""
    echo "      },"
    echo "      {"
    echo "        company: \"B2B Software Company\","
    echo "        industry: \"Technology\","
    echo "        investment: 50000,"
    echo "        roi: 340,"
    echo "        timeframe: 8,"
    echo "        description: \"LinkedIn advertising and thought leadership, improved lead quality\""
    echo "      }"
    echo "    ],"
    echo "    benchmarks: {"
    echo "      averageROI: \"300-500%\","
    echo "      implementationTime: \"3-8 months\","
    echo "      paybackPeriod: \"4-10 months\""
    echo "    },"
    echo "    methodology: \"Social Media Advertising ROI Report 2023 and Platform Performance Analysis\""
    echo "  }"
    echo "};"
    echo ""
    tail -n +$((LAST_METHOD_LINE + 3)) src/data/researchData.js
} > temp_research_file.js

mv temp_research_file.js src/data/researchData.js
echo "✅ marketing-social addition complete"
