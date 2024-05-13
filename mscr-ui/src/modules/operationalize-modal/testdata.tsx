export const sourceXmlContent = `
<resource xsi:schemaLocation="http://datacite.org/schema/kernel-4 http://schema.datacite.org/meta/kernel-4.1/metadata.xsd">
        <identifier identifierType="DOI">10.5072/example-full</identifier>
    <creators>
        <creator>
            <creatorName nameType="Personal">Miller, Elizabeth</creatorName>
            <givenName>Elizabeth</givenName>
                <familyName>Miller</familyName>
                    <nameIdentifier schemeURI="http://orcid.org/" nameIdentifierScheme="ORCID">0000-0001-5000-0007</nameIdentifier>
                    <affiliation>DataCite</affiliation>
        </creator>
    </creators>
    <titles>
        <title xml:lang="en-US">Full DataCite XML Example</title>
        <title xml:lang="en-US" titleType="Subtitle">Demonstration of DataCite Properties.</title>
    </titles>
    <publisher>DataCite</publisher>
    <publicationYear>2014</publicationYear>
    <subjects>
        <subject xml:lang="en-US" schemeURI="http://dewey.info/" subjectScheme="dewey">000 computer science</subject>
    </subjects>
    <contributors>
        <contributor contributorType="ProjectLeader">
            <contributorName>Starr, Joan</contributorName>
            <givenName>Joan</givenName>
            <familyName>Starr</familyName>
            <nameIdentifier schemeURI="http://orcid.org/" nameIdentifierScheme="ORCID">0000-0002-7285-027X</nameIdentifier>
            <affiliation>California Digital Library</affiliation>
        </contributor>
    </contributors>
    <dates>
        <date dateType="Updated" dateInformation="Updated with 4.1 properties">2017-09-13</date>
    </dates>
    <language>en-US</language>
    <resourceType resourceTypeGeneral="Software">XML</resourceType>
        <alternateIdentifiers>
        <alternateIdentifier alternateIdentifierType="URL">
            https://schema.datacite.org/meta/kernel-4.1/example/datacite-example-full-v4.1.xml
        </alternateIdentifier>
        </alternateIdentifiers>
        <relatedIdentifiers>
            <relatedIdentifier relatedIdentifierType="URL" relationType="HasMetadata" relatedMetadataScheme="citeproc+json" schemeURI="https://github.com/citation-style-language/schema/raw/master/csl-data.json">
                https://data.datacite.org/application/citeproc+json/10.5072/example-full
        </relatedIdentifier>
        <relatedIdentifier relatedIdentifierType="arXiv" relationType="IsReviewedBy" resourceTypeGeneral="Text">arXiv:0706.0001</relatedIdentifier>
    </relatedIdentifiers>
    <sizes>
        <size>4 kB</size>
    </sizes>
<formats>
<format>application/xml</format>
</formats>
<version>4.1</version>
<rightsList>
<rights xml:lang="en-US" rightsURI="http://creativecommons.org/publicdomain/zero/1.0/">CC0 1.0 Universal</rights>
</rightsList>
<descriptions>
<description xml:lang="en-US" descriptionType="Abstract">
XML example of all DataCite Metadata Schema v4.1 properties.
</description>
</descriptions>
<geoLocations>
<geoLocation>
<geoLocationPlace>Atlantic Ocean</geoLocationPlace>
<geoLocationPoint>
<pointLongitude>-67.302</pointLongitude>
<pointLatitude>31.233</pointLatitude>
</geoLocationPoint>
<geoLocationBox>
<westBoundLongitude>-71.032</westBoundLongitude>
<eastBoundLongitude>-68.211</eastBoundLongitude>
<southBoundLatitude>41.090</southBoundLatitude>
<northBoundLatitude>42.893</northBoundLatitude>
</geoLocationBox>
<geoLocationPolygon>
<polygonPoint>
<pointLatitude>41.991</pointLatitude>
<pointLongitude>-71.032</pointLongitude>
</polygonPoint>
<polygonPoint>
<pointLatitude>42.893</pointLatitude>
<pointLongitude>-69.622</pointLongitude>
</polygonPoint>
<polygonPoint>
<pointLatitude>41.991</pointLatitude>
<pointLongitude>-68.211</pointLongitude>
</polygonPoint>
<polygonPoint>
<pointLatitude>41.090</pointLatitude>
<pointLongitude>-69.622</pointLongitude>
</polygonPoint>
<polygonPoint>
<pointLatitude>41.991</pointLatitude>
<pointLongitude>-71.032</pointLongitude>
</polygonPoint>
</geoLocationPolygon>
</geoLocation>
</geoLocations>
<fundingReferences>
<fundingReference>
<funderName>National Science Foundation</funderName>
<funderIdentifier funderIdentifierType="Crossref Funder ID">https://doi.org/10.13039/100000001</funderIdentifier>
<awardNumber>CBET-106</awardNumber>
<awardTitle>Full DataCite XML Example</awardTitle>
</fundingReference>
</fundingReferences>
</resource>`;

export const targetXMLContent = `
<oai_dc:dc xmlns:oai_dc="http://www.openarchives.org/OAI/2.0/oai_dc/" 
    xmlns:dc="http://purl.org/dc/elements/1.1/" 
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
    xsi:schemaLocation="http://www.openarchives.org/OAI/2.0/oai_dc/ http://www.openarchives.org/OAI/2.0/oai_dc.xsd">
    <dc:identifier>https://doi.org/10.5072/example-full</dc:identifier>
    <dc:language>en-US</dc:language>
    <dc:date>2017-09-13</dc:date>
    <dc:rights>http://creativecommons.org/publicdomain/zero/1.0/</dc:rights>
    <dc:type>Software</dc:type>
    <dc:type>XML</dc:type>
    <dc:rights>https://creativecommons.org/licenses/by-nc/4.0/</dc:rights>
    <dc:title>Full DataCite XML Example - Demonstration of DataCite Properties.</dc:title>
    <dc:description>XML example of all DataCite Metadata Schema v4.1 properties. </dc:description>
    <dc:publisher>DataCite</dc:publisher>
    <dc:creator>Miller, Elizabeth</dc:creator>
    <dc:contributor>Starr, Joan</dc:contributor>
    <dc:subject>000 computer science</dc:subject>
</oai_dc:dc>
`;

