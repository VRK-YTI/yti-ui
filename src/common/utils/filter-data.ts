export default function filterData(data: any, filter: any, language: any) {
  let filteredData = data;

  filteredData = filteredData?.terminologies.filter((terminology: any) => {
    let valid = false;

    if (filter.showByOrg === '' || filter.showByOrg === terminology.contributors[0].label[language]) {
      valid = true;
    }

    if (valid && filter.status[terminology.status] === true) {
      valid = true;
    } else {
      valid = false;
    }

    // This check if all all information domains from filter are present in a terminology
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
}
