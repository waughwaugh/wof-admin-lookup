var through2 = require('through2');
var _ = require('lodash');
var peliasLogger = require( 'pelias-logger' );

// only US is currently supported
// to support more countries, add them in a similar fashion
var regions = {
  'United States': {
    'Alabama': 'AL',
    'Alaska': 'AK',
    'Arizona': 'AZ',
    'Arkansas': 'AR',
    'California': 'CA',
    'Colorado': 'CO',
    'Connecticut': 'CT',
    'Delaware': 'DE',
    'Florida': 'FL',
    'Georgia': 'GA',
    'Hawaii': 'HI',
    'Idaho': 'ID',
    'Illinois': 'IL',
    'Indiana': 'IN',
    'Iowa': 'IA',
    'Kansas': 'KS',
    'Kentucky': 'KY',
    'Louisiana': 'LA',
    'Maine': 'ME',
    'Maryland': 'MD',
    'Massachusetts': 'MA',
    'Michigan': 'MI',
    'Minnesota': 'MN',
    'Mississippi': 'MS',
    'Missouri': 'MO',
    'Montana': 'MT',
    'Nebraska': 'NE',
    'Nevada': 'NV',
    'New Hampshire': 'NH',
    'New Jersey': 'NJ',
    'New Mexico': 'NM',
    'New York': 'NY',
    'North Carolina': 'NC',
    'North Dakota': 'ND',
    'Ohio': 'OH',
    'Oklahoma': 'OK',
    'Oregon': 'OR',
    'Pennsylvania': 'PA',
    'Rhode Island': 'RI',
    'South Carolina': 'SC',
    'South Dakota': 'SD',
    'Tennessee': 'TN',
    'Texas': 'TX',
    'Utah': 'UT',
    'Vermont': 'VT',
    'Virginia': 'VA',
    'Washington': 'WA',
    'Washington, D.C.': 'DC',
    'West Virginia': 'WV',
    'Wisconsin': 'WI',
    'Wyoming': 'WY'
  }
};

