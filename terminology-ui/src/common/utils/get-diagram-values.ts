export default function getDiagramValues(diagram: string) {
  if (diagram.length < 1) {
    return {
      name: '',
      url: '',
      description: '',
    };
  }

  const name = diagram.split('{"name":"')[1]?.split('","url"')?.[0] ?? '';
  const url =
    diagram.split('","url":"')[1]?.split('","description"')?.[0] ?? '';
  const description =
    diagram.split('"description":"')[1]?.split('"}')?.[0] ?? '';

  return { name, url, description };
}
