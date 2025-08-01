#!/bin/bash

echo "🔧 Adding ecom-b2b research entry..."

LAST_METHOD_LINE=$(grep -n "Amazon Marketplace Performance Report 2023" src/data/researchData.js | cut -d: -f1)
echo "Found last methodology at line: $LAST_METHOD_LINE"

cp src/data/researchData.js src/data/researchData-before-b2b-addition.js

{
    head -n $LAST_METHOD_LINE src/data/researchData.js
    echo "  },"
    echo "  'ecom-b2b': {"
    echo "    sources: ['magento', 'salesforce', 'sap'],"
    echo "    caseStudies: ["
    echo "      {"
    echo "        company: \"Manufacturing Supplier\","
    echo "        industry: \"Manufacturing\","
    echo "        investment: 180000,"
    echo "        roi: 290,"
    echo "        timeframe: 14,"
    echo "        description: \"B2B portal implementation, streamlined ordering and customer self-service\""
    echo "      },"
    echo "      {"
    echo "        company: \"Wholesale Distributor\","
    echo "        industry: \"Distribution\","
    echo "        investment: 220000,"
    echo "        roi: 250,"
    echo "        timeframe: 16,"
    echo "        description: \"Enterprise B2B platform, improved customer relationships and order processing\""
    echo "      }"
    echo "    ],"
    echo "    benchmarks: {"
    echo "      averageROI: \"200-350%\","
    echo "      implementationTime: \"10-20 months\","
    echo "      paybackPeriod: \"12-24 months\""
    echo "    },"
    echo "    methodology: \"B2B eCommerce Platform Study 2023 and Enterprise Portal ROI Analysis\""
    echo "  }"
    echo "};"
    echo ""
    tail -n +$((LAST_METHOD_LINE + 3)) src/data/researchData.js
} > temp_research_file.js

mv temp_research_file.js src/data/researchData.js
echo "✅ ecom-b2b addition complete"