var countries = {
  'Equatorial Guinea': 'GNQ',
  'Afghanistan': 'AFG',
  'Angola': 'AGO',
  'Vanuatu': 'VUT',
  'Thailand': 'THA',
  'Benin': 'BEN',
  'Trinidad and Tobago': 'TTO',
  'Western Sahara': 'ESH',
  'South Korea': 'KOR',
  'Cameroon': 'CMR',
  'Comoros': 'COM',
  'Laos': 'LAO',
  'Liberia': 'LBR',
  'Aruba': 'ABW',
  'Indonesia': 'IDN',
  'United Republic of Tanzania': 'TZA',
  'Qatar': 'QAT',
  'Burundi': 'BDI',
  'Botswana': 'BWA',
  'Jamaica': 'JAM',
  'Ethiopia': 'ETH',
  'Madagascar': 'MDG',
  'Zimbabwe': 'ZWE',
  'Ecuador': 'ECU',
  'Oman': 'OMN',
  'Niger': 'NER',
  'Saudi Arabia': 'SAU',
  'Burkina Faso': 'BFA',
  'Ghana': 'GHA',
  'Vatican': 'VAT',
  'Myanmar': 'MMR',
  'Bhutan': 'BTN',
  'Iraq': 'IRQ',
  'Panama': 'PAN',
  'Sint Maarten': 'SXM',
  'Bahrain': 'BHR',
  'Macao S.A.R': 'MAC',
  'Lesotho': 'LSO',
  'Sao Tome and Principe': 'STP',
  'Mozambique': 'MOZ',
  'Eritrea': 'ERI',
  'Vietnam': 'VNM',
  'Australia': 'AUS',
  'Nauru': 'NRU',
  'Azerbaijan': 'AZE',
  'Malaysia': 'MYS',
  'Brunei': 'BRN',
  'Tunisia': 'TUN',
  'Austria': 'AUT',
  'Nigeria': 'NGA',
  'Antarctica': 'ATA',
  'Fiji': 'FJI',
  'Kiribati': 'KIR',
  'Guinea Bissau': 'GNB',
  'Kyrgyzstan': 'KGZ',
  'Cape Verde': 'CPV',
  'Dominican Republic': 'DOM',
  'Sudan': 'SDN',
  'Armenia': 'ARM',
  'Senegal': 'SEN',
  'Kenya': 'KEN',
  'Maldives': 'MDV',
  'Turkey': 'TUR',
  'Papua New Guinea': 'PNG',
  'Saint Pierre and Miquelon': 'SPM',
  'Central African Republic': 'CAF',
  'Venezuela': 'VEN',
  'Palau': 'PLW',
  'The Bahamas': 'BHS',
  'Cambodia': 'KHM',
  'Belarus': 'BLR',
  'Djibouti': 'DJI',
  'Rwanda': 'RWA',
  'Somalia': 'SOM',
  'Guatemala': 'GTM',
  'Grenada': 'GRD',
  'Israel': 'ISR',
  'Paraguay': 'PRY',
  'Mauritius': 'MUS',
  'Guyana': 'GUY',
  'Honduras': 'HND',
  'Andorra': 'AND',
  'Iran': 'IRN',
  'Kazakhstan': 'KAZ',
  'Saint Lucia': 'LCA',
  'Malawi': 'MWI',
  'Sri Lanka': 'LKA',
  'Chad': 'TCD',
  'Macedonia': 'MKD',
  'Belgium': 'BEL',
  'Ukraine': 'UKR',
  'South Africa': 'ZAF',
  'Antigua and Barbuda': 'ATG',
  'Egypt': 'EGY',
  'Argentina': 'ARG',
  'Jersey': 'JEY',
  'Guernsey': 'GGY',
  'Belize': 'BLZ',
  'Solomon Islands': 'SLB',
  'El Salvador': 'SLV',
  'Zambia': 'ZMB',
  'Republic of Congo': 'COG',
  'Colombia': 'COL',
  'Dominica': 'DMA',
  'Nicaragua': 'NIC',
  'Namibia': 'NAM',
  'Philippines': 'PHL',
  'Saint Vincent and the Grenadines': 'VCT',
  'Peru': 'PER',
  'East Timor': 'TLS',
  'Mali': 'MLI',
  'Tajikistan': 'TJK',
  'Saint Kitts and Nevis': 'KNA',
  'Uruguay': 'URY',
  'Lebanon': 'LBN',
  'United Arab Emirates': 'ARE',
  'Samoa': 'WSM',
  'Marshall Islands': 'MHL',
  'Singapore': 'SGP',
  'Morocco': 'MAR',
  'Togo': 'TGO',
  'Turkmenistan': 'TKM',
  'Guinea': 'GIN',
  'North Korea': 'PRK',
  'Uzbekistan': 'UZB',
  'Pakistan': 'PAK',
  'China': 'CHN',
  'Gambia': 'GMB',
  'Libya': 'LBY',
  'Mauritania': 'MRT',
  'Russia': 'RUS',
  'Montenegro': 'MNE',
  'Swaziland': 'SWZ',
  'Bosnia and Herzegovina': 'BIH',
  'South Sudan': 'SSD',
  'Bolivia': 'BOL',
  'Democratic Republic of the Congo': 'COD',
  'Cuba': 'CUB',
  'Seychelles': 'SYC',
  'Tuvalu': 'TUV',
  'Uganda': 'UGA',
  'Sweden': 'SWE',
  'San Marino': 'SMR',
  'United States': 'USA',
  'Palestine': 'PSE',
  'Romania': 'ROU',
  'Slovenia': 'SVN',
  'Portugal': 'PRT',
  'Serbia': 'SRB',
  'Poland': 'POL',
  'Slovakia': 'SVK',
  'Canada': 'CAN',
  'Bulgaria': 'BGR',
  'Brazil': 'BRA',
  'Chile': 'CHL',
  'Switzerland': 'CHE',
  'Moldova': 'MDA',
  'Croatia': 'HRV',
  'Mexico': 'MEX',
  'Greenland': 'GRL',
  'Ireland': 'IRL',
  'Iceland': 'ISL',
  'Latvia': 'LVA',
  'Monaco': 'MCO',
  'Liechtenstein': 'LIE',
  'Luxembourg': 'LUX',
  'Lithuania': 'LTU',
  'Hungary': 'HUN',
  'Italy': 'ITA',
  'Nepal': 'NPL',
  'Costa Rica': 'CRI',
  'Japan': 'JPN',
  'Albania': 'ALB',
  'Barbados': 'BRB',
  'Federated States of Micronesia': 'FSM',
  'Mongolia': 'MNG',
  'Curaçao': 'CUW',
  'Ivory Coast': 'CIV',
  'Indian Ocean Territories': 'CCK',
  'Taiwan': 'TWN',
  'Yemen': 'YEM',
  'Kuwait': 'KWT',
  'Sierra Leone': 'SLE',
  'Tonga': 'TON',
  'Suriname': 'SUR',
  'Bangladesh': 'BGD',
  'Isle of Man': 'IMN',
  'Gabon': 'GAB',
  'India': 'IND',
  'Hong Kong S.A.R.': 'HKG',
  'Cyprus': 'CYP',
  'Syria': 'SYR',
  'Algeria': 'DZA',
  'Haiti': 'HTI',
  'Jordan': 'JOR',
  'Spain': 'ESP',
  'Georgia': 'GEO',
  'Czech Republic': 'CZE',
  'France': 'FRA',
  'Greece': 'GRC',
  'United Kingdom': 'GBR',
  'Estonia': 'EST',
  'Finland': 'FIN',
  'Denmark': 'DNK',
  'Germany': 'DEU',
  'Malta': 'MLT',
  'New Zealand': 'NZL',
  'Norway': 'NOR',
  'Netherlands': 'NLD'
};

