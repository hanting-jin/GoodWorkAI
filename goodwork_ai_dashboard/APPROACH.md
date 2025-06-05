# Sales Dashboard Implementation Approach

## 1. Clarify the Requirements

- Recreate the simple chart with description
- Solve the Imperfect Data issues
- Review the data table
  - 1. Understand the content of data (table headers)
  - 2. Notice some N/A, 0, and missing weeks in the data which need to be handled in the chart
- Read the Plotly library documentation and ask LLM questions and examples about how to use it

## 2. Issues Encountered in the First Stage

- Noticed imperfect data, but needed more information about the data usage, so asked AI questions to understand more about the data
- Searched for basic concepts about data analysis

## 3. Technology Decisions for Solving This Problem

- React as required for building the chart
- Tailwind for styling the project
- TypeScript for handling data types and reducing bugs
- PapaParse for reading the CSV file and converting CSV data to TypeScript types
- React-Plotly.js for building charts

## 4. Codebase Overview

1. The page root is in App.tsx, where data conversion from CSV to JSON happens. After data processing, the data is passed to the child component `<SalesDashboard/>`
2. The components folder includes:
   - Reusable component `<Chart/>`
   - Status management components `<ErrorMessage/>` and `<LoadingSpinner/>`
   - Core component `<SalesDashboard/>` for chart rendering
3. The Utils folder includes reusable functions for formatting dates, numbers, etc.
4. Enums for filter options
5. Types for data types

## 5. Handling Imperfect Data

The dataset contains several data quality issues that were addressed:

1. **Missing Values (NA)**

   - Parsed as `null` in JavaScript
   - Plotly handles null values gracefully by creating gaps in lines
   - No interpolation was applied to maintain data integrity

2. **Zero Values**

   - Preserved as-is since zeros might represent legitimate business periods (e.g., no sales during certain weeks)
   - Distinguished from missing data (NA) to maintain business meaning

3. **Missing Weeks**

   - All fiscal weeks (1-53) are initialized to ensure consistent x-axis alignment
   - Data is sorted by fiscal_week to ensure chronological order
   - Final result includes only weeks with actual data to avoid excessive empty periods
   - This solves the "half chart" issue where different charts show different time ranges

4. **Data Filtering**
   - Filters work independently (banner AND pack_size)
   - "ALL" option aggregates data across all values for that dimension
   - Graceful handling when no data matches filter criteria
