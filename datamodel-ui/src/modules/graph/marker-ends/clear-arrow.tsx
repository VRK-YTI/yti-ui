export default function ClearArrow() {
  return (
    <svg style={{ position: 'absolute', top: 0, left: 0 }}>
      <defs>
        <marker
          id="clearArrow"
          viewBox="0 0 12 12"
          markerHeight={12}
          markerWidth={12}
          refX={11}
          refY={6}
          orient="auto"
        >
          <path
            transform="scale(-1,1) translate(-12,0)"
            d="M10.6426 0.837109L1.05439 6L10.6426 11.1629L10.6426 0.837109Z"
            fill="white"
            stroke="#363535"
          />
        </marker>
      </defs>
    </svg>
  );
}
