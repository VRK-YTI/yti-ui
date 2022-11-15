import { themeProvider } from "@app/tests/test-utils";
import { render, screen } from "@testing-library/react";
import ResultCardExpander from "./result-card-expander";

describe("result-card-expander", () => {
  it("should render component", () => {
    render(
      <ResultCardExpander
        buttonLabel="button-label"
        contentLabel="content-label"
        deepHits={[
          {
            topHits: [
              {
                id: "123-123",
                label: {
                  fi: "hit-label",
                },
                status: "DRAFT",
                uri: "https://suomi.fi",
              },
            ],
            totalHitCount: 1,
            type: "CONCEPT",
          },
        ]}
      />,
      { wrapper: themeProvider }
    );

    expect(screen.getByText(/button-label/)).toBeInTheDocument();
    expect(screen.getByText(/content-label/)).toBeInTheDocument();
    expect(screen.getAllByText(/hit-label/)).toHaveLength(2);
  });

  it("should render commas correctly", () => {
    render(
      <ResultCardExpander
        buttonLabel="button-label"
        contentLabel="content-label"
        deepHits={[
          {
            topHits: [
              {
                id: "123-123",
                label: {
                  fi: "hit-label1",
                },
                status: "DRAFT",
                uri: "https://suomi.fi",
              },
              {
                id: "456-456",
                label: {
                  fi: "hit-label2",
                },
                status: "DRAFT",
                uri: "https://suomi.fi",
              },
              {
                id: "789-789",
                label: {
                  fi: "hit-label3",
                },
                status: "DRAFT",
                uri: "https://suomi.fi",
              },
            ],
            totalHitCount: 3,
            type: "CONCEPT",
          },
        ]}
      />,
      { wrapper: themeProvider }
    );

    expect(
      screen.getByText((_, node) => {
        const includesText = (node: Element | null) =>
          node?.textContent === "hit-label1, hit-label2, hit-label3";
        return includesText(node);
      })
    ).toBeValid();
  });

  it('should render commas "+ more" information correctly', () => {
    render(
      <ResultCardExpander
        buttonLabel="button-label"
        contentLabel="content-label"
        deepHits={[
          {
            topHits: [
              {
                id: "123-123",
                label: {
                  fi: "hit-label1",
                },
                status: "DRAFT",
                uri: "https://suomi.fi",
              },
              {
                id: "456-456",
                label: {
                  fi: "hit-label2",
                },
                status: "DRAFT",
                uri: "https://suomi.fi",
              },
              {
                id: "789-789",
                label: {
                  fi: "hit-label3",
                },
                status: "DRAFT",
                uri: "https://suomi.fi",
              },
              {
                id: "321-321",
                label: {
                  fi: "hit-label4",
                },
                status: "DRAFT",
                uri: "https://suomi.fi",
              },
              {
                id: "654-654",
                label: {
                  fi: "hit-label5",
                },
                status: "DRAFT",
                uri: "https://suomi.fi",
              },
              {
                id: "987-987",
                label: {
                  fi: "hit-label6",
                },
                status: "DRAFT",
                uri: "https://suomi.fi",
              },
            ],
            totalHitCount: 6,
            type: "CONCEPT",
          },
        ]}
      />,
      { wrapper: themeProvider }
    );

    expect(
      screen.getByText((_, node) => {
        const includesText = (node: Element | null) =>
          node?.textContent ===
          "hit-label1, hit-label2, hit-label3 + 3 tr-vocabulary-results-more";
        return includesText(node);
      })
    ).toBeValid();

    expect(screen.getByText(/hit-label4/)).toBeInTheDocument();
    expect(screen.getByText(/hit-label5/)).toBeInTheDocument();
    expect(screen.getByText(/hit-label6/)).toBeInTheDocument();
  });
});