countries.isSupported = function(country) {
  return this.hasOwnProperty(country);
};

countries.getAbbreviation = function(countries) {
  if (_.isEmpty(countries)) {
    return undefined;
  }

  if (this.isSupported(countries[0].name)) {
    return this[countries[0].name];
  }

  return undefined;

};

regions.isSupportedRegion = function(country, name) {
  return this.hasOwnProperty(country) && this[country].hasOwnProperty(name);
};

regions.getAbbreviation = function(countries, regions) {
  if (_.isEmpty(countries) || _.isEmpty(regions)) {
    return undefined;
  }

  var country = countries[0].name;
  var region = regions[0].name;

  if (this.isSupportedRegion(country, region)) {
    return this[country][region];
  }

  return undefined;

};

function setFields(values, doc, qsFieldName, wofFieldName, abbreviation) {
  if (!_.isEmpty(values)) {
    doc.setAdmin( qsFieldName, values[0].name);
    doc.addParent( wofFieldName, values[0].name, values[0].id.toString(), abbreviation);
  }
}

function hasCountry(result) {
  return _.isEmpty(result.country);
}

function hasAnyMultiples(result) {
  return Object.keys(result).some(function(element) {
    return result[element].length > 1;
  });
}

function createLookupStream(resolver) {
  var logger = peliasLogger.get( 'whosonfirst', {
    transports: [
      new peliasLogger.winston.transports.File( {
        filename: 'suspect_wof_records.log',
        timestamp: false
      })
    ]
  });

  return through2.obj(function(doc, enc, callback) {
    // don't do anything if there's no centroid
    if (_.isEmpty(doc.getCentroid())) {
      return callback(null, doc);
    }

    resolver(doc.getCentroid(), function(err, result) {
      if (err) {
        return callback(err, doc);
      }

      // log results w/o country OR any multiples
      if (hasCountry(result)) {
        logger.info('no country', {
          centroid: doc.getCentroid(),
          result: result
        });
      }
      if (hasAnyMultiples(result)) {
        logger.info('multiple values', {
          centroid: doc.getCentroid(),
          result: result
        });
      }

      var regionAbbr = regions.getAbbreviation(result.country, result.region);
      var countryAbbr = countries.getAbbreviation(result.country);

      if (!_.isUndefined(countryAbbr)) {
        doc.setAlpha3(countryAbbr);
      }

      setFields(result.country, doc, 'admin0', 'country');
      setFields(result.region, doc, 'admin1', 'region', regionAbbr);
      setFields(result.county, doc, 'admin2', 'county');
      setFields(result.locality, doc, 'locality', 'locality');
      setFields(result.localadmin, doc, 'local_admin', 'localadmin');
      setFields(result.neighbourhood, doc, 'neighborhood', 'neighbourhood');

      callback(null, doc);

    });

  });

}

module.exports = {
  createLookupStream: createLookupStream
};
