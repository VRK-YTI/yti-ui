# Purpose of this component

`yti-terminology-api` returns a `ExcelImportResponseDTO` object in the REST api response for the Excel import endpoints. These can contain a `ExcelParseException`.

The purpose of this component is to parse the incoming information into something we can use in this project.

The error details are optional in case the excel error throws some other kind of error

This file also contains the components for rendering the given error
