export default function SearchResult({ id, index }: { id: string; index: string }) {
  return (
    <div>
      <h4>This is a search result indexed {index} with id {id}</h4>
    </div>
  );
}
