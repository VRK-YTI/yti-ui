export default function filterData(data: any, filter: any, language: any) {
  let filteredData = data;

  if (filteredData?.terminologies) {
    filteredData = filteredData.terminologies.filter((terminology: any) => {
      let valid = false;

      if (filter.showByOrg === '' || filter.showByOrg === terminology.contributors[0].label[language]) {
        valid = true;
      }

      if (valid
        && (
          terminology.label[language].toLowerCase().includes(filter.keyword.toLowerCase())
          ||
          terminology.description[language].toLowerCase().includes(filter.keyword.toLowerCase())
        )) {
        valid = true;
      } else {
        valid = false;
      }

      if (valid && filter.status[terminology.status] === true) {
        valid = true;
      } else {
        valid = false;
      }

      // This checks if all all information domains from filter are present in a terminology
      const activeInfoDomains = Object.keys(filter.infoDomains).filter((key: any) => filter.infoDomains[key] === true);
      if (valid && activeInfoDomains.length > 0) {
        valid = activeInfoDomains.every((aid: any) => {
          return (
            terminology.informationDomains?.some((id: any) => {
              return id.label[language] === aid;
            })
          );
        });
      }

      if (valid) return terminology;
    });
    return {...data, terminologies: filteredData};

  } else if (filteredData?.concepts) {
    filteredData = filteredData.concepts.filter((concept: any) => {
      let valid = false;

      if (
        filter.keyword === '' ||
        concept.definition[language].toLowerCase().includes(filter.keyword.toLowerCase()) ||
        concept.label[language].toLowerCase().includes(filter.keyword.toLowerCase())) {
        valid = true;
      }

      if (valid && filter.status[concept.status] === true) {
        valid = true;
      } else {
        valid = false;
      }

      if (valid) return concept;
    });

    return {...data, concepts: filteredData};
  }
}
