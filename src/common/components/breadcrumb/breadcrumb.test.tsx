import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { ThemeProvider } from "styled-components";
import { Breadcrumb, BreadcrumbLink } from ".";
import { lightTheme } from "../../../layouts/theme";
import { makeStore } from "../../../store";

describe("breadcrumb", () => {
  test("should render component", () => {
    const store = makeStore();

    render(
      <Provider store={store}>
        <ThemeProvider theme={lightTheme}>
          <Breadcrumb>
            <BreadcrumbLink url={"/terminology/123123"} current>
              terminology
            </BreadcrumbLink>
          </Breadcrumb>
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByText("tr-terminology-title")).toBeInTheDocument;
    expect(screen.getByText("terminology")).toBeInTheDocument;
  });

  test("should render entire path", () => {
    const store = makeStore();

    render(
      <Provider store={store}>
        <ThemeProvider theme={lightTheme}>
          <Breadcrumb>
            <BreadcrumbLink url="/terminology/test123">test</BreadcrumbLink>
            <BreadcrumbLink url="" current>
              concept-title
            </BreadcrumbLink>
          </Breadcrumb>
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByText("concept-title")).toBeInTheDocument;
    expect(screen.getByText("test")).toBeInTheDocument;
    expect(screen.getByText("tr-terminology-title")).toBeInTheDocument;
  });

  test('should have one crumb to have status of "current"', () => {
    const store = makeStore();

    render(
      <Provider store={store}>
        <ThemeProvider theme={lightTheme}>
          <Breadcrumb>
            <BreadcrumbLink url="/terminology/test123">test</BreadcrumbLink>
            <BreadcrumbLink url="" current>
              concept-title
            </BreadcrumbLink>
          </Breadcrumb>
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByText("concept-title")).toBeInTheDocument;
    expect(screen.getByText("concept-title").getAttribute("class")).toMatch(
      /current/
    );

    expect(screen.getByText("test")).toBeInTheDocument;
    expect(screen.getByText("test").getAttribute("class")).not.toMatch(
      /current/
    );

    expect(screen.getByText("tr-terminology-title")).toBeInTheDocument;
    expect(
      screen.getByText("tr-terminology-title").getAttribute("class")
    ).not.toMatch(/current/);
  });
});
