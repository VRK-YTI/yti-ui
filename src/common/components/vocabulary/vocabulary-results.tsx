
function VocabularyResult({concept}: any) {

  return (
    <>
      <div>{concept.label.fi}</div>
      <div>käsite {concept.terminology.status}</div>
      <div>{concept.definition.fi}</div>
    </>
  );
}


export default function VocabularyResults({ concepts }: any) {

  return (
    <>
      {
        concepts ?
          concepts.map((concept: any) => {
            return (
              <div key={concept.id} style={{marginTop: '50px'}}>
                <VocabularyResult concept={concept} />
              </div>
            );
          })
          :
          <></>
      }
    </>
  );
}
