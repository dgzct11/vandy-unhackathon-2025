import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// OpenFDA API endpoint for drug information
const OPENFDA_BASE_URL = 'https://api.fda.gov/drug/label.json';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const drugName = searchParams.get('drug');
  
  if (!drugName) {
    return NextResponse.json(
      { error: 'Drug name is required' },
      { status: 400 }
    );
  }

  try {
    // Search for drug information with pregnancy-related fields
    const response = await axios.get(OPENFDA_BASE_URL, {
      params: {
        search: `openfda.generic_name:"${drugName}" OR openfda.brand_name:"${drugName}"`,
        limit: 5,
      },
    });

    // Extract pregnancy and lactation information
    const results = response.data.results.map((result: any) => {
      // console log the keys of the result
      console.log(result);
      console.log(Object.keys(result));
      console.log(Object.keys(result.openfda));
      let basicInfo =  {
        brandName: result.openfda?.brand_name?.[0] || 'Unknown',
        genericName: result.openfda?.generic_name?.[0] || 'Unknown',
        warnings: result.warnings?.[0] || 'No specific warnings available',
        pregnancyInfo: result.pregnancy?.[0] || 'No specific pregnancy information available',
        lactationInfo: result.lactation?.[0] || 'No specific lactation information available',
        pregnancyCategory: result.pregnancy_category?.[0] || 'Not categorized',
        nursingMothers: result.nursing_mothers?.[0] || 'No specific nursing mothers information available',
        pregnancy_or_breast_feeding: result.pregnancy_or_breast_feeding?.[0] || 'Not categorized',
        laborOrDelivery: result.labor_or_delivery?.[0] || 'Not categorized',
      };
      return basicInfo;
    });

    return NextResponse.json({ results });
  } catch (error: any) {
    console.error('OpenFDA API error:', error.response?.data || error.message);
    
    // Handle API errors
    if (error.response?.status === 404) {
      return NextResponse.json(
        { error: 'Drug information not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch drug information' },
      { status: 500 }
    );
  }
} 